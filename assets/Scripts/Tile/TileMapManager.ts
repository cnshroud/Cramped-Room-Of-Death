
import { _decorator, assert, Component, error, Layers, Node, resources, Sprite, spriteAssembler, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../Levels';


//图片宽高
export const TILE_WIDTH=55
export const TILE_HEIGHT=55


@ccclass('TileMapManager')
export class TileMapManager extends Component {


    //瓦片地图动态生成
  async init(){
    //
    const {mapInfo} = levels[`Level${1}`]
     const spriteFrames = await this.loadRes()
    console.log(spriteFrames)
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


        //创建瓦片节点
        const node = new Node()
        //渲染瓦片
        const sprite= node.addComponent(Sprite)
        //
        const imgSrc = `tile (${item.src})`
         //通过cocos的资源加载获取resources中的瓦片资源,拿不到就拿第一张图片
        sprite.spriteFrame = spriteFrames.find(v=>v.name===imgSrc) ||spriteFrames[5]
        const transform= node.addComponent(UITransform)
        //设置图片宽高
        transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)

        //要渲染节点需要设置layer，空节点没有layer所以要自己设置
        node.layer = 1 << Layers.nameToLayer("UI_2D")
        node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)
        node.setParent(this.node)
    }
  }
}
    //resources的资源加载函数是回调函数，不太好写所以封装成promise
    loadRes(){
      return new Promise<SpriteFrame[]>((resolve,reject)=>{
          resources.loadDir("texture/tile/tile",SpriteFrame,function(err,assets){
            if(err){
              //有报错就reject掉
              reject(err)
              return
            }
            //没有报错就resolve
            resolve(assets)
          })
      })
    }
}
