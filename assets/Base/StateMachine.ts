//状态机基类
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enum';
import State from './State';
import { SubStateMachine } from './SubStateMachine';

const { ccclass, property } = _decorator;
//定义一个trigger和number的联合类型
type ParamsValueType =boolean |number
  //参数类型
export interface IParamsValue{
  type:FSM_PARAMS_TYPE_ENUM,
  value:ParamsValueType
}

//通过这个函数返回这个对象，只是为了避免代码重复
export const  getInitParamsTrigger=()=>{
  return  {
    type:FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value:false
  }
}
//通过这个函数返回这个对象，只是为了避免代码重复,类型是numebr
export const  getInitParamsNumber=()=>{
  return  {
    type:FSM_PARAMS_TYPE_ENUM.NUMBER,
    value:0
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  //状态机需要一个参数列表一个状态机列表
  params:Map<string,IParamsValue> = new Map()
  stateMachines:Map<string,State | SubStateMachine> = new Map()
  //当前状态
  private _currentState:State | SubStateMachine = null
  animationComponent:Animation
  //为了把异步操作都放在list里面
  waitingList:Array<Promise<SpriteFrame[]>>=[]

  //getset方法
  getParams(paramsName:string){
    if(this.params.has(paramsName)){
      return this.params.get(paramsName).value

    }
  }
  setParams(paramsName:string,value:ParamsValueType){
    if(this.params.has(paramsName)){
      this.params.get(paramsName).value=value
      this.run()
      //重置触发器状态
      this.resetTrigger()
    }
  }

  get currentState(){
    return this._currentState
  }
  set currentState(newState){
    this._currentState = newState
    //修改状态时会调用run方法
    this._currentState.run()


  }
  //动画的触发器类型用于一次性条件判断，当满足条件后应该要把他设置为未触发状态
  resetTrigger(){
    //下划线是不关注key的意思
    for(const [_,value] of this.params){
      //判断type的类型是否是trigger，如果是就把他的value   设置为false
      if(value.type===FSM_PARAMS_TYPE_ENUM.TRIGGER){
        value.value=false
      }
    }
  }

  //初始化方法
  abstract init() :void
  //当参数改变时执行run方法
  abstract run():void
}
