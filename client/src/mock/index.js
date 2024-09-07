import Mock from 'mockjs'
export const DataCard = Mock.mock({
    "data|20": [
        {
            // 时间
            'moment':new Date(),
            'id|+1':1,
            'userId|+1':10,
            // 内容
            'message|24-67':"@cword",
            // 标签
            'label|0-10':0,
            // 用户名
            'name':"@cname",
            // 喜欢的个数
            'like|0-120':0,
            // 留言
            'comment|0-120':0,
            // 背景色
            'imgurl|0-4':0,
            'revoke|0-20':0,
            'report|0-20':0,
            'type':0
        }
    ]
})
export const comment = Mock.mock({
    "data|20": [
        {
            'moment':new Date(),
            'id|+1':1,
            'userId|+1':10,
            // 内容
            'message|24-67':"@cword",
            // 用户名
            'name':"@cname",
            // 背景色
            'imgurl|0-4':0,
        }
    ]
})
export const photo = Mock.mock({
    "data|20": [
        {
            // 时间
            'moment':new Date(),
            'id|+1':1,
            'userId|+1':10,
            // 内容
            'message|24-67':"@cword",
            // 标签
            'label|0-10':0,
            // 用户名
            'name':"@cname",
            // 喜欢的个数
            'like|0-120':0,
            // 留言
            'comment|0-120':0,
            // 背景图
            'imgurl|0-7':0,
            'revoke|0-20':0,
            'report|0-20':0,
            'type':1
        }
    ]
})