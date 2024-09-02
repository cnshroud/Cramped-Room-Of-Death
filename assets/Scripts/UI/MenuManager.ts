
import { _decorator, Component, Node } from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;
/**
 *
 */

@ccclass('MenuManager')
export class MenuManager extends Component {
    //执行事件中心的方法
    handleUndo(){
      //撤回按钮
        EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
    }
    handleRestart(){
      //撤回按钮
        EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
    }
    handleQuit(){
      //撤回按钮
        EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE)
    }
}
