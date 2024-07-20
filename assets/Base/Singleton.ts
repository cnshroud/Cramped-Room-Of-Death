//单例模式，适用于需要经常调用其中方法的类，例如datamanager、eventmanager
//为什么要用泛型，不用泛型的话类型就是any，any在使用instance. 的时候不会提示例如mapinof等信息所以要用泛型
export default class Singleton {
  private static _instance: any=null;
  static GetInstance<T>():T{
    if(this._instance===null){
      this._instance=new this();
    }

    return this._instance;
  }
}
