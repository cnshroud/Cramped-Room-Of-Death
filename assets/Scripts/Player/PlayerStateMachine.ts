//有限状态机
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import {FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import idleSubStateMachine from './idleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {

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
    this.params.set(PARAMS_NAME_ENUM.DIRECTION ,getInitParamsNumber())
  }
  //初始化状态机
  initstateMachines(){
    //状态机需要根据状态修改参数，
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new idleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this))

  }

  //在执行过左转动画之后再把动画变为idle状态
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
        //改变状态,如果状态机的TURNLEFT状态为true,则切换到TURNLEFT状态,根据方向来决定idle的动画上下左右
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            //如果是idle状态为true,则切换到idle状态
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else{
          //如果都不是,则保持当前状态，这样才能触发setcurrentState方法中的run方法
          this.currentState=this.currentState
        }
        break;
      default:
        //默认状态
        this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
