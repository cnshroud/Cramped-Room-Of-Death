import { _decorator } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { enemyManager } from "../../Base/enemyManager";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";

const { ccclass, property } = _decorator;

//铁骷髅管理器，管理铁骷髅动画
@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends enemyManager {
  async init(params){
    this.fsm =this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
  };
  onDestroy(){
    super.onDestroy()
  }

}
