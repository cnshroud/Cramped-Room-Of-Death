import { _decorator, UITransform } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from "../../Enum";
import { EventManager } from "../../Runtime/EventManager";
import { DataManager } from "../../Runtime/DataManager";
import { enemyManager } from "../../Base/enemyManager";
import { BurstStateMachine } from "./BurstStateMachine";
import { TILE_HEIGHT, TILE_WIDTH } from "../Tile/TileManager";
import { IEntity } from "../../Levels";

const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends enemyManager {
  async init(params:IEntity){
    this.fsm =this.addComponent(BurstStateMachine)
      await this.fsm.init()
      super.init(params)

      //修改地裂图片大小，是与瓦片一样的
      const transform= this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)
    //玩家出生时也调用这个方法
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst,this)


  };
  onDestroy(){
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst)
  }

  //重写update方法
  update(){
    this.node.setPosition(this.x*TILE_WIDTH,-this.y*TILE_HEIGHT)
  }
  //地裂陷阱
  onBurst(){
    //如果玩家死亡就不执行这个方法
    if(this.state===ENTITY_STATE_ENUM.DEATH){
      return
    }
    //拿到玩家位置
    const {x:playerX,y:playerY}=DataManager.Instance.player

    if(this.x ===playerX&&this.y===playerY  && this.state===ENTITY_STATE_ENUM.IDLE){
      this.state=ENTITY_STATE_ENUM.ATTACK
    }else if (this.state===ENTITY_STATE_ENUM.ATTACK ){
      this.state=ENTITY_STATE_ENUM.DEATH
      //被地裂陷阱打死则直接向下震动
      console.log("动了吗")
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE,SHAKE_TYPE_ENUM.BOTTOM)
      //判断人是否在地裂上
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }

}
