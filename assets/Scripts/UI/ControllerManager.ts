
import { _decorator, Component, Node } from 'cc';
import { EventManager } from '../../Runtime/EventManager';
import { CONTORLLER_ENUM, EVENT_ENUM } from '../../Enum';
const { ccclass, property } = _decorator;
/**
 *
 */

@ccclass('ControllerManager')
export class ControllerManager extends Component {
    //执行事件中心的方法
    handleCtrl(evt:Event,type:string){
        // EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        //将button事件的返回字符拿到，强转为CONTORLLER_ENUM
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL,type as CONTORLLER_ENUM)

    }
}
