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
}
