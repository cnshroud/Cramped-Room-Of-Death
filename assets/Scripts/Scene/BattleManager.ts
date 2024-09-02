
import { _decorator, Component, director, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { DataManager, IRecord } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enum';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import { SmokeManager } from '../Smoke/SmokeManager';
import { FaderManager } from '../../Runtime/FaderManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { StakeManager } from '../UI/StakeManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel
    //舞台节点
    stage:Node
    //判断渐入渐出动画是否已经加载过
    private inited=false
    private smokeLayer:Node
    onLoad(){
        //想加载哪一关改这一行就行了
        DataManager.Instance.levelIndex=1
        //加载时在渲染中添加nextLevel方法
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived,this)
        //加载烟幕
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE,this.generateSmoke,this)
        //加载记录步数
        EventManager.Instance.on(EVENT_ENUM.RECODE_STEP,this.record,this)
        //加载撤销步数
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP,this.revoke,this)
        //加载重新关卡
        EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL,this.initLevel,this)
        //加载退回主页
        EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE,this.outBattle,this)

    }
    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel)
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived)
        EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE,this.generateSmoke)
        EventManager.Instance.off(EVENT_ENUM.RECODE_STEP,this.record)
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP,this.revoke)
        EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL,this.initLevel)
        EventManager.Instance.off(EVENT_ENUM.OUT_BATTLE,this.outBattle)
    }

    start() {
       this.generateStage()
        this.initLevel()

    }

    async initLevel(){
        const level = levels[`level${DataManager.Instance.levelIndex}`]

        console.log("加载关卡",level)

        if(level){
            //加入渐入渐出动画
            if(this.inited){

                await FaderManager.Instance.fadeIn()
             }else{
                //让他一直黑着
                await FaderManager.Instance.mask()
            }
            console.log("渐入渐出动画")
            //加载地图前先清空上个地图的信息
            this.clearLevel()
            //加载地图
            this.level=level
            DataManager.Instance.mapInfo=this.level.mapInfo
            DataManager.Instance.mapRowCount=this.level.mapInfo.length ||0
            DataManager.Instance.mapColCount=this.level.mapInfo[0].length ||0
            // 等待资源加载完才会执行下面的fadeout方法
            await Promise.all([
                this.generateTileMap(),
                this.generateBurst(),
                this.generateSpikes(),
                //把烟雾预先加载不让烟雾图层在玩家之上
                this.generateSmokeLayer(),
                this.generateEnemies(),
                this.generateDoor(),
            ])
            await this.generatePlayer(),
            await FaderManager.Instance.fadeOut()
            this.inited=true

        }else{
            this.outBattle()
        }
    }
    async outBattle(){
        await FaderManager.Instance.fadeIn()
        director.loadScene(SCENE_ENUM.START)
    }
    //下一关
    nextLevel(){
        DataManager.Instance.levelIndex++
        //重新调用加载地图方法
        this.initLevel()
    }
    //清空地图信息
    clearLevel(){
        //不清空会导致第二关的地图位置等没被修改
        //清空元素
        this.stage.destroyAllChildren()
        //把数据中心的相关数据清空
        DataManager.Instance.reset()

    }
    generateStage(){
        console.log("生成舞台")
        this.stage = createUINode()
        this.stage.setParent(this.node)
        //震动效果
        this.stage.addComponent(StakeManager)
    }
    //生成地图
    async generateTileMap() {
        //这个游戏有大部分东西都要放到一个对象上的，例如瓦片和人
        const tileMap= createUINode()
        tileMap.setParent(this.stage)
        const titleMapManager=tileMap.addComponent(TileMapManager)
        await titleMapManager.init()
        this.adaptPos()
    }
    //适配屏幕的方法
    adaptPos(){
        const{mapColCount,mapRowCount}=DataManager.Instance
        const disx= TILE_WIDTH*mapRowCount/2
        const disy= TILE_HEIGHT*mapColCount/2+80
        //适配屏幕的时候让震动停止
        this.stage.getComponent(StakeManager).stop()
        //思路：地图的左上角是他的原点，只要让地图偏移到地图的一半即可
        //获取地图大小
        this.stage.setPosition(-disx,disy)
    }

    //加载玩家
    async generatePlayer(){
        const player= createUINode()
        player.setParent(this.stage)
        const playerManager=player.addComponent(PlayerManager)
        //玩家初始化位置
        await playerManager.init(this.level.player)
        //把玩家信息放到数据中心
        DataManager.Instance.player=playerManager
        //当玩家生成是调用玩家出生事件
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    //加载敌人
    async generateEnemies(){
        const promise=[]
        //遍历敌人数组
        for(let i=0;i<this.level.enemies.length;i++){
            const enemy=this.level.enemies[i]
            const node= createUINode()
            node.setParent(this.stage)
            //根据敌人的类型来创建不同的敌人
            const Manager=enemy.type===ENTITY_TYPE_ENUM.SKELETON_WOODEN? WoodenSkeletonManager:IronSkeletonManager
            const manager=node.addComponent(Manager)
            promise.push(manager.init(enemy))
            DataManager.Instance.enemies.push(manager)

        }
        await Promise.all(promise)

    }

    //加载门
    async generateDoor(){
        const player= createUINode()
        player.setParent(this.stage)
        const doorManager=player.addComponent(DoorManager)
        await doorManager.init(this.level.door)
        DataManager.Instance.door=doorManager
    }

    //加载地裂砖块
    async generateBurst(){
        const promise=[]
        //遍历敌人数组
        for(let i=0;i<this.level.bursts.length;i++){
            const burst=this.level.bursts[i]
            const node= createUINode()
            node.setParent(this.stage)
            const burstManager=node.addComponent(BurstManager)
            promise.push(burstManager.init(burst))
            DataManager.Instance.bursts.push(burstManager)

        }
        await Promise.all(promise)

    }
    //加载地刺
    async generateSpikes(){

        const promise=[]
        //遍历敌人数组
        for(let i=0;i<this.level.spikes.length;i++){
            const spike=this.level.spikes[i]
            const node= createUINode()
            node.setParent(this.stage)
            const spikesManager=node.addComponent(SpikesManager)
            promise.push(spikesManager.init(spike))
            DataManager.Instance.spikes.push(spikesManager)

        }
        await Promise.all(promise)
    }

    async generateSmoke(x:number,y:number,direction:DIRECTION_ENUM){
        //因为烟雾init会一直创建节点，为了节约资源可以从已有数组中找到死掉的烟雾，如果找不到就创建新的
        const item = DataManager.Instance.smokes.find(smoke=>smoke.state===ENTITY_STATE_ENUM.DEATH)
        if(item){
            item.x=x
            item.y=y
            item.direction=direction
            item.state=ENTITY_STATE_ENUM.IDLE
            this.node.setPosition(x*TILE_WIDTH-TILE_WIDTH*1.5,-y*TILE_HEIGHT+TILE_HEIGHT*1.5)
        }else{
        const smoke= createUINode()
        smoke.setParent(this.smokeLayer)
        const smokeManager=smoke.addComponent(SmokeManager)
        await smokeManager.init({
            x,
            y,
            direction,
            state:ENTITY_STATE_ENUM.IDLE,
            type:ENTITY_TYPE_ENUM.SMOKE
        })
        DataManager.Instance.smokes.push(smokeManager)
        }
    }
    async generateSmokeLayer(){
        //生成烟雾时把父节点设置为smokeLayer这样就人物就能盖住烟雾
        this.smokeLayer= createUINode()
        this.smokeLayer.setParent(this.stage)
    }

    //检测玩家是否到达门的位置
    checkArrived(){
        if(!DataManager.Instance.player||!DataManager.Instance.door) {
            return
        }
        const {x:playerX,y:playerY}=DataManager.Instance.player
        const {x:doorX,y:doorY,state:doorState}=DataManager.Instance.door
        if(playerX===doorX&&playerY===doorY&&doorState===ENTITY_STATE_ENUM.DEATH){
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }

    }

    record(){
        //保存场景数据
        const item :IRecord={
            player:{
                x:DataManager.Instance.player.x,
                y:DataManager.Instance.player.y,
                direction:DataManager.Instance.player.direction,
                state:
                    DataManager.Instance.player.state===ENTITY_STATE_ENUM.IDLE||
                    DataManager.Instance.player.state===ENTITY_STATE_ENUM.DEATH||
                    DataManager.Instance.player.state===ENTITY_STATE_ENUM.AIRDEATH
                        ?DataManager.Instance.player.state
                        :ENTITY_STATE_ENUM.IDLE,
                type:DataManager.Instance.player.type,
            },
            door:{
                x:DataManager.Instance.door.x,
                y:DataManager.Instance.door.y,
                direction:DataManager.Instance.door.direction,
                state:DataManager.Instance.door.state,
                type:DataManager.Instance.door.type,
            },
            enemies:DataManager.Instance.enemies.map(({x,y,direction,state,type})=>({
                x,
                y,
                direction,
                state,
                type,
            })),
            bursts:DataManager.Instance.bursts.map(({x,y,direction,state,type})=>({
                x,
                y,
                direction,
                state,
                type,
            })),
            spikes:DataManager.Instance.spikes.map(({x,y,count,type})=>({
                x,
                y,
                count,
                type,
            }))
        }
        //datamanager保存数据
        DataManager.Instance.records.push(item)
    }

    //数据撤回
    revoke(){
        const item = DataManager.Instance.records.pop()
        if(item){
            DataManager.Instance.player.x=DataManager.Instance.player.targetX=item.player.x
            DataManager.Instance.player.y=DataManager.Instance.player.targetY=item.player.y
            DataManager.Instance.player.direction=item.player.direction
            DataManager.Instance.player.state=item.player.state

            DataManager.Instance.door.x=item.door.x
            DataManager.Instance.door.y=item.door.y
            DataManager.Instance.door.direction=item.door.direction
            DataManager.Instance.door.state=item.door.state

            //遍历敌人数组
            for (let index = 0; index < DataManager.Instance.enemies.length; index++) {
                const enemy = item.enemies[index];
                DataManager.Instance.enemies[index].x=enemy.x
                DataManager.Instance.enemies[index].y=enemy.y
                DataManager.Instance.enemies[index].direction=enemy.direction
                DataManager.Instance.enemies[index].state=enemy.state
            }

            for (let index = 0; index < DataManager.Instance.bursts.length; index++) {
                const burst = item.bursts[index];
                DataManager.Instance.bursts[index].x=burst.x
                DataManager.Instance.bursts[index].y=burst.y
                DataManager.Instance.bursts[index].direction=burst.direction
                DataManager.Instance.bursts[index].state=burst.state
            }

            for (let index = 0; index < DataManager.Instance.spikes.length; index++) {
                const spike = item.spikes[index];
                DataManager.Instance.spikes[index].x=spike.x
                DataManager.Instance.spikes[index].y=spike.y
                DataManager.Instance.spikes[index].count=spike.count
                DataManager.Instance.spikes[index].type=spike.type
            }
        }
    }

}
