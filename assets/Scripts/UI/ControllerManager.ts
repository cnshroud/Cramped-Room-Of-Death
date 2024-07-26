
import { _decorator, Component, Node } from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;
/**
 *
 */

@ccclass('ControllerManager')
export class ControllerManager extends Component {
    //执行事件中心的方法
    handleCtrl(){
        EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
}
