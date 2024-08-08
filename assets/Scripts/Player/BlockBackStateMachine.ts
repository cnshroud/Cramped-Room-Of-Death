import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enum";

//路径是一样的，所以写成公共url
const BASE_URL="texture/player/blockback"

//向前撞状态机
export default class BlockBackStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      //已经处于turnleft状态了所以直接用方位，调用run的时候会根据方向参数决定用哪个状态
      //并且turnleft动画只需要执行一次，所以不需要设为循环
      this.stateMachines.set(DIRECTION_ENUM.TOP,new State(fsm,`${BASE_URL}/top`))
      this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(fsm,`${BASE_URL}/left`))
      this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(fsm,`${BASE_URL}/bottom`))
      this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(fsm,`${BASE_URL}/right`))
    }

}
