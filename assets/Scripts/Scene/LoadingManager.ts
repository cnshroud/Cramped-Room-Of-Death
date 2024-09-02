
import { _decorator, Component, director, Node, ProgressBar, resources } from 'cc';
import { SCENE_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    //预加载资源,preloadDir(加载文件，加载中事件，回调事件)
    //通过已加载文件和总文件来算一个加载进度条的百分比

    @property(ProgressBar)
    bar:ProgressBar=null
    onLoad() {
        resources.preloadDir("texture",(cur,total)=>{
            this.bar.progress=cur/total
        },()=>{
            director.loadScene(SCENE_ENUM.START)
        })
    }
}
