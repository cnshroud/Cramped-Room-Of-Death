
import { _decorator, assert, Component, error, Layers, Node, random, resources, Sprite, spriteAssembler, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils';
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
     //瓦片地图信息是一个二维数组，所以用双重for循环遍历出每一片瓦片的src和type
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
        //瓦片随机图片,只随机i和j都为偶数的瓦片
        let number = item.src
        if((number===1 ||number===5 ||number===9) &&i%2===0&&j%2===0 ){
          number+=randomByRange(0,4)
        }

        //通过瓦片的src拼接一个瓦片的图片名称
        const imgSrc = `tile (${number})`
        //创建瓦片节点
        const node = createUINode()
         //通过cocos的资源加载获取resources中的瓦片资源,根据imgSrc来找，拿不到就拿第一张图片
        const spriteFrame = spriteFrames.find(v=>v.name===imgSrc) ||spriteFrames[0]
        //给节点加上TileManager方法
        const tileManager=  node.addComponent(TileManager)
        tileManager.init(spriteFrame,i,j)
        //给瓦片设置为该节点的子类
        node.setParent(this.node)
    }
  }
}

}
