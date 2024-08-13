//有限状态机
import { _decorator,Animation, } from 'cc';
import {ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import idleSubStateMachine from './idleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import BlockFrontStateMachine from './BlockFrontStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import BlockTurnLeftStateMachine from './BlockTurnLeftStateMachine';
import BlockBackStateMachine from './BlockBackStateMachine';
import BlockLeftStateMachine from './BlockLeftStateMachine';
import BlockRightStateMachine from './BlockRightStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import AirDeathSubStateMachine from './AirDeathSubStateMachine';
const { ccclass, property } = _decorator;

//现在增加状态机的方法就很简单了，
//状态机直接复制TurnLeftSubStateMachine改个名字和资源位置
//在状态机参数枚举PARAMS_NAME_ENUM和实体枚举ENTITY_STATE_ENUM中增加枚举
// 在初始化参数和初始化状态机添加set方法即可，run方法中增加该状态机的case和if判断即可


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
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT ,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION ,getInitParamsNumber())
    //向前撞
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger())


    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsTrigger())
  }
  //初始化状态机
  initstateMachines(){
    //状态机需要根据状态修改参数，
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new idleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT,new TurnRightSubStateMachine(this))

    //向前撞
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT,new BlockFrontStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK,new BlockBackStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT,new BlockLeftStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT,new BlockRightStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,new BlockTurnLeftStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,new BlockTurnRightSubStateMachine(this))


    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new DeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH,new AirDeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,new AttackSubStateMachine(this))
  }

  //在执行过左转动画之后再把动画变为idle状态
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED,()=>{
      //拿到动画的名字
      const name = this.animationComponent.defaultClip.name
      //这是一个白名单，增加一个block
      const whiteList=['block','turn','attack']
      //如果动画的名字在白名单里面，则把Params状态设置为IDLE
      if(whiteList.some(v=>name.includes(v))){
        // this.setParams(PARAMS_NAME_ENUM.IDLE,true)
        //playerManager已经拿state来作为动画的驱动入口，所以不需要修改this.setParams，直接设置state即可
        this.node.getComponent(EntityManager).state=ENTITY_STATE_ENUM.IDLE
      }
    })
  }


  //当参数改变时执行run方法
  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):

      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):

      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          //如果是idle状态为true,则切换到idle状态
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        //方向
        else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          //改变状态,如果状态机的TURNLEFT状态为true,则切换到TURNLEFT状态,根据方向来决定idle的动画上下左右
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        }
        //死亡
        else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
        }
        else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState=this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }

        else {
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
