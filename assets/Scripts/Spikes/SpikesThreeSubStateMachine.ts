
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, SPIKE_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";
import { SubStateMachine } from "../../Base/SubStateMachine";
import SpikesSubStateMachine from "./SpikesSubStateMachine";

//路径是一样的，所以写成公共url
const BASE_URL="texture/spikes/spikesthree"

export default class SpikesThreeSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);
    this.stateMachines.set(SPIKE_COUNT_ENUM.ZERO,new State(fsm,`${BASE_URL}/zero`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.ONE,new State(fsm,`${BASE_URL}/one`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.TWO,new State(fsm,`${BASE_URL}/two`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.THREE,new State(fsm,`${BASE_URL}/three`))
    this.stateMachines.set(SPIKE_COUNT_ENUM.THREE,new State(fsm,`${BASE_URL}/four`))

  }

}
