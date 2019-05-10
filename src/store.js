import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'
import createPersistedState from 'vuex-persistedstate'
import cookie from 'js-cookie'

Vue.use(Vuex)

const state = {
  usuario:{
    email:null,
    activo:false
  },
  formulario:{ 
    registrar:{
      email:'',
      pass:'',
      reglasemail:[
        v => !!v || 'Email requerido',
        v => /.+@.+/.test(v) || 'Introduce un correo válido'
      ],
      reglaspass:[
        v => !!v || 'Contraseña requerida'
      ],
      leyes:false,
    }
  },
  menu:{
    drawer:false,
    active:false,
    dark:true,
    color:'orange',
    textcolor:' grey--text text--darken-4',
    secondcolor: ' accent-4',
    colorlist:[
      { value:'teal',text:'Aguamarina'},
      { value:'light-green',text:'Verde'},
      { value:'light-blue',text:'Azul'},
      { value:'purple',text:'Morado'},
      { value:'lime',text:'Lima'},
      { value:'orange',text:'Naranja'},
      { value:'brown',text:'Marrón'},
      { value:'grey',text:'Gris'},
    ],
    links:[
      {name:'Inicio',link:'/',active:true,logo:'home'},
      {name:'Juegos',link:'/juegos',active:true,logo:'dice-six'},
      {name:'Sobre la web',link:'/sobre',active:true,logo:'info'}
    ]
  }
}

const mutations = {
  // Mutations -- toolbar
  changelight: (state,value) => state.menu.dark = value,
  changecolor: (state,color) => state.menu.color = color,

  // Mutations -- sing in
  cambiarusuario: (state,pay) => state.usuario.email = pay,
  conectado: (state,pay) => state.usuario.activo = pay
}

const actions = {
  entrar({commit},{mail,pass}){
    firebase.auth().signInWithEmailAndPassword(mail,pass)
    .then(user => {
      commit('conectado',true)
      commit('cambiarusuario',user)
      router.push('/juegos')
      console.log('Usuario conectado')
    },(error) => {
      console.error(error.code)
    })
  },
  salir({commit}) {
    firebase.auth().signOut().then(()=>{
      commit('conectado',false)
      commit('cambiarusuario',null)
      router.push('/entrar')
      console.log('Usuario desconectado')
    },(error) => {
      console.error(error.code)
      router.push('/entrar')
    })
  }
}

const getters = {
  selectcolor(state){
    if(state.menu.dark){return ' darken-5'}
    else{return ' lighten-4'}
  },
  selectcolorinvert(state){
      if(!state.menu.dark){return ' darken-2'}
      else{return ' lighten-4'}
  },
  autentificado(state){
    return state.usuario.activo === true
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState({
    key: 'sin-azar-cookie',
    paths: [
      'usuario',
      'menu'
    ],
    getState: (key) => cookie.getJSON(key),
    setState: (key, state) => cookie.set(key, state, {expires: 7})
  })]
})
