import { AnimationClip } from "cc";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../Enum";
import State from "../../Base/State";

//路径是一样的，所以写成公共url
const BASE_URL="texture/player/idle"

//idel子状态机,不同方向上的idle
export default class idleSubStateMachine extends SubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      //需要循环播放当前方向上的动画
      this.stateMachines.set(
        DIRECTION_ENUM.TOP,
        new State(fsm,`${BASE_URL}/top`,AnimationClip.WrapMode.Loop)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.LEFT,
        new State(fsm,`${BASE_URL}/left`,AnimationClip.WrapMode.Loop)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.BOTTOM,
        new State(fsm,`${BASE_URL}/bottom`,AnimationClip.WrapMode.Loop)
      )
      this.stateMachines.set(
        DIRECTION_ENUM.RIGHT,
        new State(fsm,`${BASE_URL}/right`,AnimationClip.WrapMode.Loop)
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
