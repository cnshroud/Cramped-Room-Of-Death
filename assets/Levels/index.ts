//为了统一入口，之后好调用
//把地图资源都放在这
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from '../Enum';
import Level1 from './Level1';
import Level2 from './Level2';

//实体,EntityManager会用到
export interface IEntity{
  x:number;
  y:number;
  type:ENTITY_TYPE_ENUM ;
  direction:DIRECTION_ENUM;
  state:ENTITY_STATE_ENUM;

}
//地刺类型
export interface ISpikes{
  x:number;
  y:number;
  type:ENTITY_TYPE_ENUM ;
  count:number
}
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
