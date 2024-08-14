import { _decorator ,Animation} from "cc";
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from "../../Base/StateMachine";
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from "../../Enum";
import { EntityManager } from "../../Base/EntityManager";
import SpikesOneSubStateMachine from "./SpikesOneSubStateMachine";
import SpikesTwoSubStateMachine from "./SpikesTwoSubStateMachine";
import SpikesThreeSubStateMachine from "./SpikesThreeSubStateMachine";
import SpikesFourSubStateMachine from "./SpikesFourSubStateMachine";

const { ccclass, property } = _decorator;
@ccclass('SpikeStateMachine')
export class SpikeStateMachine extends StateMachine {

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
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT ,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT ,getInitParamsNumber())

  }
  //初始化状态机
  initstateMachine(){
    //状态机需要根据状态修改参数，
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE,new SpikesOneSubStateMachine(this))

    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO,new SpikesTwoSubStateMachine(this))

    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE,new SpikesThreeSubStateMachine(this))

    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR,new SpikesFourSubStateMachine(this))

  }

  //在执行过其他动画之后再把动画变为idle状态
  initAnimationEvent(){
    // this.animationComponent.on(Animation.EventType.FINISHED,()=>{
    //   //拿到动画的名字
    //   const name = this.animationComponent.defaultClip.name
    //   const whiteList=['attack']
    //   if(whiteList.some(v=>name.includes(v))){
    //     this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE
    //   }
    // })
  }

  //当参数改变时执行run方法
  run(){

    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch(this.currentState){

      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
        if(value===SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE){
            this.currentState=this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        }
        else if(value===SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO){
          this.currentState=this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
        }
        else if(value===SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE){
          this.currentState=this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
        }
        else if(value===SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR){
          this.currentState=this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
        }

        else{
          this.currentState=this.currentState
        }
        break;
      default:
        this.currentState=this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }
}

