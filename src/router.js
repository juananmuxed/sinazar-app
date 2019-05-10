import Vue from 'vue'
import Router from 'vue-router'
import Inicio from './views/Inicio.vue'
import Sobre from './views/Sobre.vue'
import Juegos from './views/Juegos.vue'
import Opciones from "./views/Opciones.vue"
import Entrar from "./views/Entrar.vue"
import Registrar from "./views/Registrar.vue";
import Creacion from "./views/Creacion.vue"

Vue.use(Router)

export default new Router({
  mode: 'history',
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
    },
    {
      path:'/opciones',
      name: 'opciones',
      component: Opciones
    },
    {
      path:'/registrar',
      name: 'registrar',
      component: Registrar
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
      component: Creacion
    }
  ]
})
