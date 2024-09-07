const controller = require('../controller/dbServe')
module.exports = function (app) {
    app.get('/text', (req, res) => {
        res.type('html')
        res.render('text')
    })
    // 登录
    app.post('/login', (req, res) => {
        controller.login(req, res)
    })
    // 注册
    app.post('/register', (req, res) => {
        controller.register(req, res)
    })
    // 获取用户信息
    app.post('/userInfo', (req, res) => {
        controller.userInfo(req, res)
    })
    // 上场头像
    app.post('/updateAvatar', (req, res) => {
        controller.updateAvatar(req, res)
    })
     // 上场头像
     app.post('/updateCMTAvatar', (req, res) => {
        controller.updateCMTAvatar(req, res)
    })
    // 新建墙
    app.post('/insertwall', (req, res) => {
        controller.insertWall(req, res)
    })
    // 新建反馈
    app.post('/insertFeedback', (req, res) => {
        controller.insertFeedback(req, res)
    })
    // 新建留言
    app.post('/insertComment', (req, res) => {
        controller.insertComment(req, res)
    })
    // 删除墙
    app.post('/deleteWall', (req, res) => {
        controller.deleteWall(req, res)
    })
    // 删除反馈
    app.post('/deleteFeedback', (req, res) => {
        controller.deleteFeedback(req, res)
    })
    // 删除留言
    app.post('/deleteComment', (req, res) => {
        controller.deleteComment(req, res)
    })
    // 分页查询wall并获取赞、举报、撤销数据
    app.post('/findWallPage', (req, res) => {
        controller.findWallPage(req, res)
    })
    // 倒叙分页查墙的评论
    app.post('/findCommentPage', (req, res) => {
        controller.findCommentPage(req, res)
    })
    // 用户ip登记
    app.post('/signip', (req, res) => {
        const ip=req.ip
        res.send({
            code:200,
            ip:ip
        })
    })
}