const mysql = require('mysql')
const config = require('../config/default')
const bodyParser = require("body-parser")
var jwt = require("jsonwebtoken")
const db = mysql.createConnection({
    host: config.database.HOST,
    user: config.database.USER,
    password: config.database.PASSWORD
})
const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USER,
    password: config.database.PASSWORD,
    database: config.database.WALL
})
let bdbs = (sql, value) => {
    return new Promise((resolve, reject) => {
        db.query(sql, value, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
// 表创建
let query = (sql, value) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, value, (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                    connection.release()//释放链接，放回池里供别人使用
                })
            }
        })

    })
}
let WALLTS = `create database if not exists WALLTS default charset utf8 collate utf8_general_ci;`
let createDatabase = (db) => {
    return bdbs(db || [])
}
let user = `create TABLE if not exists user (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    avatar VARCHAR(255) COMMENT '头像',
    PRIMARY KEY (id)
);`
let walls = `create table if not exists walls(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '类型0信息1图片',
    message VARCHAR(1000) COMMENT '留言',
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    userId VARCHAR(100) NOT NULL COMMENT '创建者ID',
    moment VARCHAR(100) NOT NULL COMMENT '时间',
    label INT NOT NULL COMMENT '标签',
    color INT COMMENT '颜色',
    imgurl VARCHAR(100) COMMENT '图片路径',
    avatar VARCHAR(255) COMMENT '头像',
    PRIMARY KEY (id)
);`

let feedbacks = `create table if not exists feedbacks(
    id INT NOT NULL AUTO_INCREMENT,
    wallId INT NOT NULL COMMENT '墙留言ID',
    userId VARCHAR(100) NOT NULL COMMENT '反馈者ID',
    type INT NOT NULL COMMENT '反馈类型@喜欢1举报2撤销',
    moment VARCHAR(100) NOT NULL COMMENT '时间',
    avatar VARCHAR(255) COMMENT '头像',
    PRIMARY KEY (id)
);`

let comments = `create table if not exists comments(
    id INT NOT NULL AUTO_INCREMENT,
    wallId INT NOT NULL COMMENT '墙留言ID',
    userId VARCHAR(100) NOT NULL COMMENT '评论者ID',
    imgurl VARCHAR(100) COMMENT '头像路径',
    comment VARCHAR(1000) COMMENT '评论内容',
    name VARCHAR(100) NOT NULL COMMENT '用户名',
    moment VARCHAR(100) NOT NULL COMMENT '时间',
    PRIMARY KEY (id)
);`

let createTable = (sql) => {
    return query(sql || [])
}

