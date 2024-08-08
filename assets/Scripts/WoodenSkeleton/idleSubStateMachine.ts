import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enum";

//路径是一样的，所以写成公共url
const BASE_URL="texture/woodenskeleton/idle"

//idel子状态机,不同方向上的idle
export default class idleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      //需要循环播放当前方向上的动画
      this.stateMachines.set(DIRECTION_ENUM.TOP,new State(fsm,`${BASE_URL}/top`,AnimationClip.WrapMode.Loop))
      this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(fsm,`${BASE_URL}/left`,AnimationClip.WrapMode.Loop))
      this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(fsm,`${BASE_URL}/bottom`,AnimationClip.WrapMode.Loop))
      this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(fsm,`${BASE_URL}/right`,AnimationClip.WrapMode.Loop))
    }

}
