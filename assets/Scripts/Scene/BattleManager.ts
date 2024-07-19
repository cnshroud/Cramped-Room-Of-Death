
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {


    start() {
        console.log('这是start')
        //生成瓦片地图
        this.generateTileMap();
        console.log('这是generateTileMap')

    }

    generateTileMap() {
        //这个游戏有大部分东西都要放到一个对象上的，例如瓦片和人
     const stage = new Node()
        stage.setParent(this.node)
        console.log('这是stage',stage)

        const tileMap= new Node()

        tileMap.setParent(stage)
        console.log('这是tileMap',tileMap)
        const titleMapManager=tileMap.addComponent(TileMapManager)
        console.log('这是地图资源',titleMapManager)
        titleMapManager.init()
    }
}
