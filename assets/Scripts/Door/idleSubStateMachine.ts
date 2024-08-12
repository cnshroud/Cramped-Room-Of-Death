import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enum";

const BASE_URL="texture/door/idle"

//idel子状态机,不同方向上的idle
export default class idleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      this.stateMachines.set(DIRECTION_ENUM.TOP,new State(fsm,`${BASE_URL}/top`))
      this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(fsm,`${BASE_URL}/left`))
      this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(fsm,`${BASE_URL}/top`))
      this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(fsm,`${BASE_URL}/left`))
    }

}
