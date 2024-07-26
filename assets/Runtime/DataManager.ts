import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";

export class DataManager extends Singleton{
  //用get的好处不用.GetInstance()，直接.GetInstance就行了
  static get Instance(){
    return super.GetInstance<DataManager>()
  }

  mapInfo:Array<Array<ITile>>
  mapRowCount:number
  mapColCount:number
  //关卡信息
  levelIndex:number=1

  //重置数据中心(关卡信息不用清空)
  reset(){
    this.mapInfo=[]
    this.mapRowCount=0
    this.mapColCount=0

  }
}
