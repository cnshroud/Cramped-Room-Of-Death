import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";
import { TileManager } from "../Scripts/Tile/TileManager";

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

  //重置数据中心(关卡信息不用清空)
  reset(){
    this.mapInfo=[]
    this.tileInfo=[]
    this.mapRowCount=0
    this.mapColCount=0

  }
}
