//枚举的好处，在你的代码中，你可以使用枚举来定义一组相关的常量，这样可以使代码更加清晰和易于维护。
//瓦片地图枚举类型
/**
 * 横着的墙壁
 * 竖着的墙壁
 * 左上角
 * 左下角
 * 右下角
 * 右上角
 * 悬崖中间
 * 悬崖左边
 * 悬崖右边
 * 地板
 */
export enum TILE_TYPE_ENUM{
  WALL_ROW="WALL_ROW",
  WALL_COLUMN="WALL_COLUMN",
  WALL_LEFT_TOP="WALL_LEFT_TOP",
  WALL_LEFT_BOTTOM="WALL_LEFT_BOTTOM",
  WALL_RIGHT_BOTTOM="WALL_RIGHT_BOTTOM",
  WALL_RIGHT_TOP="WALL_RIGHT_TOP",
  CLIFF_CENTER="CLIFF_CENTER",
  CLIFF_LEFT="CLIFF_LEFT",
  CLIFF_RIGHT="CLIFF_RIGHT",
  FLOOR="FLOOR"
}
//事件枚举
export enum EVENT_ENUM{
  NEXT_LEVEL="NEXT_LEVEL",
  PLAYER_CTRL="PLAYER_CTRL",
}

//移动枚举
export enum CONTORLLER_ENUM{
  TOP="TOP",
  BOTTOM="BOTTOM",
  LEFT="LEFT",
  RIGHT="RIGHT",
  TURNLEFT="TURNLEFT",
  TURNRIGHT="TURNRIGHT"
}
//状态机类型
export enum FSM_PARAMS_TYPE_ENUM{
  TRIGGER="TRIGGER",
  NUMBER="NUMBER",
}

export enum PARAMS_NAME_ENUM{
  IDLE="IDLE",
  TURNLEFT="TURNLEFT",
}
