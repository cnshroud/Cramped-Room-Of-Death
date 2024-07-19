
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { DataManager } from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel
    stage:Node
    start() {
       this.generateStage()
        this.initLevel()

    }

    initLevel(){
        const level = levels[`Level${1}`]
        if(level){
            this.level=level
            DataManager.Instance.mapInfo=this.level.mapInfo
            DataManager.Instance.mapRowCount=this.level.mapInfo.length ||0
            DataManager.Instance.mapColCount=this.level.mapInfo[0].length ||0


            this.generateTileMap()
        }
    }
    generateStage(){
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }

    generateTileMap() {
        //这个游戏有大部分东西都要放到一个对象上的，例如瓦片和人
        const tileMap= createUINode()

        tileMap.setParent(this.stage)
        const titleMapManager=tileMap.addComponent(TileMapManager)
        titleMapManager.init()
        this.adaptPos()
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
