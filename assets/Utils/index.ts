import { Layers, UITransform,Node } from "cc"
//工具类，给node设置ui等
export const createUINode=(name:string='')=>{
  const node= new Node(name)
  const transform= node.addComponent(UITransform)
  transform.setAnchorPoint(0,1)
  //要渲染节点需要设置layer，空节点没有layer所以要自己设置
  node.layer = 1 << Layers.nameToLayer("UI_2D")

  return node
}

//瓦片图片随机,竖墙、横墙等图片是有不同样式的图片的
export const randomByRange=(start:number,end:number)=>
  Math.floor(start +(end-start)*Math.random())

