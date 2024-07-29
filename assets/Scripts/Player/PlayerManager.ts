
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { ResourceManager } from '../../Runtime/ResourceManager';
const { ccclass, property } = _decorator;

//帧数常量 1秒8帧
const ANIMATION_SPEED=1/8
@ccclass('PlayerManager')
export class PlayerManager extends Component {


    async init(){
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
        //关键帧列表,需要给个类型，数字是帧，类型是SpriteFrame
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
    };
}
