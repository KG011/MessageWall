import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: 'Wall?id=0',
        name: 'GJIndex',
        component: () => import('@/view/GJIndex.vue'),
        children: [
            {
                path: 'Wall',
                component: () => import('@/view/GJWallMessage.vue'),
    
            }
        ]
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('@/view/user/Login/index.vue'),
    },
    {
        path: '/Register',
        name: 'Register',
        component: () => import('@/view/user/Register/index.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router