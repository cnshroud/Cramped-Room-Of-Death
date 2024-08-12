import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import { EventManager } from "../../Runtime/EventManager";
import { DataManager } from "../../Runtime/DataManager";
import { enemyManager } from "../../Base/enemyManager";

const { ccclass, property } = _decorator;

//木骷髅管理器，管理木骷髅动画
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends enemyManager {
  async init(params){
    this.fsm =this.addComponent(WoodenSkeletonStateMachine)
      await this.fsm.init()
      super.init(params)
    //玩家出生时也调用这个方法
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack,this)


  };
  onDestroy(){
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onAttack)
  }



  onAttack(){
    //如果玩家死亡就不执行这个方法
    if(this.state===ENTITY_STATE_ENUM.DEATH||!DataManager.Instance.player){
      return
    }
    //当玩家在敌人上下左右时，敌人攻击
    const {x:playerX,y:playerY,state:playerstate}=DataManager.Instance.player

    if((this.x===playerX&&Math.abs(this.y-playerY)<=1)
      ||(this.y===playerY&&Math.abs(this.x-playerX)<=1)
      && playerstate!==ENTITY_STATE_ENUM.DEATH        //玩家死亡时，敌人不攻击
      && playerstate!==ENTITY_STATE_ENUM.AIRDEATH
    ){
      this.state=ENTITY_STATE_ENUM.ATTACK
      //玩家死亡
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
    }else{
      this.state=ENTITY_STATE_ENUM.IDLE
    }
  }

}
