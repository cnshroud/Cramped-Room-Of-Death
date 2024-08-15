import { _decorator ,Animation} from "cc";
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from "../../Base/StateMachine";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../../Enum";
import idleSubStateMachine from "./idleSubStateMachine";
import DeathSubStateMachine from "./DeathSubStateMachine";
import { EntityManager } from "../../Base/EntityManager";

const { ccclass, property } = _decorator;



@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {

  //初始化方法
  async init(){
    //加载Animation动画
    this.animationComponent=  this.node.addComponent(Animation)
    this.initParams()
    this.initstateMachine()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
    //这样会让所有的异步都加载完成才退出init方法
  }
  //初始化参数
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH ,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION ,getInitParamsNumber())

  }
  //初始化状态机
  initstateMachine(){
    //状态机需要根据状态修改参数，
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new idleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new DeathSubStateMachine(this))

  }
  //初始化动画事件
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      //拿到动画的名字
      const name = this.animationComponent.defaultClip.name
      const whiteList=['idle']
      if(whiteList.some(v=>name.includes(v))){
        //烟雾在idle状态后变为death状态
        this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.DEATH
      }
    })
  }

  //当参数改变时执行run方法
  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
            //如果是idle状态为true,则切换到idle状态
            this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }
        else{
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

