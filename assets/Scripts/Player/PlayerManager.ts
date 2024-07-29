
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
import { CONTORLLER_ENUM, EVENT_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
const { ccclass, property } = _decorator;

//帧数常量 1秒8帧
const ANIMATION_SPEED=1/8

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

    update(){
        this.updateXY()
        //设置角色位置，因为y是相反的所以要给-，人物宽度是四个瓦片的宽度，所以要把人物的坐标移动固定位置
        this.node.setPosition(this.x*TILE_WIDTH-TILE_WIDTH*1.5,-this.y*TILE_HEIGHT+TILE_HEIGHT*1.5)
    }


    async init(){
        await this.render()
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
        }else if(inputDirction==CONTORLLER_ENUM.LEFT){
            this.targetX-=1
        }else if(inputDirction==CONTORLLER_ENUM.RIGHT){
            this.targetX+=1
        }
    }

    //渲染玩家
    async render(){
        //角色sprite
        const sprite = this.addComponent(Sprite)
        //自定义宽高
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        const transform= this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH*4,TILE_HEIGHT*4)

        //加载图片资源,因为spriteFrames是个promise,所以需要await,init方法也需要async
        const spriteFrames=await ResourceManager.Instance.loadDir("texture/player/idle/top")
        //加载Animation动画
        const animationComponent=  this.addComponent(Animation)


        //coocs官网的程序化编辑动画剪辑的例子
        const animationClip = new AnimationClip();


        const track  = new animation.ObjectTrack(); // 创建一个对象轨道
         // 指定轨道路径，即指定目标对象为 "Sprite" 子节点的 "spriteFrame" 属性
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        //关键帧列表,需要给个类型，数字是帧，类型是SpriteFrame,
        //map方法会遍历数组中的每个元素，并对每个元素执行提供的函数。
        //回调函数中的参数顺序是固定的：第一个参数是当前元素，第二个参数是当前元素的索引（如果提供了第二个参数的话）

        const frames:Array<[number,SpriteFrame]> = spriteFrames.map((item,index)=>[ANIMATION_SPEED*index,item])

        track.channel.curve.assignSorted(frames);

        // 最后将轨道添加到动画剪辑以应用
        animationClip.addTrack(track);

        // 整个动画剪辑的周期
        animationClip.duration =frames.length*ANIMATION_SPEED;
        //循环播放
        animationClip.wrapMode=AnimationClip.WrapMode.Loop;
        //设置defalutClip
        animationComponent.defaultClip = animationClip;
        //播放组件
        animationComponent.play()
    }
}
