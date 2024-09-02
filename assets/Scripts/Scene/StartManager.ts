
import { _decorator, Component, director, Node, Scene } from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enum';
import { FaderManager } from '../../Runtime/FaderManager';
const { ccclass, property } = _decorator;
/**
 *
 */

@ccclass('StartManager')
export class StartManager extends Component {
    onLoad(){
        //渐出
        FaderManager.Instance.fadeOut(1000);
        //监听点击事件
        this.node.once(Node.EventType.TOUCH_END,this.handleStart,this)
    }
    async handleStart(){
        await FaderManager.Instance.fadeIn(300);
        director.loadScene(SCENE_ENUM.BATTLE);
    }


}
