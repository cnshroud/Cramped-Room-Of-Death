
import { SubStateMachine } from "../../Base/SubStateMachine";
import { PARAMS_NAME_ENUM, SPIKE_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enum";

export default class SpikesSubStateMachine extends SubStateMachine {

  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState=this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
    console.log(this.currentState);

  }

}
