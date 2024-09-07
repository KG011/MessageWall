import fetch from '../utils/axios'
// 登录
export const LoginApi=data=>fetch.post('/login',data)
// 注册
export const RegisterApi=data=>fetch.post('/Register',data)
//获取用户信息
export const userInfoApi=data=>fetch.post('/userInfo',data)
//上传更新头像
export const updateAvatarApi=data=>fetch.post('/updateAvatar',data)

export const updateCMTAvatarApi=data=>fetch.post('/updateCMTAvatar',data)

// 获取访问者ip
export const signIpApi=()=>fetch.post('/signip')
// 新建wall
export const insertWallApi=data=>fetch.post('/insertWall',data)
// 新建评论
export const insertCommentApi=data=>fetch.post('/insertComment',data)
// 分页查询
export const findWallPageApi=data=>fetch.post('/findWallPage',data)
// 评论查询
export const findCommentPageApi=data=>fetch.post('/findCommentPage',data)

export const profileApi=data=>fetch.post('/profile',data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

