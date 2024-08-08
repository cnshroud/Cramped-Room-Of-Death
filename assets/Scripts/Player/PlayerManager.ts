
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

    //判断是否移动
    isMoving=false

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
            x:2,
            y:8,
            type:ENTITY_TYPE_ENUM.PLAYER,
            direction:DIRECTION_ENUM.TOP,
            state:ENTITY_STATE_ENUM.IDLE,
        })
        this.targetX=this.x
        this.targetY=this.y
        //设置初始方向
        this.direction=DIRECTION_ENUM.TOP
        //数据ui分离后只需要修改状态即可setParams
        this.state=ENTITY_STATE_ENUM.IDLE

        //使用状态机就不需要渲染了
        // await this.render()
        //把move方法绑定到evenetmanegr
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
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
        if(Math.abs(this.targetX-this.x)<=0.1 &&Math.abs(this.targetY-this.y)<=0.1 && this.isMoving){
            this.isMoving=false
            this.x=this.targetX
            this.y=this.targetY
            //当角色到达目标坐标后，执行，isMoving是为了防止多次触发
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }
    //人物移动前处理用户输入的方法
    inputHandle(inputDirection:CONTORLLER_ENUM){
        //判断是否撞上了
        if(this.willBlock(inputDirection)){
            console.log("撞上了")
            return
        }
        this.move(inputDirection)

    }
    //人物移动
    move(inputDirection:CONTORLLER_ENUM){
        if(inputDirection==CONTORLLER_ENUM.TOP){
            this.targetY-=1
            this.isMoving=true
        }else if(inputDirection==CONTORLLER_ENUM.BOTTOM){
            this.targetY+=1
            this.isMoving=true
        }else if(inputDirection==CONTORLLER_ENUM.RIGHT){
            this.targetX+=1
            this.isMoving=true
        }else if(inputDirection==CONTORLLER_ENUM.LEFT){
            this.targetX-=1
            this.isMoving=true
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
            //旋转时触发移动结束事件
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
            this.state=ENTITY_STATE_ENUM.TURNLEFT
        }else if(inputDirection==CONTORLLER_ENUM.TURNRIGHT){
            if(this.direction===DIRECTION_ENUM.TOP){
                this.direction=DIRECTION_ENUM.RIGHT
            }else if(this.direction===DIRECTION_ENUM.RIGHT){
                this.direction=DIRECTION_ENUM.BOTTOM
            }else if(this.direction===DIRECTION_ENUM.BOTTOM){
                this.direction=DIRECTION_ENUM.LEFT
             }else if(this.direction===DIRECTION_ENUM.LEFT){
                this.direction=DIRECTION_ENUM.TOP
            }
            this.state=ENTITY_STATE_ENUM.TURNRIGHT
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        }
    }
    //判断是否撞上墙了
    willBlock(inputDirection:CONTORLLER_ENUM){
        //把自己人物的xy和方向解构出来
        const { targetX:x,targetY:y,direction}=this
        //把瓦片信息解构出来
        const {tileInfo} =DataManager.Instance
        //输入方向是上
        if(inputDirection===CONTORLLER_ENUM.TOP){
            //面向方向是上
            if(direction===DIRECTION_ENUM.TOP){
                //角色上方的第一个瓦片坐标
                const playerNextY = y-1
                //枪上方的第一个瓦片坐标
                const weaponNextY = y-2
                //判断是否走出地图了
                if(playerNextY<0){

                    //修改状态，把状态机设为blockfront
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                //角色上方的第一个瓦片信息（用于判断人能不能走）
                const playerTile=tileInfo[x][playerNextY]
                //角色上方的第二个瓦片信息（用于判断枪能不能走）
                const weaponTile=tileInfo[x][weaponNextY]
                //当人能走（moveable为true），枪也能走的情况下(瓦片不存在或者turnable为true)
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    //修改状态，把状态机设为blockfront
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                const playerNextY = y-1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.LEFT){
                const playerNextY = y-1
                const weaponNextX = x-1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                const weaponTile=tileInfo[weaponNextX][playerNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.RIGHT){
                const playerNextY = y-1
                const weaponNextX = x+1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                const weaponTile=tileInfo[weaponNextX][playerNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){
                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }







        }else if(inputDirection===CONTORLLER_ENUM.BOTTOM){
            //下-----------------------------------------------------------------------------------------------------------------------
            if(direction===DIRECTION_ENUM.TOP){
                const playerNextY = y+1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                const playerNextY = y+1
                const weaponNextY = y+2

                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                const weaponTile=tileInfo[x][weaponNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
            }else if(direction===DIRECTION_ENUM.LEFT){
                const playerNextY = y+1
                const weaponNextX = x-1

                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                const weaponTile=tileInfo[weaponNextX][playerNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
            }
            else if(direction===DIRECTION_ENUM.RIGHT){
                const playerNextY = y+1
                const weaponNextX = x+1

                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]
                const weaponTile=tileInfo[weaponNextX][playerNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
            }



        }else if(inputDirection===CONTORLLER_ENUM.LEFT){
            //左-----------------------------------------------------------------------------------------------------------------
            if(direction===DIRECTION_ENUM.TOP){
                const playerNextX = x-1
                const weaponNextY = y-1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                const weaponTile=tileInfo[playerNextX][weaponNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                const playerNextX = x-1
                const weaponNextY = y+1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                const weaponTile=tileInfo[playerNextX][weaponNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.LEFT){
                //角色上方的第一个瓦片坐标
                const playerNextX = x-1
                //枪上方的第一个瓦片坐标
                const weaponNextX = x-2
                //判断是否走出地图了
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                //角色上方的第一个瓦片信息（用于判断人能不能走）
                const playerTile=tileInfo[playerNextX][y]
                //角色上方的第二个瓦片信息（用于判断枪能不能走）
                const weaponTile=tileInfo[weaponNextX][y]
                //当人能走（moveable为true），枪也能走的情况下(瓦片不存在或者turnable为true)
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.RIGHT){
                //角色上方的第一个瓦片坐标
                const playerNextX = x-1
                //判断是否走出地图了
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }


        }else if(inputDirection===CONTORLLER_ENUM.RIGHT){
            //右---------------------------------------------------------------------------------------------------------------
            if(direction===DIRECTION_ENUM.TOP){
                const playerNextX = x+1
                const weaponNextY = y-1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                const weaponTile=tileInfo[playerNextX][weaponNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                const playerNextX = x+1
                const weaponNextY = y+1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                const weaponTile=tileInfo[playerNextX][weaponNextY]
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.LEFT){
                const playerNextX = x+1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.RIGHT){
                //角色右方的第一个瓦片坐标
                const playerNextX = x+1
                //枪上方的第一个瓦片坐标
                const weaponNextX = x+2
                //判断是否走出地图了
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
                //角色上方的第一个瓦片信息（用于判断人能不能走）
                const playerTile=tileInfo[playerNextX][y]
                //角色上方的第二个瓦片信息（用于判断枪能不能走）
                const weaponTile=tileInfo[weaponNextX][y]
                //当人能走（moveable为true），枪也能走的情况下(瓦片不存在或者turnable为true)
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }


        }else if(inputDirection===CONTORLLER_ENUM.TURNLEFT){
            //左转按钮判断--------------------------------------------------------------------------------------------------------------------------
            //左转是否撞墙的判定需要三个瓦片
            let nextX
            let nextY
            //如果人物方向向上，则需要检测上、左、左上三个瓦片,其他方向同理
            if(direction===DIRECTION_ENUM.TOP){
                nextX=x-1
                nextY=y-1
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                nextX=x+1
                nextY=y+1
            }
            else if(direction===DIRECTION_ENUM.LEFT){
                nextX=x-1
                nextY=y+1
            }
            else if(direction===DIRECTION_ENUM.RIGHT){
                nextX=x+1
                nextY=y-1
            }
            //判断人物面对方向的上、左、左上三个方位的瓦片是否可走
            if(
                (!tileInfo[x][nextY]||tileInfo[x][nextY].turnable) &&
                (!tileInfo[nextX][y]||tileInfo[nextX][y].turnable) &&
                (!tileInfo[nextX][nextY]||tileInfo[nextX][nextY].turnable)
            ){

            }else{
                this.state=ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
        }else if(inputDirection===CONTORLLER_ENUM.TURNRIGHT){
            //左转按钮判断--------------------------------------------------------------------------------------------------------------------------
            //左转是否撞墙的判定需要三个瓦片
            let nextX
            let nextY
            //如果人物方向向上，则需要检测上、左、左上三个瓦片,其他方向同理
            if(direction===DIRECTION_ENUM.TOP){
                nextX=x+1
                nextY=y-1
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                nextX=x-1
                nextY=y+1
            }
            else if(direction===DIRECTION_ENUM.LEFT){
                nextX=x-1
                nextY=y-1
            }
            else if(direction===DIRECTION_ENUM.RIGHT){
                nextX=x+1
                nextY=y+1
            }
            //判断人物面对方向的上、左、左上三个方位的瓦片是否可走
            if(
                (!tileInfo[x][nextY]||tileInfo[x][nextY].turnable) &&
                (!tileInfo[nextX][y]||tileInfo[nextX][y].turnable) &&
                (!tileInfo[nextX][nextY]||tileInfo[nextX][nextY].turnable)
            ){

            }else{
                this.state=ENTITY_STATE_ENUM.BLOCKTURNRIGHT
                return true
            }
        }



        //没撞上
        return false
    }

}
