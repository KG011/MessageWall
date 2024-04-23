import Message from './Detail/index'
// vue3注册全局组件库写法
// app.component(组件名，组件文件)

// 导出一个配置，用于app.use()
export default{
    install(app){
        // 全局挂载 this.$message
        app.config.globalProperties.$message=Message
    }
}