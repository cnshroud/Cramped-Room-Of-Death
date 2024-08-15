
import { _decorator,} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enum';
import { EventManager } from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import { DataManager } from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;

//玩家管理器，管理玩家动画
@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    targetX:number=0
    targetY:number=0
    private readonly speed:number=1/10

    //判断是否移动
    isMoving=false

    async init(params:IEntity){

        //加入状态机脚本
        this.fsm =this.addComponent(PlayerStateMachine)
        //init方法中有state加载的异步逻辑，无法保障setParams之前把state加载完，
        //所以要用waitingList:Array<Promise<SpriteFrame[]>>=[]
        await this.fsm.init()
        //退出init方法后才进行状态变换
        // this.fsm.setParams(PARAMS_NAME_ENUM.IDLE,true)
        // console.log("修改后的状态机",this.fsm.getParams(PARAMS_NAME_ENUM.IDLE))

        //父类初始化
        super.init(params)
        this.targetX=this.x
        this.targetY=this.y
        //设置初始方向
        // this.direction=DIRECTION_ENUM.TOP

        //数据ui分离后只需要修改状态即可setParams
        // this.state=ENTITY_STATE_ENUM.IDLE

        //使用状态机就不需要渲染了
        // await this.render()
        //把move方法绑定到evenetmanegr
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER,this.onDead,this)

    };
    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL,this.inputHandle)
        EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER,this.onDead)
    }

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
    //角色死亡
    onDead(type:ENTITY_STATE_ENUM){
        console.log(type)
        this.state=type
    }


    //人物移动前处理用户输入的方法
    inputHandle(inputDirection:CONTROLLER_ENUM){
        //判断是否正在移动
        if(this.isMoving){
            return
        }
        //判断人物是否死亡或攻击,这个状态下不能移动
        if(this.state==ENTITY_STATE_ENUM.DEATH||
            this.state==ENTITY_STATE_ENUM.AIRDEATH ||
            this.state==ENTITY_STATE_ENUM.ATTACK
        ){
            return
        }
        //判断是否将要攻击
        const id = this.willAttack(inputDirection)
        if(id){
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY,id)
            EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
            return
        }
        //判断是否撞上了
        if(this.willBlock(inputDirection)){
            console.log("撞上了")
            return
        }
        this.move(inputDirection)

    }
    //人物移动
    move(inputDirection:CONTROLLER_ENUM){
        if(inputDirection===CONTROLLER_ENUM.TOP){
            this.targetY-=1
            this.isMoving=true
            //人物移动时触发烟雾
            this.showSmoke(DIRECTION_ENUM.TOP)
        }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
            this.targetY+=1
            this.isMoving=true
            this.showSmoke(DIRECTION_ENUM.BOTTOM)
        }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
            this.targetX+=1
            this.isMoving=true
            this.showSmoke(DIRECTION_ENUM.RIGHT)
        }else if(inputDirection===CONTROLLER_ENUM.LEFT){
            this.targetX-=1
            this.isMoving=true
            this.showSmoke(DIRECTION_ENUM.LEFT)
        }else if(inputDirection===CONTROLLER_ENUM.TURNLEFT){
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
            this.state=ENTITY_STATE_ENUM.TURNLEFT
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
        } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
            if (this.direction === DIRECTION_ENUM.TOP) {
              this.direction = DIRECTION_ENUM.RIGHT
            } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
              this.direction = DIRECTION_ENUM.LEFT
            } else if (this.direction === DIRECTION_ENUM.LEFT) {
              this.direction = DIRECTION_ENUM.TOP
            } else if (this.direction === DIRECTION_ENUM.RIGHT) {
              this.direction = DIRECTION_ENUM.BOTTOM
            }
            this.state = ENTITY_STATE_ENUM.TURNRIGHT
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
          }
    }
    //展示烟雾
    showSmoke(type:DIRECTION_ENUM){
        //绑定事件
        console.log('showSmoke',type)
        EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE,this.x,this.y,type)
    }

    //攻击判断
    willAttack(type:CONTROLLER_ENUM){
        //拿到所有没死的敌人位置，看玩家面向的方向继续往前走会不会碰到敌人
        const enemies = DataManager.Instance.enemies.filter(
            enemy=>enemy.state!==ENTITY_STATE_ENUM.DEATH
        )
        for (let i=0;i<enemies.length;i++){
            const {x:enemyX,y:enemyY,id:enemyId}=enemies[i]
            if(
                type===CONTROLLER_ENUM.TOP &&
                this.direction===DIRECTION_ENUM.TOP &&
                enemyX==this.x &&
                enemyY==this.targetY-2
            ){
                this.state=ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }else  if(
                type===CONTROLLER_ENUM.BOTTOM &&
                this.direction===DIRECTION_ENUM.BOTTOM &&
                enemyX==this.x &&
                enemyY==this.targetY+2
            ){
                this.state=ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }
            else  if(
                type===CONTROLLER_ENUM.LEFT &&
                this.direction===DIRECTION_ENUM.LEFT &&
                enemyX==this.x-2 &&
                enemyY==this.targetY
            ){
                this.state=ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }
            else  if(
                type===CONTROLLER_ENUM.RIGHT &&
                this.direction===DIRECTION_ENUM.RIGHT &&
                enemyX==this.x+2 &&
                enemyY==this.targetY
            ){
                this.state=ENTITY_STATE_ENUM.ATTACK
                return enemyId
            }
        }

        return ''
    }

    //判断是否撞上墙了
    willBlock(inputDirection:CONTROLLER_ENUM){
        //把自己人物的xy和方向解构出来
        const { targetX:x,targetY:y,direction}=this
        //把瓦片信息解构出来
        const {tileInfo} =DataManager.Instance

        const {x:doorX,y:doorY,state:doorState} =DataManager.Instance.door ||{} //有些关卡没门
        const enemies=DataManager.Instance.enemies.filter(
            enemy=>enemy.state!==ENTITY_STATE_ENUM.DEATH
        )
        const bursts=DataManager.Instance.bursts.filter(
            burst=>burst.state!==ENTITY_STATE_ENUM.DEATH
        )


        // const {mapColCount:row,mapRowCount:column}=DataManager.Instance
        //输入方向是上
        if(inputDirection===CONTROLLER_ENUM.TOP){
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

                //判断是否撞上门了
                if(((x===doorX&&playerNextY===doorY)||(x===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                //是否撞敌人上了
                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if(((x===enemyX&&playerNextY===enemyY)||(x===enemyX&&weaponNextY===enemyY))
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }

                //当人能走（moveable为true），枪也能走的情况下(瓦片不存在或者turnable为true)
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    //修改状态，把状态机设为blockfront
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.BOTTOM){
                //面向方向是下------------------------------------------------------
                const playerNextY = y-1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]

                if((x===doorX&&playerNextY===doorY)&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((x===enemyX&&playerNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                        return true
                    }
                }


                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)){
                        return false
                    }
                }

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

                if(((x===doorX&&playerNextY===doorY)||(weaponNextX===doorX&&playerNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if(((x===enemyX&&playerNextY===enemyY)||(weaponNextX===enemyX&&playerNextY===enemyY))
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }

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

                if(((x===doorX&&playerNextY===doorY)||(weaponNextX===doorX&&playerNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if(((x===enemyX&&playerNextY===enemyY)||(weaponNextX===enemyX&&playerNextY===enemyY))
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }

                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){
                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKFRONT
                    return true
                }
            }







        }else if(inputDirection===CONTROLLER_ENUM.BOTTOM){
            //下-----------------------------------------------------------------------------------------------------------------------
            if(direction===DIRECTION_ENUM.TOP){
                const playerNextY = y+1
                if(playerNextY<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
                const playerTile=tileInfo[x][playerNextY]

                if((x===doorX&&playerNextY===doorY)&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((x===enemyX&&playerNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKBACK
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)){
                        return false
                    }
                }
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

                if(((x===doorX&&playerNextY===doorY)||(x===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((x===enemyX&&playerNextY===enemyY)||(x===doorX&&weaponNextY===doorY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKBACK
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
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

                if(((x===doorX&&playerNextY===doorY)||(weaponNextX===doorX&&playerNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((x===enemyX&&playerNextY===enemyY)||(weaponNextX===enemyX&&playerNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKBACK
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }

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

                if(((x===doorX&&playerNextY===doorY)||(weaponNextX===doorX&&playerNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((x===enemyX&&playerNextY===enemyY)||(weaponNextX===enemyX&&playerNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKBACK
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((x===burstX&&playerNextY===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKBACK
                    return true
                }
            }



        }else if(inputDirection===CONTROLLER_ENUM.LEFT){
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

                if(((playerNextX===doorX&&y===doorY)||(playerNextX===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(playerNextX===enemyX&&weaponNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
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

                if(((playerNextX===doorX&&y===doorY)||(playerNextX===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(playerNextX===enemyX&&weaponNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.LEFT){
                const playerNextX = x-1
                const weaponNextX = x-2
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]
                const weaponTile=tileInfo[weaponNextX][y]

                if(((playerNextX===doorX&&y===doorY)||(weaponNextX===doorX&&y===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(weaponNextX===enemyX&&y===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.RIGHT){
                const playerNextX = x-1
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
                const playerTile=tileInfo[playerNextX][y]


                if(((playerNextX===doorX&&y===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                        return true
                    }
                }
                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKLEFT
                    return true
                }
            }


        }else if(inputDirection===CONTROLLER_ENUM.RIGHT){
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

                if(((playerNextX===doorX&&y===doorY)||(playerNextX===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(playerNextX===enemyX&&weaponNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
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

                if(((playerNextX===doorX&&y===doorY)||(playerNextX===doorX&&weaponNextY===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(playerNextX===enemyX&&weaponNextY===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
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

                if(((playerNextX===doorX&&y===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }else if(direction===DIRECTION_ENUM.RIGHT){
                const playerNextX = x+1
                const weaponNextX = x+2
                if(playerNextX<0){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
                const playerTile=tileInfo[playerNextX]?.[y]
                const weaponTile=tileInfo[weaponNextX]?.[y]

                if(((playerNextX===doorX&&y===doorY)||(weaponNextX===doorX&&y===doorY))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }

                for(let i=0;i<enemies.length;i++){
                    const {x:enemyX,y:enemyY} = enemies[i]
                    if((playerNextX===enemyX&&y===enemyY)||(weaponNextX===enemyX&&y===enemyY)
                    ){
                        this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                        return true
                    }
                }

                //碰到地裂瓦片不算撞到了
                for (let i = 0; i < bursts.length; i++) {
                    const {x:burstX,y:burstY} = bursts[i];
                    if((playerNextX===burstX&&y===burstY)&&(!weaponTile||weaponTile.turnable)){
                        return false
                    }
                }
                if(playerTile&&playerTile.moveable&&(!weaponTile||weaponTile.turnable)){

                }else{
                    this.state=ENTITY_STATE_ENUM.BLOCKRIGHT
                    return true
                }
            }


        }else if(inputDirection===CONTROLLER_ENUM.TURNLEFT){
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
            //判断三个瓦片中有没有门，有门则不能走
            if(((x===doorX&&nextY===doorY )||
                (nextX===doorX&&y===doorY )||
                (nextX===doorX&&nextY===doorY ))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
            ){
                this.state=ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
            //判断是否撞到敌人
            for (let i = 0; i < enemies.length; i++) {
                const {x:enemyX,y:enemyY} = enemies[i];
                if((x===enemyX&&nextY===enemyY )||
                    (nextX===enemyX&&y===enemyY )||
                    (nextX===enemyX&&nextY===enemyY)
            ){
                this.state=ENTITY_STATE_ENUM.BLOCKTURNLEFT
                return true
            }
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
        }else if(inputDirection===CONTROLLER_ENUM.TURNRIGHT){
            //右转按钮判断--------------------------------------------------------------------------------------------------------------------------

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

            if(((x===doorX&&nextY===doorY )||
                (nextX===doorX&&y===doorY )||
                (nextX===doorX&&nextY===doorY ))&&
                doorState!==ENTITY_STATE_ENUM.DEATH
            ){
                this.state=ENTITY_STATE_ENUM.BLOCKTURNRIGHT
                return true
            }

            for (let i = 0; i < enemies.length; i++) {
                const {x:enemyX,y:enemyY} = enemies[i];
                if((x===enemyX&&nextY===enemyY )||
                    (nextX===enemyX&&y===enemyY )||
                    (nextX===enemyX&&nextY===enemyY)
                ){
                    this.state=ENTITY_STATE_ENUM.BLOCKTURNRIGHT
                    return true
                }
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
