import { resources, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";

export class ResourceManager extends Singleton{
  //用get的好处不用.GetInstance()，直接.GetInstance就行了
  static get Instance(){
    return super.GetInstance<ResourceManager>()
  }
//resources的资源加载函数是回调函数，不太好写所以封装成promise
loadDir(path:string,type:typeof SpriteFrame=SpriteFrame){
    return new Promise<SpriteFrame[]>((resolve,reject)=>{
        resources.loadDir(path,type,function(err,assets){
          if(err){
            //有报错就reject掉
            reject(err)
            return
          }
          //没有报错就resolve
          resolve(assets)
        })
    })
  }
}
