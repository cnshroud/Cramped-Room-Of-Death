import { _decorator } from "cc";
import { EntityManager } from "../../Base/EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from "../../Enum";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";

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
    };



}
