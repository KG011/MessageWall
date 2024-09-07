const dbModel = require('../lib/db')
// 登录
exports.login = (req, res) => {
    dbModel.login(req, res)
}
// 注册
exports.register = (req, res) => {
    dbModel.register(req, res)
}
exports.userInfo=(req, res) => {
    dbModel.userInfo(req, res)
}
exports.updateAvatar=(req, res)=>{
    let data = req.body
    dbModel.updateAvatar(data.imgurl, data.username)
}
exports.updateCMTAvatar=(req, res)=>{
    let data = req.body
    dbModel.updateCMTAvatar(data.imgurl, data.username)
}

// 新建墙
exports.insertWall = async (req, res) => {
    let data = req.body
    await dbModel.insertWall([data.type, data.message, data.name, data.userId, data.moment, data.label, data.color, data.imgurl,data.avatar]).then(result => {
        res.send({
            code: 200,
            message: result,
        })
    })
}
// 新建反馈
exports.insertFeedback = async (req, res) => {
    let data = req.body
    await dbModel.insertFeedback([data.wallId, data.userId, data.type, data.moment]).then(result => {
        res.send({
            code: 200,
            message: result
        })
    })
}
// 新建留言
exports.insertComment = async (req, res) => {
    let data = req.body
    await dbModel.insertComment([data.wallId, data.userId, data.imgurl, data.comment, data.name, data.moment]).then(result => {
        res.send({
            code: 200,
            message: result
        })
    })
}
// 删除墙
exports.deleteWall = async (req, res) => {
    let data = req.body
    // 如果地址存在，删除对应照片
    if (data.imgurl) {
        Mkdir.delFiles('data/' + data.imgurl)
    }
    await dbModel.deleteWall(data.id).then(result => {
        res.send({
            code: 200,
            message: result
        })
    })
}
// 删除反馈
exports.deleteFeedback = async (req, res) => {
    let data = req.body
    await dbModel.deleteFeedback(data.id).then(result => {
        res.send({
            code: 200,
            message: result
        })
    })
}
// 分页查询wall并获取赞、举报、撤销数据
exports.findWallPage = async (req, res) => {
    let data = req.body
    await dbModel.findWallPage(data.page, data.pagesize, data.type, data.label).then(async result => {
        for (let i = 0; i < result.length; i++) {
            // 喜欢
            result[i].like = await dbModel.findFeedback(result[i].id, 0)
            // 举报
            result[i].report = await dbModel.findFeedback(result[i].id, 1)
            // 要求撤销
            result[i].revoke = await dbModel.findFeedback(result[i].id, 2)
            // 是否点赞
            result[i].islike = await dbModel.findFeedback(result[i].id, data.userId)
            // 评论数
            result[i].comcount = await dbModel.findFeedback(result[i].id)
        }
        res.send({
            code: 200,
            message: result
        })
    })
}
// 倒叙分页查墙的评论
exports.findCommentPage = async (req, res) => {
    let data = req.body
    await dbModel.findCommentPage(data.page, data.pagesize, data.id).then(result => {
        res.send({
            code: 200,
            message: result
        })
    })
}