async function create() {
    await createDatabase(WALLTS);
    createTable(user);
    createTable(walls);
    createTable(feedbacks);
    createTable(comments);
}
create()
// 登录
exports.login = (req, res) => {
    var username = req.body.username
    var password = req.body.password
    const _sql = "select * from user WHERE username=? AND password=?"
    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        } else {
            connection.query(_sql, [username, password], (err, result) => {
                if (err) {
                    throw err
                }
                if (result.length > 0) {
                    // 生成token
                    var token = jwt.sign(
                        {
                            identity: result[0].identity,
                            userName: result[0].username,
                        },
                        "secret",
                        { expiresIn: "7day" },
                    )
                    res.send({ code: 200, data: { msg: "登录成功", token: token, username: username, avatar: result[0].avatar } })

                    // 如果没有登录成功，则返回登录失败
                } else {
                    // 判断token
                    if (req.headers.authorization == undefined || req.headers.authorization == null) {
                        if (req.headers.authorization) {
                            var token = req.headers.authorization.split(" ")[1] // 获取token
                        }
                        jwt.verify(token, "secret", (err, decode) => {
                            if (err) {
                                res.send({ code: 0, msg: "登录失败" })
                            }
                        })
                    }
                }
                connection.release()//释放链接，放回池里供别人使用
            })
        }
    })
}
// 注册
exports.register = (req, res) => {
    var username = req.body.username
    var password = req.body.password
    if (!username || !password)
        return res.send({ status: 1, message: '用户名或密码不能为空' })
    let _sql = 'select * from user where username=?'
    pool.getConnection((err, connection) => {
        if (err) {
            throw err
        } else {
            connection.query(_sql, [username], (err, result) => {
                if (err) {
                    throw err
                }
                if (result.length >= 1) {
                    //2、如果有相同用户名，则注册失败，用户名重复
                    res.send({ code: 0, msg: "注册失败，用户名重复" })
                } else {
                    const sqlStr = "insert into user(username,password) values(?,?)"
                    connection.query(sqlStr, [username, password], (err, result) => {
                        if (err) throw err
                        if (result.affectedRows === 1) {
                            res.send({ code: 1, msg: "注册成功" })
                        } else {
                            res.send({ code: 0, msg: "注册失败" })
                        }
                    })
                }
                connection.release()//释放链接，放回池里供别人使用
            })
        }
    })
}
exports.userInfo = (req, res) => {
    const token = req.body.token;
    if (token) {//存在token
        jwt.verify(token, 'secret', (error, decoded) => {//secret表示密钥，参考第二步设置的密钥
            if (decoded == undefined) {//token过期
                res.send({
                    code: 401,
                    msg: 'token过期'
                });
            } else {//token未过期，且验证通过
                let _sql = 'select * from user where username=?'
                pool.getConnection((err, connection) => {
                    if (err) {
                        throw err
                    } else {
                        connection.query(_sql, [decoded.userName], (err, result) => {
                            if (err) {
                                throw err
                            } else {
                                res.send({
                                    code: 200,
                                    msg: '成功',
                                    userName: decoded.userName,
                                    avatar:result[0].avatar
                                })
                            }
                            connection.release()//释放链接，放回池里供别人使用
                        })
                    }
                })
  
            }
        });
    }
}
exports.updateAvatar = (imgurl, username) => {
    let _sql = `UPDATE user SET avatar ="${imgurl}" WHERE username="${username}";`
    return query(_sql);
}
exports.updateCMTAvatar = (imgurl, username) => {
    console.log(imgurl,username);
    let _sql = `UPDATE comments SET imgurl ="${imgurl}" WHERE name="${username}";`
    return query(_sql);
}
// 新建墙
exports.insertWall = (value) => {
    let _sql = "insert into walls set type=?,message=?,name=?,userId=?,moment=?,label=?,color=?,imgurl=?,avatar=?;"
    return query(_sql, value);
}
// 新建反馈
exports.insertFeedback = (value) => {
    let _sql = "insert into feedbacks set wallId=?,userId=?,type=?,moment=?;"
    return query(_sql, value);
}
// 新建评论
exports.insertComment = (value) => {
    let _sql = "insert into comments set wallId=?,userId=?,imgurl=?,comment=?,name=?,moment=?;"
    return query(_sql, value);
}
// 删除墙
exports.deleteWall = (id) => {
    let _sql = `delete a,b,c from walls a left join feedbacks b on aid=b.wallId left join comments c on a.id=c.wallId where a.id="${id}";`
    return query(_sql);
}
// 删除反馈
exports.deleteFeedback = (id) => {
    let _sql = `delete from feedbacks where id="${id}";`
    return query(_sql);
}

// 删除评论
exports.deleteComment = (id) => {
    let _sql = `delete from comments where id="${id}";`
    return query(_sql);
}
// 分页查询墙
exports.findWallPage = (page, pagesize, type, label) => {
    let _sql
    if (label == 0) {
        _sql = `select * from walls where type="${type}" order by id desc limit ${(page - 1) * pagesize},${pagesize}`
    } else {
        _sql = `select * from walls where type="${type}" and label="${label}" order by id desc limit ${(page - 1) * pagesize},${pagesize}`
    }
    return query(_sql);
}

// 倒叙分页查询评论
exports.findCommentPage = (page, pagesize, id) => {
    let _sql = `select * from comments where wallId="${id}" order by id desc limit ${(page - 1) * pagesize},${pagesize}`
    return query(_sql);
}

// 查询各反馈总数据
exports.findFeedback = (wid, type) => {
    let _sql = `select count(*) as count from feedbacks where wallId="${wid}" and type="${type}"`
    return query(_sql);
}

// 是否点赞
exports.likeCount = (wid, uid) => {
    let _sql = `select count(*) as count from feedbacks where wallId="${wid}" and useId="${uid}" and type=0`
    return query(_sql);

}