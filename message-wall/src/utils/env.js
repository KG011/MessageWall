// 域名地址
let baseUrL=''
// 路由模式 
let routerMode='hash'
// 图片存放地址
let baseImgPath;
// 开发环境
if(process.env.NODE_ENV=='development'){
    baseUrL='http://localhost:3000'
    baseImgPath='https://localhost:5173'

}else{
    baseUrL='https://localhost:3000'
    baseImgPath='https://localhost:5173'
}
export{
    baseUrL,
    routerMode,
    baseImgPath
}