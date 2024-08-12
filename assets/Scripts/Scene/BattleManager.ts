
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { DataManager } from '../../Runtime/DataManager';
import { EventManager } from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enum';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
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

            this.generateEnemies()
            this.generatePlayer()
            this.generateDoor()
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
        await playerManager.init()
        DataManager.Instance.player=playerManager
        //当玩家生成是调用玩家出生事件
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }
    //加载敌人
    async generateEnemies(){
        const enemy= createUINode()
        enemy.setParent(this.stage)
        const woodenSkeletonManager=enemy.addComponent(WoodenSkeletonManager)
        await woodenSkeletonManager.init()
        DataManager.Instance.enemies.push(woodenSkeletonManager)
    }
    //加载门
    async generateDoor(){
        const door= createUINode()
        door.setParent(this.stage)
        const doorManager=door.addComponent(DoorManager)
        await doorManager.init()
        DataManager.Instance.door=doorManager
        console.log('门加载完成')
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
