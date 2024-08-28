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
  PLAYER_MOVE_END="PLAYER_MOVE_END",
  PLAYER_BORN="PLAYER_BORN",
  ATTACK_PLAYER="ATTACK_PLAYER",
  ATTACK_ENEMY="ATTACK_ENEMY",
  DOOR_OPEN="DOOR_OPEN",
  SHOW_SMOKE= "SHOW_SMOKE",
  SCREEN_SHAKE="SCREEN_SHAKE",

}

//移动枚举
export enum CONTROLLER_ENUM{
  TOP="TOP",
  BOTTOM="BOTTOM",
  LEFT="LEFT",
  RIGHT="RIGHT",
  TURNLEFT="TURNLEFT",
  TURNRIGHT="TURNRIGHT",
}
//状态机类型
export enum FSM_PARAMS_TYPE_ENUM{
  TRIGGER="TRIGGER",
  NUMBER="NUMBER",
}
//状态机参数枚举
export enum PARAMS_NAME_ENUM{
  IDLE="IDLE",
  TURNLEFT="TURNLEFT",
  TURNRIGHT="TURNRIGHT",
  DIRECTION="DIRECTION",
  //向前撞墙
  BLOCKFRONT="BLOCKFRONT",
  BLOCKBACK="BLOCKBACK",
  BLOCKLEFT="BLOCKLEFT",
  BLOCKRIGHT="BLOCKRIGHT",
  BLOCKTURNLEFT="BLOCKTURNLEFT",
  BLOCKTURNRIGHT="BLOCKTURNRIGHT",

  ATTACK="ATTACK",
  DEATH="DEATH",
  AIRDEATH="AIRDEATH",

  SPIKES_CUR_COUNT="SPIKES_CUR_COUNT",
  SPIKES_TOTAL_COUNT="SPIKES_TOTAL_COUNT",
}
//方位枚举
export enum DIRECTION_ENUM{
  TOP="TOP",
  BOTTOM="BOTTOM",
  LEFT="LEFT",
  RIGHT="RIGHT",
}

//实体状态枚举
export enum ENTITY_STATE_ENUM{
  IDLE="IDLE",
  TURNLEFT="TURNLEFT",
  TURNRIGHT="TURNRIGHT",
  //向前撞墙
  BLOCKFRONT="BLOCKFRONT",
  BLOCKBACK="BLOCKBACK",
  BLOCKLEFT="BLOCKLEFT",
  BLOCKRIGHT="BLOCKRIGHT",
  BLOCKTURNLEFT="BLOCKTURNLEFT",
  BLOCKTURNRIGHT="BLOCKTURNRIGHT",

  ATTACK="ATTACK",
  DEATH="DEATH",
  AIRDEATH="AIRDEATH",

}
//数字枚举，既可以把数字映射成字符串也可以把字符串映射成数字
export enum DIRECTION_ORDER_ENUM{
  TOP=0,
  BOTTOM=1,
  LEFT=2,
  RIGHT=3,
}

//实体类型
export enum ENTITY_TYPE_ENUM{
  PLAYER="PLAYER",
  SKELETON_WOODEN="SKELETON_WOODEN",
  SKELETON_IRON="SKELETON_IRON",
  DOOR="DOOR",
  BURST="BURST",
  SPIKES_ONE="SPIKES_ONE",
  SPIKES_TWO="SPIKES_TWO",
  SPIKES_THREE="SPIKES_THREE",
  SPIKES_FOUR="SPIKES_FOUR",
  SMOKE="SMOKE",
}

//地刺总点数枚举
export enum SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM{
  SPIKES_ONE=2,
  SPIKES_TWO=3,
  SPIKES_THREE=4,
  SPIKES_FOUR=5,
}

//地刺点数枚举
export enum SPIKE_COUNT_ENUM{
  ZERO='ZERO',
  ONE='ONE',
  TWO='TWO',
  THREE='THREE',
  FOUR='FOUR',
  FIVE='FIVE',
}
//地刺的点数转数字枚举
export enum SPIKES_COUNT_MAP_NUMBER_ENUM{
  ZERO=0,
  ONE=1,
  TWO=2,
  THREE=3,
  FOUR=4,
  FIVE=5,
}
