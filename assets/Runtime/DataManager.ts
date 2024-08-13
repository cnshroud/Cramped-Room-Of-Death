import { enemyManager } from "../Base/enemyManager";
import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";
import { BurstManager } from "../Scripts/Burst/BurstManager";
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { TileManager } from "../Scripts/Tile/TileManager";
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager";

export class DataManager extends Singleton{
  //用get的好处不用.GetInstance()，直接.GetInstance就行了
  static get Instance(){
    return super.GetInstance<DataManager>()
  }

  mapInfo:Array<Array<ITile>>
  //瓦片信息
  tileInfo:Array<Array<TileManager>>
  mapRowCount:number
  mapColCount:number
  //关卡信息
  levelIndex:number=1
  //角色信息
  player:PlayerManager
  //敌人信息
  enemies:enemyManager[]
  //地裂信息
  bursts:BurstManager[]
  //门信息
  door:DoorManager
  //重置数据中心(关卡信息不用清空)
  reset(){
    this.mapInfo=[]
    this.tileInfo=[]
    this.enemies=[]
    this.player=null
    this.mapRowCount=0
    this.mapColCount=0
    this.door=null
    this.bursts=[]
  }
}
