
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';

import { IEntity } from '../Levels';
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager';
const { ccclass, property } = _decorator;
//实体管理器基类
@ccclass('EntityManager')
export class EntityManager extends Component {
    //角色移动思路，一共两个坐标，角色的坐标x,y,和角色的目标坐标targetX,targetY
    //监听键盘事件修改目的坐标，在update中不断让角色坐标靠近目的坐标
    x:number=0
    y:number=0
    //状态机变量
    fsm:PlayerStateMachine
    //方位变量
    private _direction:DIRECTION_ENUM
    //实体状态
    private _state:ENTITY_STATE_ENUM
    //实体类型
    private type:ENTITY_TYPE_ENUM


    //给私有属性设置getset方法
    get direction(){
        return this._direction
    }
    set direction(newDirection:DIRECTION_ENUM){
        this._direction=newDirection
        //方向改变时渲染方法
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction])
    }
    get state(){
        return this._state
    }
    set state(newState:ENTITY_STATE_ENUM){
        this._state=newState
        //数据ui分离思想，要先改变状态再渲染改变ui
        this.fsm.setParams(this._state,true)
    }

    async init(params:IEntity){
         //渲染玩家

        //角色sprite
        const sprite = this.addComponent(Sprite)
        //自定义宽高
        sprite.sizeMode = Sprite.SizeMode.CUSTOM

        const transform= this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)
        //参数直接拿IEntity的参数
        this.x=params.x
        this.y=params.y
        this.type=params.type
        this.direction=params.direction
        this.state=params.state


        //加入状态机
        // this.fsm =this.addComponent(PlayerStateMachine)
        // //init方法中有state加载的异步逻辑，无法保障setParams之前把state加载完，
        // //所以要用waitingList:Array<Promise<SpriteFrame[]>>=[]
        // await this.fsm.init()
        //退出init方法后才进行状态变换
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)
        // console.log("修改后的状态机",this.fsm.getParams(PARAMS_NAME_ENUM.IDLE))

        //设置初始方向
        // this.dirtection=DIRECTION_ENUM.TOP
        // //数据ui分离后只需要修改状态即可setParams
        // this.state=ENTITY_STATE_ENUM.IDLE

        //使用状态机就不需要渲染了
        // await this.render()
        //把move方法绑定到evenetmanegr
        // EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this)
    };

    update(){
      //设置角色位置，因为y是相反的所以要给-，人物宽度是四个瓦片的宽度，所以要把人物的坐标移动固定位置
      this.node.setPosition(this.x*TILE_WIDTH-TILE_WIDTH*1.5,-this.y*TILE_HEIGHT+TILE_HEIGHT*1.5)
  }

}
