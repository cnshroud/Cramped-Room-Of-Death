
import { _decorator,} from 'cc';
import { CONTORLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import { DataManager } from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;

//玩家管理器，管理玩家动画
@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    targetX:number=0
    targetY:number=0
    private readonly speed:number=1/10

    async init(){

        //加入状态机脚本
        this.fsm =this.addComponent(PlayerStateMachine)
        //init方法中有state加载的异步逻辑，无法保障setParams之前把state加载完，
        //所以要用waitingList:Array<Promise<SpriteFrame[]>>=[]
        await this.fsm.init()
        //退出init方法后才进行状态变换
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)
        // console.log("修改后的状态机",this.fsm.getParams(PARAMS_NAME_ENUM.IDLE))

        //父类初始化
        super.init({
            x:0,
            y:0,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
        })

        //设置初始方向
        this.direction=DIRECTION_ENUM.TOP
        //数据ui分离后只需要修改状态即可setParams
        this.state=ENTITY_STATE_ENUM.IDLE

        //使用状态机就不需要渲染了
        // await this.render()
        //把move方法绑定到evenetmanegr
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this)
    };

    update(){
        this.updateXY()
        //设置角色位置，因为y是相反的所以要给-，人物宽度是四个瓦片的宽度，所以要把人物的坐标移动固定位置
        super.update()
    }

    updateXY(){
        if(this.targetX<this.x){
            this.x-=this.speed
        }else if(this.targetX>this.x){
            this.x+=this.speed
        }
        if(this.targetY<this.y){
            this.y-=this.speed
        }else if(this.targetY>this.y){
            this.y+=this.speed
        }
        //当角色坐标和目标坐标差距小于0.1时，认为角色已经到达目标坐标，此时将角色坐标设置为和目标坐标相同
        if(Math.abs(this.targetX-this.x)<=0.1 &&Math.abs(this.targetY-this.y)<=0.1){
            this.x=this.targetX
            this.y=this.targetY
        }
    }

    //人物移动
    move(inputDirection:CONTORLLER_ENUM){
        console.log("地图信息",DataManager.Instance.tileInfo)
        if(inputDirection==CONTORLLER_ENUM.TOP){
            this.targetY-=1
        }else if(inputDirection==CONTORLLER_ENUM.BOTTOM){
            this.targetY+=1
        }else if(inputDirection==CONTORLLER_ENUM.RIGHT){
            this.targetX+=1
        }else if(inputDirection==CONTORLLER_ENUM.LEFT){
            this.targetX-=1
        }else if(inputDirection==CONTORLLER_ENUM.TURNLEFT){
            //先改变数据在调用渲染方法
            //当点击左转时，如果角色面向上时，会转为面向左边
            if(this.direction===DIRECTION_ENUM.TOP){
                this.direction=DIRECTION_ENUM.LEFT
            }else if(this.direction===DIRECTION_ENUM.LEFT){
                this.direction=DIRECTION_ENUM.BOTTOM
            }else if(this.direction===DIRECTION_ENUM.BOTTOM){
                this.direction=DIRECTION_ENUM.RIGHT
             }else if(this.direction===DIRECTION_ENUM.RIGHT){
                this.direction=DIRECTION_ENUM.TOP
            }
            this.state=ENTITY_STATE_ENUM.TURNLEFT
        }
    }


}
