
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
        await playerManager.init({
            x:2,
            y:8,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
        })
        DataManager.Instance.player=playerManager
        //当玩家生成是调用玩家出生事件
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    //加载敌人
    async generateEnemies(){
        const enemy1= createUINode()
        enemy1.setParent(this.stage)
        const woodenSkeletonManager=enemy1.addComponent(WoodenSkeletonManager)
        await woodenSkeletonManager.init({
            x:2,
            y:5,
            type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
           })
        DataManager.Instance.enemies.push(woodenSkeletonManager)

        const enemy2= createUINode()
        enemy2.setParent(this.stage)
        const ironSkeletonManager=enemy2.addComponent(IronSkeletonManager)
        await ironSkeletonManager.init({
            x:7,
            y:6,
            type:ENTITY_TYPE_ENUM.SKELETON_IRON,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
           })
        DataManager.Instance.enemies.push(ironSkeletonManager)

    }

    //加载门
    async generateDoor(){
        const door= createUINode()
        door.setParent(this.stage)
        const doorManager=door.addComponent(DoorManager)
        await doorManager.init({
            x:7,
            y:8,
            type:ENTITY_TYPE_ENUM.DOOR,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
           })
        DataManager.Instance.door=doorManager
    }

    //加载地裂砖块
    async generateBurst(){
        const burst= createUINode()
        burst.setParent(this.stage)
        const burstManager=burst.addComponent(BurstManager)
        await burstManager.init({
            x:2,
            y:6,
            type:ENTITY_TYPE_ENUM.BURST,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
           })
        DataManager.Instance.bursts.push(burstManager)
    }
    //加载地刺
    async generateSpikes(){
        const spikes= createUINode()
        spikes.setParent(this.stage)
        const spikesManager=spikes.addComponent(SpikesManager)
        await spikesManager.init({
            x:1,
            y:6,
            type:ENTITY_TYPE_ENUM.SPIKES_FOUR,
            count:0,
           })
        DataManager.Instance.spikes.push(spikesManager)
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
