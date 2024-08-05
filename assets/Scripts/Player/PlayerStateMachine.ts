//有限状态机
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import {FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import State from '../../Base/State';
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

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {
  //状态机需要一个参数列表一个状态机列表
  params:Map<string,IParamsValue> = new Map()
  stateMachines:Map<string,State> = new Map()
  //当前状态
  private _currentState:State = null
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
  async init(){

    //加载Animation动画
    this.animationComponent=  this.addComponent(Animation)
    this.initParams()
    this.initstateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
    //这样会让所有的异步都加载完成才退出init方法
  }
  //初始化参数
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT ,getInitParamsTrigger())
  }
  //初始化状态机
  initstateMachines(){
    //状态机需要根据状态修改参数
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new State(this,"texture/player/idle/top",AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new State(this,"texture/player/turnleft/top"))

  }

  //在执行过动画之后再把动画变为idle状态
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      //拿到动画的名字
      const name = this.animationComponent.defaultClip.name
      //这是一个白名单
      const whiteList=['turn']
      //如果动画的名字在白名单里面，则把Params状态设置为IDLE
      if(whiteList.some(v=>name.includes(v))){
        this.setParams(PARAMS_NAME_ENUM.IDLE,true)
      }
    })
  }


  //当参数改变时执行run方法
  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        //改变状态,如果状态机的TURNLEFT状态为true,则切换到TURNLEFT状态
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            //如果是idle状态为true,则切换到idle状态
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        break;
      default:
        //默认状态
        this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
