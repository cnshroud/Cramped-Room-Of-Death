import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKE_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";
import { SubStateMachine } from "../../Base/SubStateMachine";
import SpikesSubStateMachine from "./SpikesSubStateMachine";

//路径是一样的，所以写成公共url
const BASE_URL="texture/spikes/spikesone"
//一刺的状态动画
export default class SpikesOneSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);
    this.stateMachines.set(SPIKE_COUNT_ENUM.ZERO,new State(fsm,`${BASE_URL}/zero`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.ONE,new State(fsm,`${BASE_URL}/one`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.TWO,new State(fsm,`${BASE_URL}/two`))

  }
}
