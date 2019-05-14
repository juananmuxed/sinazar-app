import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'
import createPersistedState from 'vuex-persistedstate'
import cookie from 'js-cookie'
import axios from 'axios'
import xml2js from 'xml2js'

Vue.use(Vuex)

const state = {
  progreso:{
    snackbar:{
      activo: false,
      tiempo: 6000,
      texto:'',
      color:'success'
    },
    barracarga:{
      valor: 0,
      activo: false,
    }
  },
  usuario:{
    email:null,
    activo:false,
    verificado:false,
    nombre:'',
    foto:'',
    uid:''
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
  },
  nuevojuego:{
    id:'',
    nombre:'',
    imagen: '',
    azar: '',
    desc:'',
    edadminima:18,
    jugadores:[0,100],
    ano:'1900',
    duracion:[0,360],
    azar:1,
    pierdeamigos:1,
    idtemporal:''
  }
}

const mutations = {
  // Mutations -- toolbar
  changelight: (state,value) => state.menu.dark = value,
  changecolor: (state,color) => state.menu.color = color,

  // Mutations -- sing in
  cambiarusuario: (state,pay) => {
    state.usuario.uid = pay.uid
    state.usuario.verificado = pay.emailVerified
    state.usuario.nombre = pay.displayName
    state.usuario.foto = pay.photoURL
    state.usuario.email = pay.email
  },
  conectado: (state,pay) => state.usuario.activo = pay,

  // Mutation -- Snackbar
  notificacion: (state,[activo,color,tiempo,texto]) => {
    state.progreso.snackbar.activo = activo
    state.progreso.snackbar.color = color
    state.progreso.snackbar.tiempo = tiempo
    state.progreso.snackbar.texto = texto
  },

  // Mutation - progress bars

  barracarga: (state,[estado,progreso]) => {
    state.progreso.barracarga.activo = estado
    state.progreso.barracarga.valor = progreso
  },

  // Mutation - New game
  cambiaridnuevo: (state,idtemporal) => state.nuevojuego.idtemporal = idtemporal,
  cambiarnombrenuevo: (state,nombre) => state.nuevojuego.nombre = nombre,
  cambiarimagennuevo: (state,imagen) => state.nuevojuego.imagen = imagen,
  cambiardescnuevo: (state,desc) => state.nuevojuego.desc = desc,
  cambiaredadnuevo: (state,edadminima) => state.nuevojuego.edadminima = edadminima,
  cambiarmin: (state,min) => Vue.set(state.nuevojuego.jugadores,0,min),
  cambiarmax: (state,max) => Vue.set(state.nuevojuego.jugadores,1,max),
  cambiarjug: (state,jugadores) => state.nuevojuego.jugadores = jugadores,
  cambiarano: (state,ano) => state.nuevojuego.ano = ano,
  cambiarduracion: (state,duracion) => state.nuevojuego.duracion = duracion,
  cambiarazar: (state,azar) => state.nuevojuego.azar = azar,
  cambiarpierde: (state,pierdeamigos) => state.nuevojuego.pierdeamigos = pierdeamigos,
  datosporid: (state,[nombre,id,imagen,desc,edadminima,jug,ano,duracion]) => {
    state.nuevojuego.id = id
    state.nuevojuego.nombre = nombre
    state.nuevojuego.imagen = imagen
    state.nuevojuego.desc = desc
    state.nuevojuego.edadminima = edadminima
    state.nuevojuego.jugadores = jug
    state.nuevojuego.ano = ano
    state.nuevojuego.duracion = duracion
  },
  limpiarcreacionform: (state) => {state.nuevojuego = {idtemporal:'', id:'', nombre:'', imagen: '', azar: '', pierdeamigos: '', desc:'', edadminima:18, jugadores:[0,100], ano:'1900', duracion:[0,360], azar:1, pierdeamigos:1}}
}

