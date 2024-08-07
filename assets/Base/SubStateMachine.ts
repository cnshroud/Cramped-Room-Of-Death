//子状态机基类
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enum';
import State from './State';
import { StateMachine } from './StateMachine';

const { ccclass, property } = _decorator;
/***
 * 子有限状态机基类
 * 用处：例如有个idle的state，但是有多个方向，为了让主状态机更整洁，可以把同类型的但具体不同的state都封装在子状态机中
 */

// @ccclass('SubStateMachine') 不是自定义组件所以可以把这个和继承去掉
export abstract class SubStateMachine {
  //当前状态
  private _currentState:State = null
  //子状态机参数列表使用fsm状态机的状态，一个状态机列表
  stateMachines:Map<string,State > = new Map()

  constructor(public fsm :StateMachine){

  }

  //子状态机参数列表
  //getset方法
  get currentState(){
    return this._currentState
  }
  set currentState(newState){
    if(!newState){
      return
    }
    this._currentState = newState
    //修改状态时会调用run方法
    this._currentState.run()
  }

  //当参数改变时执行run方法--具体实现类
  abstract run():void
}
