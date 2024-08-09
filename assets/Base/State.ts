import { animation, AnimationClip, Sprite, SpriteFrame,} from "cc";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";
import { ResourceManager } from "../Runtime/ResourceManager";
import { StateMachine } from "./StateMachine";
import { sortSpriteFrame } from "../Utils";

//帧数常量 1秒8帧
const ANIMATION_SPEED=1/8

/**
 * 每个状态都要有播放动画的能力，
 * 所以需要知道自己的animationClip
 * 和animationComponent.play()方法
 * 把PlayerManager的render方法拆分了
 */
export default class State {
  private animationClip:AnimationClip
  //构造函数需要三个参数
   constructor(
    private fsm:StateMachine,
    //动画播放路径
    private path:string,
    //不传参数就默认播放一次
    private wrapMode:AnimationClip.WrapMode=AnimationClip.WrapMode.Normal
  ){
    this.init()
  }
  //资源初始化方法
  async init(){

        //加载图片资源,因为spriteFrames是个promise,所以需要await,init方法也需要async
        const promise=ResourceManager.Instance.loadDir(this.path)
        //将promise加入等待队列
        this.fsm.waitingList.push(promise)
        const spriteFrames=await promise
        //coocs官网的程序化编辑动画剪辑的例子
        this.animationClip = new AnimationClip();

        const track  = new animation.ObjectTrack(); // 创建一个对象轨道
         // 指定轨道路径，即指定目标对象为 "Sprite" 子节点的 "spriteFrame" 属性
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        //关键帧列表,需要给个类型，数字是帧，类型是SpriteFrame,
        //map方法会遍历数组中的每个元素，并对每个元素执行提供的函数。
        //回调函数中的参数顺序是固定的：第一个参数是当前元素，第二个参数是当前元素的索引（如果提供了第二个参数的话）

        const frames:Array<[number,SpriteFrame]> =sortSpriteFrame(spriteFrames).map((item,index)=>[ANIMATION_SPEED*index,item])

        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track);
        //设置动画剪辑的名称，this.path肯定是不同的，所以可以用this.path来命名，在
        this.animationClip.name = this.path;
        // 整个动画剪辑的周期
        this.animationClip.duration =frames.length*ANIMATION_SPEED;
        //循环播放,改成自定义的wrapMode
        this.animationClip.wrapMode=this.wrapMode
  }
  run(){
    //如果当前动画跟将要播放的动画是一致的就不播放了，不然角色每走一步，敌人就要重新触发idle动画
    if(this.fsm.animationComponent?.defaultClip?.name===this.animationClip.name){//可链式操作没有就返回undefalut
      return
    }
        //设置defalutClip
        this.fsm.animationComponent.defaultClip = this.animationClip;
        //播放组件
        this.fsm.animationComponent.play()

  }
}
