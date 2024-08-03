
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { CONTORLLER_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enum';
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
        await this.fsm.init()
        //退出init方法后才进行状态变换
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)

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
            this.fsm.setParams(PARAMS_NAME_ENUM.TURNLEFT,true)
        }
    }


}
