
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enum';
import { StateMachine } from '../../Base/StateMachine';
import { randomByLen } from '../../Utils';
import { IEntity, ISpikes } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { SpikeStateMachine } from './SpikeStateMachine';
import { EventManager } from '../../Runtime/EventManager';
import { DataManager } from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;
//地刺管理器类
@ccclass('SpikesManager')
export class SpikesManager extends Component {
    x:number=0
    y:number=0
    fsm:StateMachine
    //当前点数
    private _count:number
    //总点数
    private _totalCount:number
    type:ENTITY_TYPE_ENUM

    id: string=randomByLen(12);

    get count(){
        return this._count
    }
    set count(newCount:number){
        this._count=newCount
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,newCount)
    }
    get totalCount(){
        return this._totalCount
    }
    set totalCount(newCount:number){
        this._totalCount=newCount
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,newCount)
    }

    async init(params:ISpikes){
        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        //注册状态机

        this.fsm =this.addComponent(SpikeStateMachine)
        await this.fsm.init()
        const transform= this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)
        this.x=params.x
        this.y=params.y
        this.type=params.type
        this.totalCount=SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
        this.count=params.count

        //监听玩家移动
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop,this)
    };
    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop)
    }
    update(){
      //设置角色位置，因为y是相反的所以要给-，人物宽度是四个瓦片的宽度，所以要把人物的坐标移动固定位置
      this.node.setPosition(this.x*TILE_WIDTH-TILE_WIDTH*1.5,-this.y*TILE_HEIGHT+TILE_HEIGHT*1.5)
    }
    //然后当前点数不断++
    onLoop(){

        if(this.count===this.totalCount){
            this.count=1
        }else{
            this.count++
        }
        this.onAttack()
    }
    //点数返回为0
    backZero(){
        this.count=0
    }
    onAttack(){
        //人物不存在就return
        if( !DataManager.Instance.player){
            return
        }
        const {x:playerX,y:playerY}= DataManager.Instance.player
        //当位置相同并且当前点数等于总点数
        if(playerX===this.x&&playerY===this.y && this.count===this.totalCount){
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
        }
    }
}
