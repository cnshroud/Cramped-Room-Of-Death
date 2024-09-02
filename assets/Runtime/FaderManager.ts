import { find, game, RenderRoot2D } from "cc";
import Singleton from "../Base/Singleton";
import { DEFAULT_FADE_DURATION, DrawManager } from "../Scripts/UI/DrawManager";
import { createUINode } from "../Utils";
//要调用drawManager就直接调用这个FaderManager就好了
export class FaderManager extends Singleton{
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }

  private _fader: DrawManager = null

  get fader():DrawManager{
    if (this._fader !== null) {
      return this._fader
    }

    const root = createUINode()
    //让ui元素渲染到屏幕上
    root.addComponent(RenderRoot2D)

    const node = createUINode()
    node.setParent(root)
    this._fader = node.addComponent(DrawManager)
    this._fader.init()
    //设置常驻节点
    game.addPersistRootNode(root)
    return this._fader
  }

  async fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeIn(duration)
  }
  async fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    await this.fader.fadeOut(duration)
  }
  async mask() {
    await this.fader.mask()
  }

}
