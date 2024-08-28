
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils';
import { DataManager } from '../../Runtime/DataManager';
import { ResourceManager } from '../../Runtime/ResourceManager';



// //图片宽高
// export const TILE_WIDTH=55
// export const TILE_HEIGHT=55


@ccclass('TileMapManager')
export class TileMapManager extends Component {
    //显示瓦片地图
  async init(){
    //
     const spriteFrames = await ResourceManager.Instance.loadDir("texture/tile/tile")
     const {mapInfo} = DataManager.Instance
    //加载dataManager中的地图信息
    DataManager.Instance.tileInfo=[]

     //瓦片地图信息是一个二维数组，所以用双重for循环遍历出每一片瓦片的src和type
    for(let i = 0; i < mapInfo.length; i++){
      //每一列
      const column = mapInfo[i]
      DataManager.Instance.tileInfo[i]=[]
      //每一项
      for(let j = 0; j < column.length; j++){
        const item = column[j]
        //跳过为null的瓦片
        if(item.src===null ||item.type===null){
          continue
        }
        //瓦片随机图片,只随机i和j都为偶数的瓦片
        //i%2和j%2仅仅是为了让随机的个数少一点，这样就保留更多的纯色砖块，地面看出来不会太突兀
        let number = item.src
        if((number===1 ||number===5 ||number===9) &&i%2===0&&j%2===0 ){
          number+=randomByRange(0,4)
        } else if (number === 5 && i % 2 === 0 && j % 2 === 1) {
          number += randomByRange(0, 4)
        } else if (number === 9 && i % 2 === 0 && j % 2 === 1) {
          number += randomByRange(0, 4)
        }

        //通过瓦片的src拼接一个瓦片的图片名称
        const imgSrc = `tile (${number})`
         //通过cocos的资源加载获取resources中的瓦片资源,根据imgSrc来找，拿不到就拿第一张图片
        const spriteFrame = spriteFrames.find(v=>v.name===imgSrc) ||spriteFrames[0]
        //创建瓦片节点
        const tile = createUINode()
        //给节点加上TileManager方法
        const tileManager=  tile.addComponent(TileManager)
        const type  = item.type
        tileManager.init(type,spriteFrame,i,j)
        //给瓦片设置为该节点的子类
        tile.setParent(this.node)
        //设置角色脚下的地图信息
        DataManager.Instance.tileInfo[i][j]=tileManager
    }

  }
}

}
