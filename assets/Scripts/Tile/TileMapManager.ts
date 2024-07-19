
import { _decorator, assert, Component, error, Layers, Node, resources, Sprite, spriteAssembler, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../Levels';
import { TileManager } from './TileManager';
import { createUINode } from '../../Utils';
import { DataManager } from '../../Runtime/DataManager';
import { ResourceManager } from '../../Runtime/ResourceManager';



//图片宽高
export const TILE_WIDTH=55
export const TILE_HEIGHT=55


@ccclass('TileMapManager')
export class TileMapManager extends Component {


    //瓦片地图动态生成
  async init(){
    //

     const spriteFrames = await ResourceManager.Instance.loadDir("texture/tile/tile")
     const {mapInfo} = DataManager.Instance
    for(let i = 0; i < mapInfo.length; i++){
      //每一列
      const column = mapInfo[i]
      //每一项
      for(let j = 0; j < column.length; j++){
        const item = column[j]
        //跳过为null的瓦片
        if(item.src===null ||item.type===null){
          continue
        }

//
        const imgSrc = `tile (${item.src})`
        //创建瓦片节点
        const node = createUINode()
         //通过cocos的资源加载获取resources中的瓦片资源,拿不到就拿第一张图片
        const spriteFrame = spriteFrames.find(v=>v.name===imgSrc) ||spriteFrames[5]
        const tileManager=  node.addComponent(TileManager)
        tileManager.init(spriteFrame,i,j)

        node.setParent(this.node)
    }
  }
}

}
