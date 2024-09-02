
import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc';
import { SCENE_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    //预加载资源,preloadDir(加载文件，加载中事件，回调事件)
    //通过已加载文件cur和总文件total来算一个加载进度条的百分比

    @property(ProgressBar)
    bar:ProgressBar=null
    onLoad() {
        this.preLoad()
      }
      preLoad() {
        director.preloadScene(SCENE_ENUM.START)
        resources.preloadDir(
          'texture',
          (cur, total) => {
            this.bar.progress = cur / total
          },
          async err => {
            if (err) {
              await new Promise(rs => {
                setTimeout(rs, 2000)
              })
              this.preLoad()
              return
            }

            director.loadScene(SCENE_ENUM.START)
          },
        )
    }
}
