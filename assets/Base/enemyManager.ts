import { _decorator } from "cc";
import { IEntity } from "../Levels";
import { EntityManager } from "./EntityManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from "../Enum";
import { EventManager } from "../Runtime/EventManager";
import { DataManager } from "../Runtime/DataManager";

const { ccclass, property } = _decorator;

//木骷髅管理器，管理木骷髅动画
@ccclass('enemyManager')
export class enemyManager extends EntityManager {
  async init(params:IEntity){
      super.init(params)
    //玩家出生时也调用这个方法
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)

    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onEnemyDeath,this)

      //玩家先生成时也触发这个方法
    this.onChangeDirection(true)

  };
  onDestroy(){
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onEnemyDeath)

  }


  //敌人根据角色位置转向方法
  onChangeDirection(isInit=false){
    //判断玩家是否存在
    if(this.state===ENTITY_STATE_ENUM.DEATH||!DataManager.Instance.player){
      return
    }
    const {x:playerX,y:playerY}=DataManager.Instance.player

    //用敌人的坐标减去角色的坐标，得到敌人与角色之间的距离
    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)
    //当玩家与敌人处于对角线，不转向，但是初始时不执行这个判断
    if(disX==disY &&!isInit){
      return
    }
    //判断玩家在敌人的第几象限
    if(playerX>=this.x&&playerY<=this.y){
      //如果y的距离比x的大则敌人向上看，否则向右看
        this.direction=disY>disX?DIRECTION_ENUM.TOP:this.direction=DIRECTION_ENUM.RIGHT
    } else if (playerX<=this.x&&playerY<=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.TOP:this.direction=DIRECTION_ENUM.LEFT
    }else if (playerX<=this.x&&playerY>=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.BOTTOM:this.direction=DIRECTION_ENUM.LEFT
    }else if (playerX>=this.x&&playerY>=this.y){
      this.direction=disY>disX?DIRECTION_ENUM.BOTTOM:this.direction=DIRECTION_ENUM.RIGHT
    }
  }


  onEnemyDeath(id:string){
    console.log(id)
    console.log("this.id",this.id)
    if(this.state===ENTITY_STATE_ENUM.DEATH){
      return
    }
    if(this.id ===id){
      this.state=ENTITY_STATE_ENUM.DEATH
    }
  }
}
