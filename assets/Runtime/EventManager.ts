import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";


interface IItem{
    func:Function,
    ctx:unknown
}

export class EventManager extends Singleton{
  //用get的好处不用.GetInstance()，直接.GetInstance就行了
  static get Instance(){
    return super.GetInstance<EventManager>()
  }
  //事件中心，事件中心本质是map，map的key是事件名称，value是数组，数组里放的是方法
  /** 例如battlemanager定义一个事件名称nextlevel，然后把跳转到下一关的方法放到数组里
   * 当按钮想要触发下一关事件的时候就到eventManager里面去找有没有这个事件，有则调用这个事件的全部方法
   * 优点：非常解耦 不管是battlemanager还是下一关的按钮都不知道对方存在，只知道要触发和绑定eventmanager中的方法
  /**
   * {
   *    事件名称:[方法，方法，方法]
   *    事件名称:[方法，方法，方法]
   *    事件名称:[方法，方法，方法]
   * }
   */
  //事件map
//   private eventDic:Map<string,Array<Function>> =new Map()
//因为要传入上下文，所以泛型不能为Function，自定义一个IItem
    private eventDic:Map<string,Array<IItem>> =new Map()

  //往事件字典里加方法,上下文（可选的）  绑定事件
  on(eventName:string,func:Function,ctx?:unknown){
    //判断有没有eventName事件
    if(this.eventDic.has(eventName)){
        this.eventDic.get(eventName).push({func,ctx})
    }else{
        this.eventDic.set(eventName,[{func,ctx}])
    }
  }

  //解绑
  off(eventName:string,func:Function){
    if(this.eventDic.has(eventName)){
        //先找到eventName事件，再通过索引找到func方法
        const index =this.eventDic.get(eventName).findIndex(i=>i.func===func)
        //如果找到了func则删除
        index >-1 &&this,this.eventDic.get(eventName).splice(index,1)
    }
  }

  //触发事件,触发时可能会调用参数，类型不知，所以加上...params:unknown[]
  emit(eventName:string,...params:unknown[] ){
    if(this.eventDic.has(eventName)){
        //有则遍历数组，调用方法
        this.eventDic.get(eventName).forEach(({func,ctx})=>{
            //this的地址指向经常会指到不同地方，所以再绑定方法时要加入上下文
            //如果绑定时传入上下文，则加入上下文,否则直接执行func
            ctx?func.apply(ctx,params): func(...params)
        })

    }
  }

  //清空字典
  clear(){
    this.eventDic.clear()
    }
}
