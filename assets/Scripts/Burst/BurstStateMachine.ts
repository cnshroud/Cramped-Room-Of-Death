import { _decorator ,Animation} from "cc";
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from "../../Base/StateMachine";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../../Enum";
import State from "../../Base/State";
import { EntityManager } from "../../Base/EntityManager";
const { ccclass, property } = _decorator;


const BASE_URL="texture/burst"


@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {

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
    this.params.set(PARAMS_NAME_ENUM.ATTACK ,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH ,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION ,getInitParamsNumber())
  }
  //初始化状态机
  initstateMachine(){
    //不用子状态机
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new State(this,`${BASE_URL}/idle`))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,new State(this,`${BASE_URL}/attack`))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new State(this,`${BASE_URL}/death`))

  }

  //在执行过其他动画之后再把动画变为idle状态
  initAnimationEvent(){

  }

  //当参数改变时执行run方法
  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }
        else{
          this.currentState=this.currentState
        }
        break;
      default:
        this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}

