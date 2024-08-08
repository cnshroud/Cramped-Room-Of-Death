import { _decorator ,Animation} from "cc";
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from "../../Base/StateMachine";
import { PARAMS_NAME_ENUM } from "../../Enum";
import idleSubStateMachine from "./idleSubStateMachine";

const { ccclass, property } = _decorator;

//现在增加状态机的方法就很简单了，
//状态机直接复制TurnLeftSubStateMachine改个名字和资源位置
//在状态机参数枚举PARAMS_NAME_ENUM和实体枚举ENTITY_STATE_ENUM中增加枚举
// 在初始化参数和初始化状态机添加set方法即可，run方法中增加该状态机的case和if判断即可


@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {

  //初始化方法
  async init(){
    //加载Animation动画
    this.animationComponent=  this.addComponent(Animation)
    this.initParams()
    this.initstateMachine()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
    //这样会让所有的异步都加载完成才退出init方法
  }
  //初始化参数
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION ,getInitParamsNumber())
  }
  //初始化状态机
  initstateMachine(){
    //状态机需要根据状态修改参数，
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new idleSubStateMachine(this))
  }

  //在执行过左转动画之后再把动画变为idle状态
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      // //拿到动画的名字
      // const name = this.animationComponent.defaultClip.name
      // const whiteList=['block','turn']
      // if(whiteList.some(v=>name.includes(v))){
      //   this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE
      // }
    })
  }

  //当参数改变时执行run方法
  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
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

