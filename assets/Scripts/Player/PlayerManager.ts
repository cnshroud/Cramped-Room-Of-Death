
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { CONTORLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass, property } = _decorator;

//玩家管理器，管理玩家动画
@ccclass('PlayerManager')
export class PlayerManager extends Component {
    //角色移动思路，一共两个坐标，角色的坐标x,y,和角色的目标坐标targetX,targetY
    //监听键盘事件修改目的坐标，在update中不断让角色坐标靠近目的坐标
    x:number=0
    y:number=0
    targetX:number=0
    targetY:number=0
    private readonly speed:number=1/10
    //状态机变量
    fsm:PlayerStateMachine
    //方位变量
    private _dirtection:DIRECTION_ENUM
    //实体状态
    private _state:ENTITY_STATE_ENUM
    //给私有属性设置getset方法
    get dirtection(){
        return this._dirtection
    }
    set dirtection(newState:DIRECTION_ENUM){
        this._dirtection=newState
        this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT,DIRECTION_ORDER_ENUM[this.dirtection])
    }
    get state(){
        return this._state
    }
    set state(newState:ENTITY_STATE_ENUM){
        this._state=newState
        //数据ui分离思想，要先改变状态再渲染改变ui
        this.fsm.setParams(this._state,true)
    }



    update(){
        this.updateXY()
        //设置角色位置，因为y是相反的所以要给-，人物宽度是四个瓦片的宽度，所以要把人物的坐标移动固定位置
        this.node.setPosition(this.x*TILE_WIDTH-TILE_WIDTH*1.5,-this.y*TILE_HEIGHT+TILE_HEIGHT*1.5)
    }


    async init(){
         //渲染玩家

        //角色sprite
        const sprite = this.addComponent(Sprite)
        //自定义宽高
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform= this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)


        //加入状态机
        this.fsm =this.addComponent(PlayerStateMachine)
        //init方法中有state加载的异步逻辑，无法保障setParams之前把state加载完，
        //所以要用waitingList:Array<Promise<SpriteFrame[]>>=[]
        await this.fsm.init()
        //退出init方法后才进行状态变换
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)
        // console.log("修改后的状态机",this.fsm.getParams(PARAMS_NAME_ENUM.IDLE))
        //数据ui分离后只需要修改状态即可setParams
        this.state=ENTITY_STATE_ENUM.IDLE

        //使用状态机就不需要渲染了
        // await this.render()
        //把move方法绑定到evenetmanegr
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this)
    };

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
    move(inputDirction:CONTORLLER_ENUM){
        if(inputDirction==CONTORLLER_ENUM.TOP){
            this.targetY-=1
        }else if(inputDirction==CONTORLLER_ENUM.BOTTOM){
            this.targetY+=1
        }else if(inputDirction==CONTORLLER_ENUM.RIGHT){
            this.targetX+=1
        }else if(inputDirction==CONTORLLER_ENUM.LEFT){
            this.targetX-=1
        }else if(inputDirction==CONTORLLER_ENUM.TURNLEFT){
                        //当角色面向上时，点击左转，要面向左边
                        if(this.dirtection===DIRECTION_ENUM.TOP){
                            this.dirtection=DIRECTION_ENUM.LEFT
                        }else if(this.dirtection===DIRECTION_ENUM.LEFT){
                            this.dirtection=DIRECTION_ENUM.BOTTOM
                        }else if(this.dirtection===DIRECTION_ENUM.BOTTOM){
                            this.dirtection=DIRECTION_ENUM.RIGHT
                        }else if(this.dirtection===DIRECTION_ENUM.RIGHT){
                            this.dirtection=DIRECTION_ENUM.TOP
                        }
                       this.state=ENTITY_STATE_ENUM.TURNLEFT
        }
    }


}
