
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel
    //舞台节点
    stage:Node


    onLoad(){
        //想加载哪一关改这一行就行了
        DataManager.Instance.levelIndex=1
        //加载时在渲染中添加nextLevel方法
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this)
    }
    onDestroy(){
         //加载时在渲染中添加nextLevel方法
         EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel)
    }

    start() {
       this.generateStage()
        this.initLevel()

    }

    initLevel(){
        const level = levels[`Level${DataManager.Instance.levelIndex}`]
        if(level){
            //加载地图前先清空上个地图的信息
            this.clearLevel()
            //加载地图
            this.level=level
            DataManager.Instance.mapInfo=this.level.mapInfo
            DataManager.Instance.mapRowCount=this.level.mapInfo.length ||0
            DataManager.Instance.mapColCount=this.level.mapInfo[0].length ||0
            this.generateTileMap()
            this.generateBurst()
            this.generateEnemies()
            this.generateDoor()
            this.generateSpikes()
            this.generatePlayer()
        }
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
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }

    async generateTileMap() {
        //这个游戏有大部分东西都要放到一个对象上的，例如瓦片和人
        const tileMap= createUINode()
        await tileMap.setParent(this.stage)
        const titleMapManager=tileMap.addComponent(TileMapManager)
        titleMapManager.init()
        this.adaptPos()
    }
    //加载玩家
    async generatePlayer(){
        const player= createUINode()
        player.setParent(this.stage)
        const playerManager=player.addComponent(PlayerManager)
        //玩家初始化位置
        await playerManager.init(this.level.player)
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

    //适配屏幕的方法
    adaptPos(){
        const{mapColCount,mapRowCount}=DataManager.Instance
        const disx= TILE_WIDTH*mapRowCount/2
        const disy= TILE_HEIGHT*mapColCount/2+80
        //思路：地图的左上角是他的原点，只要让地图偏移到地图的一半即可
        //获取地图大小
        this.stage.setPosition(-disx,disy)
    }


}
