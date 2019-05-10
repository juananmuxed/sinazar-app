import Vue from 'vue'
import firebase from 'firebase'
import Router from 'vue-router'
import Inicio from './views/Inicio.vue'
import Sobre from './views/Sobre.vue'
import Juegos from './views/Juegos.vue'
import Opciones from "./views/Opciones.vue"
import Entrar from "./views/Entrar.vue"
import Registrar from "./views/Registrar.vue";
import Creacion from "./views/Creacion.vue"
import Vacio from "./views/404.vue"

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path:'*',
      redirect: '/404'
    },
    {
      path: '/404',
      name:'404',
      component: Vacio
    },
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
    },
    {
      path:'/opciones',
      name: 'opciones',
      component: Opciones
    },
    {
      path:'/entrar',
      name: 'entrar',
      component: Entrar
    },
    // Rutas bloqueadas
    {
      path:'/crearjuego',
      nombre:'crearjuego',
      component: Creacion,
      meta: {
        autorizado:true
      }
    },
    {
      path:'/registrar',
      name: 'registrar',
      component: Registrar,
      meta: {
        autorizado:true
      }
    },
  ]
})

router.beforeEach((to,from,next) => {
  let usuario = firebase.auth().currentUser
  let autorizado = to.matched.some(record => record.meta.autorizado)

  if(autorizado && !usuario){
    next('entrar')
  }
  else {
    next()
  }
})


export default router
