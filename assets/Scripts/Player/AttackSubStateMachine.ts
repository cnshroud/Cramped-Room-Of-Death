import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine";
import State, { ANIMATION_SPEED } from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM, SHAKE_TYPE_ENUM } from "../../Enum";

const BASE_URL="texture/player/attack"

export default class AttackSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
      super(fsm);
      this.stateMachines.set(DIRECTION_ENUM.TOP,new State(fsm,`${BASE_URL}/top`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED,[
        {
          //官方文档帧事件实例
          frame: ANIMATION_SPEED*4,   // 第 四帧时触发事件
          func: 'onAttackShake',  //会去找这个组件中的每一个方法
          params: [ SHAKE_TYPE_ENUM.TOP ],    //参数
        },
      ]))
      this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(fsm,`${BASE_URL}/left`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED,[
        {
          frame: ANIMATION_SPEED*4,
          func: 'onAttackShake',
          params: [ SHAKE_TYPE_ENUM.LEFT ],
        },
      ]))
      this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(fsm,`${BASE_URL}/bottom`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED,[
        {
          frame: ANIMATION_SPEED*4,
          func: 'onAttackShake',
          params: [ SHAKE_TYPE_ENUM.BOTTOM ],
        },
      ]))
      this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(fsm,`${BASE_URL}/right`,AnimationClip.WrapMode.Normal,ANIMATION_SPEED,[
        {
          frame: ANIMATION_SPEED*4,
          func: 'onAttackShake',
          params: [ SHAKE_TYPE_ENUM.RIGHT ],
        },
      ]))
    }

}