const actions = {
  entrar({commit},{mail,pass}){
    firebase.auth().signInWithEmailAndPassword(mail,pass)
    .then((user) => {
      var usuario = user.user
      commit('conectado',true)
      commit('cambiarusuario',usuario)
      router.push('/juegos')
      commit('notificacion', [true,'light-green darken-1',3000,'Usuario conectado correctamente'] )
    },(error) => {
      switch (error.code) {
        case 'auth/user-not-found':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Usuario no encontrado'] )
          break
        case 'auth/invalid-email':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Formato de correo no válido'] )
          break
        case 'auth/wrong-password':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Contraseña incorrecta'] )
          break
        default:
          commit('notificacion', [true,'deep-orange darken-3',3000,'Error, pruebe de nuevo'] )
          break
      }
    })
  },
  registrar({commit,dispatch},{mail,pass}){
    firebase.auth().createUserWithEmailAndPassword(mail,pass).then(()=>{
      dispatch('salir')
      router.push('/juegos')
      commit('notificacion', [true,'light-green darken-1',3000,'Usuario creado correctamente: ' + mail] )
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          commit('notificacion', [true,'deep-orange darken-3',4000,'Correo en uso, usa otro'] )
          break
        case 'auth/invalid-email':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Correo no válido'] )
          break
        case 'auth/weak-password':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Contraseña muy débil'] )
          break
        case 'auth/operation-not-allowed':
          commit('notificacion', [true,'deep-orange darken-3',3000,'Creación no permitida'] )
          break
        default:
          commit('notificacion', [true,'deep-orange darken-3',3000,'Error, pruebe de nuevo'] )
          break
      }
    })
  },
  revisarusuario(){
    var user = firebase.auth().currentUser
    var usuario = {}
    if(user) {
      usuario.name = user.displayName;
      usuario.email = user.email;
      usuario.photoUrl = user.photoURL;
      usuario.emailVerified = user.emailVerified;
      usuario.uid = user.uid;
    }
    console.log(usuario)
  },
  salir({commit}) {
    var usuariovacio ={
      email:null,
      activo:false,
      verificado:false,
      nombre:'',
      foto:'',
      uid:''
    }
    firebase.auth().signOut().then(()=>{
      commit('conectado',false)
      commit('cambiarusuario',usuariovacio)
      router.push('/')
      commit('notificacion', [true,'light-green darken-1',3000,'Usuario desconectado correctamente'] )
    },(error) => {
      commit('notificacion', [true,'deep-orange darken-3',3000,'Error al desconectar'] )
    })
  },
  testeoidbgg({state,commit,dispatch},id) {
    const thingbgg = 'https://boardgamegeek.com/xmlapi2/thing?id=' + id
    state.nuevojuego.id = state.nuevojuego.idtemporal
    commit('barracarga',[true,10])
    axios.get(thingbgg).then((respuesta) => {
      xml2js.parseString(respuesta.data,{ mergeAttrs: true, explicitArray:false },function(error,datosbusqueda){
        if(!error){
          if(!datosbusqueda.items.item){
            commit('notificacion', [true,'deep-orange darken-3',3000,'Item no encontrado'] )
            dispatch('limpiarcreacion')
            commit('barracarga',[true,100])
            setTimeout(() => {  
              commit('barracarga',[false,0])
            }, 800)
          }
          else{
            var nombre = ''
            var imagen = 'https://via.placeholder.com/500x500?text=Sin+imagen'
            var desc = ''
            var edadminima = 0
            var ano = 1900
            var jug = [0,100]
            var duracion = [0,9999]
            if(datosbusqueda.items.item.minage.value){edadminima = datosbusqueda.items.item.minage.value}
            if(datosbusqueda.items.item.minplayers.value){jug[0] = datosbusqueda.items.item.minplayers.value}
            if(datosbusqueda.items.item.maxplayers.value){jug[1] = datosbusqueda.items.item.maxplayers.value}
            if(datosbusqueda.items.item.minplaytime.value){duracion[0] = datosbusqueda.items.item.minplaytime.value}
            if(datosbusqueda.items.item.maxplaytime.value){duracion[1] = datosbusqueda.items.item.maxplaytime.value}
            if(datosbusqueda.items.item.image){imagen = datosbusqueda.items.item.image}
            if(datosbusqueda.items.item.yearpublished.value){ano = datosbusqueda.items.item.yearpublished.value}
            if(datosbusqueda.items.item.description){desc = datosbusqueda.items.item.description}
            if(Array.isArray(datosbusqueda.items.item.name)){nombre = datosbusqueda.items.item.name.find((item) => item.type === 'primary').value}
            else{nombre = datosbusqueda.items.item.name.value}
            commit('datosporid',[nombre,id,imagen,desc,edadminima,jug,ano,duracion])
            commit('notificacion', [true,'light-green darken-1',3000,'Nombre del juego: ' + nombre] )
            commit('barracarga',[true,100])
            setTimeout(() => {  
              commit('barracarga',[false,0])
            }, 800)
          }
        }else{
          commit('notificacion', [true,'deep-orange darken-3',3000,'Error al cargar'] )
          commit('barracarga',[true,100])
          setTimeout(() => {  
            commit('barracarga',[false,0])
          }, 800)
        }
      })
    })
  },
  limpiarcreacion({commit}) {
    commit('limpiarcreacionform')
  },
  verificarmail({commit,dispatch}){
    commit('barracarga',[true,10])
    firebase.auth().currentUser.sendEmailVerification().then(function(){
      commit('notificacion',[true,'light-green darken-1',3000,'Correo de Verificación enviado'])
      commit('barracarga',[true,100])
      setTimeout(() => {  
        commit('barracarga',[false,0])
      }, 800)
      router.push('/')
      dispatch('salir')
    }).catch(error=>{
      commit('notificacion', [true,'deep-orange darken-3',3000,'Error al enviar el correo'] )
      commit('barracarga',[true,100])
      setTimeout(() => {  
        commit('barracarga',[false,0])
      }, 800)
    })
  },
  guardarjuego({state,commit,dispatch}) {
    const thingbggcarga = 'https://boardgamegeek.com/xmlapi2/thing?id=' + state.nuevojuego.id
    axios.get(thingbggcarga).then(respuesta => {
      xml2js.parseString(respuesta.data,{ mergeAttrs: true, explicitArray:false },function(error,datosprueba) {
        if(error){commit('notificacion',[true,'deep-orange darken-3',3000,'Algo ha ocurrido: '+ error])}
        else{
          if(!datosprueba.items.item) {
            commit('notificacion',[true,'deep-orange darken-3',5000,'Esa ID no existe en BGG'])
          }
          else{
            const db = firebase.firestore()
            db.collection('juegos').doc(state.nuevojuego.id).set({
              idbgg:state.nuevojuego.id,
              nombre:state.nuevojuego.nombre,
              imagen:state.nuevojuego.imagen,
              azar:state.nuevojuego.azar,
              pierdeamigos:state.nuevojuego.pierdeamigos,
              desc:state.nuevojuego.desc,
              edadminima:state.nuevojuego.edadminima,
              jugadores:state.nuevojuego.jugadores,
              ano:state.nuevojuego.ano,
              duracion:state.nuevojuego.duracion,
              azar:state.nuevojuego.azar,
              uidusuario:firebase.auth().currentUser.uid
            }).then(function(){
              commit('notificacion',[true,'light-green darken-1',3000,'Juego añadido'])
              router.push('/juegos')
              dispatch('limpiarcreacion')
            })
          }
        }
      })
    }).catch(function(error){
      commit('notificacion',[true,'deep-orange darken-3',5000,'Error al cargar: '+ error])
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
  },
  verificado(state){
    return state.usuario.verificado === true
  },
  entendido(state){
    if(state.nuevojuego.idtemporal === '' && state.nuevojuego.id === ''){return true}
    else {return false}
  },
  entendidoguardar(state){
    if( state.nuevojuego.id === '' || state.nuevojuego.nombre === ''){return true}
    else {return false}
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
