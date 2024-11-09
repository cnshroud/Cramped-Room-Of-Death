
import { _decorator, BlockInputEvents, Color, Component, game, Graphics, Sprite, SpriteFrame, Texture2D, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;
/**
 *切换下一关时的渐入渐出效果
 */
//实在解决不了为什么渲染的时候graphics位置不对，所以直接把屏幕大小设置成4倍，把graphics的位置设置为屏幕大小的一半，让其超过屏幕
const SCREEN_WIDTH = view.getVisibleSize().width * 4
const SCREEN_HEIGHT = view.getVisibleSize().height * 4
export const DEFAULT_FADE_DURATION = 200

enum FadeStatus {
  IDLE,
  FADE_IN,
  FADE_OUT,
}


@ccclass('DrawManager')
export class DrawManager extends Component {
  oldTime: number = 0
  duration: number = DEFAULT_FADE_DURATION              //持续时间
  fadeStatus: FadeStatus = FadeStatus.IDLE
  fadeResolve: (value: PromiseLike<null>) => void     //用于解决渐入渐出完成时的 Promise
  faderNode: Node
  ctx: Graphics                                      //Graphics 组件实例，用于绘制
  block: BlockInputEvents                         //（BlockInputEvents 组件实例，用于在渐入渐出过程中阻止输入）。


  //加载Graphics组件，换切其他写法
  init() {
    this.block = this.addComponent(BlockInputEvents)
    this.ctx = this.addComponent(Graphics)
    //设置节点属性
    const transform = this.getComponent(UITransform)
    transform.setAnchorPoint(0.5, 0.5)
    transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    this.setAlpha(1)
  }
  //设置Graphics的位置大小和颜色
  private setAlpha(percent: number) {
    this.ctx.clear()
    this.ctx.rect(-SCREEN_WIDTH/2, -SCREEN_HEIGHT/2,SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fill()
    //如果percent为1，则启用block组件拦截节点接受输入事件，否则禁用
    this.block.enabled = percent === 1
  }
  //随时间改变透明度
  update() {
    const fadePercent = (game.totalTime - this.oldTime) / this.duration
    switch (this.fadeStatus) {
      case FadeStatus.FADE_IN:
        if (fadePercent < 1) {
          this.setAlpha(fadePercent)
        } else {
          this.fadeStatus = FadeStatus.IDLE
          this.setAlpha(1)
          this.fadeResolve(null)
        }
        break
      case FadeStatus.FADE_OUT:
        if (fadePercent < 1) {
          this.setAlpha(1 - fadePercent)
        } else {
          this.fadeStatus = FadeStatus.IDLE
          this.setAlpha(0)
          this.fadeResolve(null)
        }
        break
      default:
        break
    }
  }
  //渐进渐出
  fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    this.setAlpha(0)
    this.duration = duration
    this.fadeStatus = FadeStatus.FADE_IN
    this.oldTime = game.totalTime
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }

  fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    this.setAlpha(1)
    this.duration = duration
    this.oldTime = game.totalTime
    this.fadeStatus = FadeStatus.FADE_OUT
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }
  mask() {
    this.setAlpha(1)
    return new Promise(resolve => {
      //屏幕在默认时间一直都是黑的
      setTimeout(resolve, DEFAULT_FADE_DURATION)
    })
  }
}
