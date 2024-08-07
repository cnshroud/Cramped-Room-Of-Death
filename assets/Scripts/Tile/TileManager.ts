
import { _decorator, assert, Component, error, Layers, Node, resources, Sprite, spriteAssembler, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../Levels';
import { TILE_TYPE_ENUM } from '../../Enum';

  /**
   * 十种瓦片
   * 三种类型分为：
   * 可走可转：地板
   * 不可走可转：悬崖
   * 不可走不可转;墙壁
   * 成员字段有两种：移动和转向
   * moveable
   * turnable
   */


//图片宽高
export const TILE_WIDTH=55
export const TILE_HEIGHT=55


@ccclass('TileManager')
export class TileManager extends Component {
  //墙壁类型
  type:TILE_TYPE_ENUM
  moveable:boolean
  turnable:boolean
    //瓦片地图动态生成
  init(type:TILE_TYPE_ENUM,spriteFrame:SpriteFrame,i:number ,j:number){
    this.type=type
    //判断墙壁类型，不可走不可转
    if(
      this.type===TILE_TYPE_ENUM.WALL_ROW ||
      this.type===TILE_TYPE_ENUM.WALL_COLUMN  ||
      this.type===TILE_TYPE_ENUM.WALL_LEFT_BOTTOM  ||
      this.type===TILE_TYPE_ENUM.WALL_LEFT_TOP  ||
      this.type===TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM  ||
      this.type===TILE_TYPE_ENUM.WALL_RIGHT_TOP
    ) {
      this.moveable=false
      this.turnable=false
    }else if(
      //不可走可转
      this.type===TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type===TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type===TILE_TYPE_ENUM.CLIFF_RIGHT
    ){
      this.moveable=false
      this.turnable=true
    }else if(this.type===TILE_TYPE_ENUM.FLOOR){
      //可走可转
      this.moveable=true
      this.turnable=true
    }


    const sprite= this.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    const transform= this.getComponent(UITransform)
    //设置图片宽高
    transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)
    //设置位置
    this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)
  }
}

