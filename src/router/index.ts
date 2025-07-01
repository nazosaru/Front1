import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/Login.vue'
import framework from '../views/Framework.vue'
import textSearch from '../views/TextSearch.vue'
import imageSearch from '../views/ImageSearch.vue'
import dialogue from '../views/dialogue.vue'
import others from '../views/Others.vue'
import userManagement from '../views/AdminOperations/UserManagement.vue'
import systemManagement from '../views/AdminOperations/SystemManagement.vue'
import profile from "../views/Profile.vue"

const isDevMode = import.meta.env.MODE === 'development';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path:'/framework',
      name:'Framework',
      component:framework
    },
    {
      path:'/textSearch',
      name:'textSearch',
      component:textSearch
    },   
     {
      path:'/imageSearch',
      name:'imageSearch',
      component:imageSearch
    },
    {
      path:'/dialogue',
      name:'dialogue',
      component:dialogue
    },
    {
      path:'/others',
      name:'others',
      component:others
    },
    {
      path:'/userManagement',
      name:'userManagement',
      component:userManagement,
      beforeEnter: (to, from, next) => {
        if (isDevMode || localStorage.getItem('isAdmin') === 'true') {
          next();
        } else {
          next('/');
        }
      }
    },   
    {
      path:'/systemManagement',
      name:'systemManagement',
      component:systemManagement,
      beforeEnter: (to, from, next) => {
        if (isDevMode || localStorage.getItem('isAdmin') === 'true') {
          next();
        } else {
          next('/');
        }
      }
    },
    {
      path:"/profile",
      name:"profile",
      component:profile
    }
  ]
})

export default router
