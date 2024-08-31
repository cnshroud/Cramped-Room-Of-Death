import { enemyManager } from "../Base/enemyManager";
import Singleton from "../Base/Singleton";
import { ILevel, ITile } from "../Levels";
import { BurstManager } from "../Scripts/Burst/BurstManager";
import { DoorManager } from "../Scripts/Door/DoorManager";
import { PlayerManager } from "../Scripts/Player/PlayerManager";
import { SmokeManager } from "../Scripts/Smoke/SmokeManager";
import { SpikesManager } from "../Scripts/Spikes/SpikesManager";
import { TileManager } from "../Scripts/Tile/TileManager";


//这里使用了Omit工具类型，它的作用是从一个已有的类型中排除掉某些属性，创建一个新的类型。
export type IRecord=Omit<ILevel,'mapInfo'>

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
  //地刺信息
  spikes:SpikesManager[]
  //门信息
  door:DoorManager
  //烟雾信息
  smokes:SmokeManager[]
  //重置数据中心(关卡信息不用清空)
  //保存数据的数组,yongyu记录关卡信息用来回退和reset
  records:IRecord[]

  reset(){
    this.mapInfo=[]
    this.tileInfo=[]
    this.enemies=[]
    this.player=null
    this.mapRowCount=0
    this.mapColCount=0
    this.door=null
    this.bursts=[]
    this.spikes=[]
    this.smokes=[]
    this.records=[]
  }
}
