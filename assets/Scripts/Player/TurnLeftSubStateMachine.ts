import { AnimationClip } from "cc";
import { StateMachine } from "../../Base/StateMachine";

import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../Enum";
import State from "../../Base/State";
import { SubStateMachine } from "../../Base/SubStateMachine";

//路径是一样的，所以写成公共url
const BASE_URL="texture/player/turnleft"

//turnleft子状态机，左转时上下左右的动画
export default class TurnLeftSubStateMachine extends SubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      //已经处于turnleft状态了所以直接用方位，调用run的时候会根据方向参数决定用哪个状态
      //并且turnleft动画只需要执行一次，所以不需要设为循环
      this.stateMachines.set(
        DIRECTION_ENUM.TOP,
        new State(fsm,`${BASE_URL}/top`)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.LEFT,
        new State(fsm,`${BASE_URL}/left`)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.BOTTOM,
        new State(fsm,`${BASE_URL}/bottom`)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.RIGHT,
        new State(fsm,`${BASE_URL}/right`)
      )
    }

    run() {
      //根据方向参数决定子状态机用那个状态
      //拿到方向参数的value
      const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
      //通过DIRECTION_ORDER_ENUM把参数的value转换成对应的枚举值
      this.currentState=this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }
}
