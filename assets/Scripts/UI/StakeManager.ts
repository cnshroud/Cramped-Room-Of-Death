
import { _decorator, Component, game, Node } from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

//撞墙的震动效果
@ccclass('StakeManager')
export class StakeManager extends Component {

  private isShaking = false
  oldTime: number = 0
  oldPos:{x:number,y:number} = {x:0,y:0}
  onLoad(){
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake)

  }
  stop(){
    this.isShaking = false
    // this.node.setPosition(this.oldPos.x,this.oldPos.y)
  }
  onShake(){
    if(this.isShaking){
      return
    }
    this.oldTime=game.totalTime
    this.isShaking = true
    //保存当前节点的xy坐标
    this.oldPos.x=this.node.position.x
    this.oldPos.y=this.node.position.y
  }

  update(){
    //使用sin正弦函数实现震动 Y=A*SIN(W*X+F)  A振幅  W频率  F相位
    if(this.isShaking){
      const duration = 1000   //震动持续时间
      const amount = 1.6
      const frequency=12
      //获取当前时间
      const curSecond = (game.totalTime-this.oldTime)/1000
      const totalSecond = duration/1000
      const offfset = amount *Math.sin(frequency/Math.PI*curSecond)

      //偏移效果
      this.node.setPosition(this.oldPos.x,this.oldPos.y+offfset)

      if(curSecond>totalSecond){
        this.isShaking = false
        this.node.setPosition(this.oldPos.x,this.oldPos.y)
        return
      }
    }
  }
}
