import { Layers, UITransform,Node } from "cc"
//工具类，给node设置ui等

//箭头函数的优点
/**
 *
 * 箭头函数不绑定自己的this，arguments，super，或new.target。它们会捕获其所在上下文的this值作为函数体内部的this值。这在类的方法或回调函数中特别有用，
 * 因为你不需要担心this的指向问题。虽然在这个特定的例子中，this的绑定可能不是主要考虑因素，但在其他场景下，这一点可能是选择箭头函数的一个重要原因。
 */

//这是一个使用箭头函数语法定义的常量函数createUINode，它接受一个可选的字符串参数name，
//默认为空字符串''。这个函数被导出，意味着它可以在其他文件中被导入和使用。
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

