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
import VerificarCorreo from "./views/VerificarCorreo.vue"
import Juego from './views/Juego.vue'
import Editarjuego from './views/EdicionJuego.vue'
import AdminUser from './views/AdminUser.vue'

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
      path:'/juego/:id',
      name:'juego',
      component: Juego
    },
    {
      path:'/opciones',
      name: 'opciones',
      component: Opciones
    },
    {
      path:'/entrar',
      name: 'entrar',
      component: Entrar,
      meta:{
        logeado:true
      }
    },
    // Rutas bloqueadas
    {
      path:'/crearjuego',
      name:'crearjuego',
      component: Creacion,
      meta: {
        autorizado:true,
        verificado:true
      }
    },
    {
      path:'/editarjuego/:id',
      name:'editarjuego',
      component: Editarjuego,
      meta: {
        autorizado:true,
        verificado:true
      }
    },
    {
      path:'/registrar',
      name: 'registrar',
      component: Registrar,
      meta: {
        autorizado:true,
        verificado:true
      }
    },
    {
      path:'/admin',
      name:'admin',
      component: AdminUser,
      meta:{
        autorizado:true
      }
    },
    {
      path:'/verificadoemail',
      name:'verificadoemail',
      component: VerificarCorreo,
      meta:{
        autorizado:true
      }
    }
  ]
})

router.beforeEach((to,from,next) => {
  let usuario = firebase.auth().currentUser
  if(usuario === null){
    usuario = ''
  }
  let autorizado = to.matched.some(record => record.meta.autorizado)
  let login = to.matched.some(record => record.meta.logeado)
  let emailverificado = null
  if(usuario){
    emailverificado = usuario.emailVerified
  }
  let verificado = to.matched.some(record => record.meta.verificado)

  if(autorizado && (!usuario || usuario === null)){
    next('entrar')
  }
  else if (verificado && !emailverificado && (usuario || usuario !== null)){
    next('verificadoemail')
  }
  else if (usuario && login){
    next('juegos')
  }
  else {
    next()
  }
})


export default router
