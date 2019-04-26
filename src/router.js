import Vue from 'vue'
import Router from 'vue-router'
import Inicio from './views/Inicio.vue'
import Sobre from './views/Sobre.vue'
import Juegos from './views/Juegos.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: Sobre
    },
    {
      path:'/juegos',
      name: 'juegos',
      component: Juegos
    }
  ]
})
