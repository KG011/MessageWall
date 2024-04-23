import { createVNode,render } from "vue";
import GJMessage from './GJMessage.vue'
const divVNode=createVNode('div',{class:'message-container'})
render(divVNode,document.body)
const div=divVNode.el
const GjMessage=({message,type})=>{
    const comVNode=createVNode(GJMessage,{message,type})
    render(comVNode,div)
    setTimeout(()=>{
        render(null,div)
    },6000)
}
export default GjMessage