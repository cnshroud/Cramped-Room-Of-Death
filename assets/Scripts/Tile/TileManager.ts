
import { _decorator, assert, Component, error, Layers, Node, resources, Sprite, spriteAssembler, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../Levels';


//图片宽高
export const TILE_WIDTH=55
export const TILE_HEIGHT=55


@ccclass('TileManager')
export class TileManager extends Component {
    //瓦片地图动态生成
  init(spriteFrame:SpriteFrame,i:number ,j:number){
        //渲染瓦片
        const sprite= this.addComponent(Sprite)
         //通过cocos的资源加载获取resources中的瓦片资源,拿不到就拿第一张图片
        sprite.spriteFrame = spriteFrame

        const transform= this.getComponent(UITransform)
        //设置图片宽高
        transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)

        this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)
    }
  }

