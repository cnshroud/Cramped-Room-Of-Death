//为了统一入口，之后好调用
//把地图资源都放在这
import { TILE_TYPE_ENUM } from '../Enum';
import Level1 from './Level1';
import Level2 from './Level2';



//定义类型，这样打代码就有类型提示
export interface ITile{
    src: number | null, //地图上可能是空的所以有null
    type: TILE_TYPE_ENUM | null,
}
//关卡类型
export interface ILevel{
  //关卡的二维数组，写成泛型
  mapInfo:Array<Array<ITile>>
}


const levels:Record<string,ILevel> ={
  //这里添加关卡信息ts
  Level1,
  Level2,
}

export default levels;
