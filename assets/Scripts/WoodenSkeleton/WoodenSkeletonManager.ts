import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import { EventManager } from "../../Runtime/EventManager";
import { DataManager } from "../../Runtime/DataManager";

const { ccclass, property } = _decorator;

//木骷髅管理器，管理木骷髅动画
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init(){
    this.fsm =this.addComponent(WoodenSkeletonStateMachine)
      await this.fsm.init()
      super.init({
        x:7,
        y:6,
        type:ENTITY_TYPE_ENUM.PLAYER,
        direction:DIRECTION_ENUM.TOP,
        state:ENTITY_STATE_ENUM.IDLE,
       })

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
    //玩家出生时也调用这个方法
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this)


  };
  //敌人根据角色位置转向方法
  onChangeDirection(isInit=false){
    //判断玩家是否存在
    if(!DataManager.Instance.player){
      return
    }
    const {x:playerX,y:playerY}=DataManager.Instance.player

    //用敌人的坐标减去角色的坐标，得到敌人与角色之间的距离
    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)
    //当玩家与敌人处于对角线，不转向，但是初始时不执行这个判断
    if(disX==disY &&!isInit){
      return
    }
    //判断玩家在敌人的第几象限
    if(playerX=>this.x&&playerY<=this.y){
      //如果y的距离比x的大则敌人向上看，否则向右看
        this.direction=disY>disX?DIRECTION_ENUM.TOP:this.direction=DIRECTION_ENUM.RIGHT
    } else if (playerX<=this.x&&playerY<=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.TOP:this.direction=DIRECTION_ENUM.LEFT
    }else if (playerX<=this.x&&playerY>=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.BOTTOM:this.direction=DIRECTION_ENUM.LEFT
    }else if (playerX>=this.x&&playerY>=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.BOTTOM:this.direction=DIRECTION_ENUM.RIGHT
    }
  }


}
