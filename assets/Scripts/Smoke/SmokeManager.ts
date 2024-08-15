import { _decorator } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { DataManager } from "../../Runtime/DataManager";
import { enemyManager } from "../../Base/enemyManager";
import { SmokeStateMachine } from "./SmokeStateMachine";
import { EntityManager } from "../../Base/EntityManager";
import { IEntity } from "../../Levels";

const { ccclass, property } = _decorator;

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  async init(params:IEntity){
    this.fsm =this.addComponent(SmokeStateMachine)
    await this.fsm.init()
    super.init(params)
  };

}
