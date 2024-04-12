import Home from '../products/pages/Home.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import checkAuthentication from '../products/store/authstore'

const routes = [
    {
        path: '/',
        component: () => import("../products/layout/LayoutPublic.vue"),
        children: [
            {
              path: '',
              component: Home
            },
            {
              path: 'contact',
              component: () => import('../products/pages/Contact.vue')
            },
            {
              path: 'login',
              component: () => import('../products/pages/Login.vue')
            },
            {
              path: 'signUp',
              component: () => import('../products/pages/CreateAcount.vue')
            },
            {
              path: 'products',
              component: () => import('../products/pages/Products.vue')
            },
            {
              path: 'sell',
              component: () => import('../products/pages/Sell.vue')
            },
        ]
    },
    
    {
        path: '/private',
        component: () => import("../products/layout/LayoutPrivate.vue"),
        children: [
            {
              path: '/perfil',
              beforeEnter: (to, from, next) => {
                  const loggedIn = checkAuthentication()
                  if (!loggedIn) {
                      next('/login')
                  } else {
                      next()
                  }
              },
              component: () => import('../products/pages/Profile.vue')
            },

        ]
    },
    
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../products/pages/NotFound404.vue')
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router