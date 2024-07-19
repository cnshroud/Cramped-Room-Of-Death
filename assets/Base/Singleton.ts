//单例模式
//为什么要用泛型，不用泛型的话类型就是any，any在使用instance. 的时候不能给出例如mapinof等信息所以要用泛型
export default class Singleton {
  private static _instance: any=null;
  static GetInstance<T>():T{
    if(this._instance===null){
      this._instance=new this();
    }

    return this._instance;
  }
}
