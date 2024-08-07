//方向状态机，因为idleSubStateMachine和TurnLeftSubStateMachine两个子状态机都有公用的方向，所以给他抽象出来

import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../Enum"
import { SubStateMachine } from "./SubStateMachine"

export default class DirectionSubStateMachine extends SubStateMachine {
    run() {
        //根据方向参数决定子状态机用那个状态
        //拿到方向参数的value
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
        //通过DIRECTION_ORDER_ENUM把参数的value转换成对应的枚举值
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }
}
