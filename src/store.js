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
  juegos:[],
  juegosfiltrados:[],
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
    },
    cargando:false
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
    modalimagen:false,
    modalnombre:false,
    modalpass:false,
    modaleliminarusuario:false,
    drawer:false,
    juegoscargados:[],
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
    ],
    paginacion:{
      descending:false,
      page:1,
      rowsPerPage: 4,
      totalItems:null
    }
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
  },
  busqueda:{
    nombre:'',
    pierdeamigos:1,
    azar:1,
    paraguardar:false,
    juegocargado:{"ano":"","azar":1,"desc":"","duracion":[0,0],"edadminima":0,"idbgg":"","imagen":"","jugadores":[0,0],"nombre":"","pierdeamigos":1,"uidusuario":""},
    juegocargadoraw:{"ano":"","azar":1,"desc":"","duracion":[0,0],"edadminima":0,"idbgg":"","imagen":"","jugadores":[0,0],"nombre":"","pierdeamigos":1,"uidusuario":""},
    modalguardar:false,
  }
}

const mutations = {
  // Mutations -- pagination
  paginascambiar: (state,value) => state.menu.paginacion.rowsPerPage = value,

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

  // Mutations - filters

  filtrarxnombre:(state,nombre) => state.busqueda.nombre = nombre,
  filtrarxazar:(state,azar) => {
    state.busqueda.azar = azar
    state.juegosfiltrados = state.juegos.filter(juego => { 
      if(juego.pierdeamigos >= state.busqueda.pierdeamigos) {
        return juego.azar >= state.busqueda.azar
      }else{return false}
    })
  },
  filtrarxpierdeamigos:(state,pierdeamigos) => {
    state.busqueda.pierdeamigos = pierdeamigos
    state.juegosfiltrados = state.juegos.filter(juego => { 
      if(juego.azar >= state.busqueda.azar) {
        return juego.pierdeamigos >= state.busqueda.pierdeamigos
      }else{return false}
    })
  },

  // Mutation - Cambios
  actualizarnombre: (state,nombre) => state.busqueda.juegocargado.nombre = nombre,
  actualizarano: (state,ano) => state.busqueda.juegocargado.ano = Number(ano),
  actualizarimagen: (state,imagen) => state.busqueda.juegocargado.imagen = imagen,
  actualizardesc: (state,desc) => state.busqueda.juegocargado.desc = desc,
  actualizarazar: (state,azar) => state.busqueda.juegocargado.azar = Number(azar),
  actualizarpierde: (state,pierde) => state.busqueda.juegocargado.pierdeamigos = Number(pierde),
  actualizarjug: (state,[jug,indice]) => Vue.set(state.busqueda.juegocargado.jugadores,indice,Number(jug)),
  actualizardur: (state,[dur,indice]) => Vue.set(state.busqueda.juegocargado.duracion,indice,Number(dur)),
  actualizaredad: (state,edad) => state.busqueda.juegocargado.edadminima = Number(edad),
  revertirtodo (state) {
    Vue.set(state.busqueda.juegocargado,'nombre',state.busqueda.juegocargadoraw.nombre)
    Vue.set(state.busqueda.juegocargado,'desc',state.busqueda.juegocargadoraw.desc)
    Vue.set(state.busqueda.juegocargado,'imagen',state.busqueda.juegocargadoraw.imagen)
    Vue.set(state.busqueda.juegocargado,'ano',state.busqueda.juegocargadoraw.ano)
    Vue.set(state.busqueda.juegocargado,'azar',state.busqueda.juegocargadoraw.azar)
    Vue.set(state.busqueda.juegocargado,'pierdeamigos',state.busqueda.juegocargadoraw.pierdeamigos)
    Vue.set(state.busqueda.juegocargado,'edadminima',state.busqueda.juegocargadoraw.edadminima)
    Vue.set(state.busqueda.juegocargado.jugadores,0,state.busqueda.juegocargadoraw.jugadores[0])
    Vue.set(state.busqueda.juegocargado.jugadores,1,state.busqueda.juegocargadoraw.jugadores[1])
    Vue.set(state.busqueda.juegocargado.duracion,0,state.busqueda.juegocargadoraw.duracion[0])
    Vue.set(state.busqueda.juegocargado.duracion,1,state.busqueda.juegocargadoraw.duracion[1])
    Vue.set(state.busqueda,'paraguardar',false)
  },
  revertirnombre: (state) => Vue.set(state.busqueda.juegocargado,'nombre',state.busqueda.juegocargadoraw.nombre),
  revertirano: (state) => Vue.set(state.busqueda.juegocargado,'ano',state.busqueda.juegocargadoraw.ano),
  revertirimagen: (state) => Vue.set(state.busqueda.juegocargado,'imagen',state.busqueda.juegocargadoraw.imagen),
  revertirdesc: (state) => Vue.set(state.busqueda.juegocargado,'desc',state.busqueda.juegocargadoraw.desc),
  revertirazar: (state) => Vue.set(state.busqueda.juegocargado,'azar',state.busqueda.juegocargadoraw.azar),
  revertirpierde: (state) => Vue.set(state.busqueda.juegocargado,'pierdeamigos',state.busqueda.juegocargadoraw.pierdeamigos),
  revertiredad: (state) => Vue.set(state.busqueda.juegocargado,'edadminima',state.busqueda.juegocargadoraw.edadminima),
  revertirjugadores: (state,indice) => Vue.set(state.busqueda.juegocargado.jugadores,indice,state.busqueda.juegocargadoraw.jugadores[indice]),
  revertirduracion: (state,indice) => Vue.set(state.busqueda.juegocargado.duracion,indice,state.busqueda.juegocargadoraw.duracion[indice]),

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
  cargarjuegos({commit,state}){
    if(state.menu.juegoscargados !== state.juegos.length){
      var progreso = 10
      commit('barracarga',[true, progreso])
      const fb = require('./configFB.js')
      const db = fb.db
      db.collection('juegos').get().then((snapshot) => {
        state.menu.juegoscargados = snapshot.size
        var porcen = Math.round(90/snapshot.size)
        state.juegos = []
        for (let x = 0; x < snapshot.docs.length; x++) {
          progreso = progreso + porcen
          var juego = snapshot.docs[x]
          commit('barracarga',[true,progreso])
          var colorazar
          var colorpierde
          if(juego.data().azar < 6){
              colorazar = 'deep-orange darken-3'
          }
          else if(juego.data().azar < 11 && juego.data().azar > 5) {
              colorazar = 'orange darken-1'
          }
          else if(juego.data().azar < 16 && juego.data().azar > 10) {
              colorazar = 'lime darken-2'
          }
          else {
              colorazar = 'green darken-2'
          }
          if(juego.data().pierdeamigos < 6){
              colorpierde = 'deep-orange darken-3'
          }
          else if(juego.data().pierdeamigos < 11 && juego.data().pierdeamigos > 5) {
              colorpierde = 'orange darken-1'
          }
          else if(juego.data().pierdeamigos < 16 && juego.data().pierdeamigos > 10) {
              colorpierde = 'lime darken-2'
          }
          else {
              colorpierde = 'green darken-2'
          }
          state.juegos.push({
              key: juego.id,
              id: juego.data().idbgg,
              nombre: juego.data().nombre,
              azar: juego.data().azar,
              imagen: juego.data().imagen,
              pierdeamigos: juego.data().pierdeamigos,
              ano:juego.data().ano,
              colorazar: colorazar,
              colorpierde: colorpierde,
              descripcion:juego.data().desc,
              duracion:juego.data().duracion,
              edad:juego.data().edadminima,
              jugadores:juego.data().jugadores
          })
        }
        state.juegosfiltrados = state.juegos
      })
      .catch(error => {
        commit('notificacion', [true,'deep-orange darken-3',3000,'Error: '+ error] )
      })
      commit('barracarga',[true,100])
      setTimeout(() => {
        commit('barracarga',[false,100])
        commit('notificacion', [true, 'light-green darken-1',2000, 'Juegos Cargados'])
      }, 1000) 
    }
  },
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
  revisarusuario({state}){
    var user = firebase.auth().currentUser
    state.progreso.cargando = true
    if(user.uid !== state.usuario.uid) {
      if(user) {
        Vue.set(state.usuario,'nombre',user.displayName)
        Vue.set(state.usuario,'email',user.email)
        Vue.set(state.usuario,'foto',user.photoURL)
        Vue.set(state.usuario,'verificado',user.emailVerified)
        Vue.set(state.usuario,'uid',user.uid)
      }
      else{
        route.push('/home')
      }
    }
    setTimeout(() => {
      state.progreso.cargando = false
    }, 500)
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
    const fb = require('./configFB.js')
    const db = fb.db
    db.collection('juegos').doc(id).get().then(documento => {
      if(documento.exists){
        commit('notificacion', [true,'deep-orange darken-1',4000,'El juego ya existe'] )
        setTimeout(() => {
          router.push('/juegos')
        }, 2000);
      }
      else{
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
      }
    })
    .catch(error => {
      commit('notificacion', [true,'deep-orange darken-3',3000,'Error: '+ error] )
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
            var fecha = new Date()
            var dia = fecha.getDate()
            var mes = fecha.getMonth() + 1
            var ano = fecha.getFullYear()
            var hora = fecha.getHours()
            var mins = fecha.getMinutes()
            var secs = fecha.getSeconds()
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
              uidusuario:firebase.auth().currentUser.email,
              fcreacion:hora + ':' + mins + ':' + secs + ' - ' + dia + '/' + mes + '/' + ano
            }).then(function(){
              commit('notificacion',[true,'light-green darken-1',3000,'Juego añadido'])
              router.push('/juegos')
              dispatch('limpiarcreacion')
              state.menu.juegoscargados += 1
            })
          }
        }
      })
    }).catch(function(error){
      commit('notificacion',[true,'deep-orange darken-3',5000,'Error al cargar: '+ error])
    })
  },

  buscarjuego({state,commit},id){
    const fb = require('./configFB.js')
    const db = fb.db
    state.progreso.cargando = true
    db.collection('juegos').doc(id).get().then(juego => {
      if(juego.exists){
        commit('barracarga',[true,100])
        if(state.busqueda.juegocargado === null || state.busqueda.juegocargado.idbgg !== juego.data().idbgg){
          state.busqueda.juegocargado = juego.data()
          state.busqueda.juegocargadoraw = juego.data()
        }
      }
      else{
        commit('barracarga',[true,100])
        state.busqueda.juegocargado = {"ano":"","azar":1,"desc":"","duracion":[0,0],"edadminima":0,"idbgg":"","imagen":"","jugadores":[0,0],"nombre":"","pierdeamigos":1,"uidusuario":""}
        state.busqueda.juegocargadoraw = {"ano":"","azar":1,"desc":"","duracion":[0,0],"edadminima":0,"idbgg":"","imagen":"","jugadores":[0,0],"nombre":"","pierdeamigos":1,"uidusuario":""}
      }
    })
    setTimeout(() => {  
      commit('barracarga',[false,0])
      state.progreso.cargando = false
    }, 1600)
  },

  arreglarcambios({commit}) {
    commit('revertirtodo')
  },

  cancelarmodal({state}) {
    state.busqueda.modalguardar = false
  },

  salirsinguardar({commit,state}) {
    commit('revertirtodo')
    setTimeout(() => {
      state.busqueda.modalguardar = false
    }, 300)
    setTimeout(() => {
      router.push('/juegos')
    }, 600);
  },

  salirmodal({state}){
    if(state.menu.modalimagen){
      state.menu.modalimagen = false
    }
    if(state.menu.modalnombre){
      state.menu.modalnombre = false
    }
    if(state.menu.modalpass){
      state.menu.modalpass = false
    }
    if(state.menu.modaleliminarusuario){
      state.menu.modaleliminarusuario = false
    }
  },

  guardardatosusuario({state,commit,dispatch},nuevosdatos){
    var usuarioantiguo = firebase.auth().currentUser
    var nombreant, imagenant, nuevafoto, nuevonombre
    if(usuarioantiguo){
      nombreant = usuarioantiguo.displayName
      imagenant = usuarioantiguo.photoURL
    }
    if(nombreant !== nuevosdatos.nombre && nuevosdatos.nombre !== ''){
      nuevonombre = nuevosdatos.nombre
    } else {
      nuevonombre = nombreant
    }
    if(imagenant !== nuevosdatos.imagen && nuevosdatos.imagen !== ''){
      nuevafoto = nuevosdatos.imagen
    } else {
      nuevafoto = imagenant
    }
    if(nuevosdatos.nombre || nuevosdatos.imagen){
      firebase.auth().currentUser.updateProfile({
        displayName: nuevonombre,
        photoURL: nuevafoto
      }).then(()=>{
        commit('notificacion',[true,'light-green darken-1',3000,'Perfil actualizado'])
        state.usuario.nombre = nuevonombre
        state.usuario.foto = nuevafoto
        dispatch('salirmodal')
      }).catch(error=>{
        commit('notificacion',[true,'deep-orange darken-3',5000,'Error al actualizar datos: '+ error])
      })
    } else {
      commit('notificacion',[true,'deep-orange darken-3',5000,'Introduzca nuevos datos'])
    }
  },

  mailreestablecercontraseña({state,commit,dispatch}){
    var user = firebase.auth().currentUser
    var email
    if(user !== null && user.email === state.usuario.email){
      email = user.email
    }
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      commit('notificacion',[true,'light-green darken-1',3000,'Correo enviado'])
      dispatch('salirmodal')
    }).catch(error=>{
      commit('notificacion',[true,'deep-orange darken-3',5000,'Error al enviar correo: '+ error])
    })
  },

  guardarcambios({state,commit,dispatch}) {
    state.busqueda.modalguardar = false
    const db = firebase.firestore()
    var fecha = new Date()
    var dia = fecha.getDate()
    var mes = fecha.getMonth() + 1
    var ano = fecha.getFullYear()
    var hora = fecha.getHours()
    var mins = fecha.getMinutes()
    var secs = fecha.getSeconds()
    db.collection('juegos').doc(state.busqueda.juegocargado.idbgg).set({
      nombre:state.busqueda.juegocargado.nombre,
      imagen:state.busqueda.juegocargado.imagen,
      azar:state.busqueda.juegocargado.azar,
      pierdeamigos:state.busqueda.juegocargado.pierdeamigos,
      desc:state.busqueda.juegocargado.desc,
      edadminima:state.busqueda.juegocargado.edadminima,
      jugadores:state.busqueda.juegocargado.jugadores,
      ano:state.busqueda.juegocargado.ano,
      duracion:state.busqueda.juegocargado.duracion,
      azar:state.busqueda.juegocargado.azar,
      ultimamodif:hora + ':' + mins + ':' + secs + ' - ' + dia + '/' + mes + '/' + ano,
      modificadopor: firebase.auth().currentUser.email
    }, { merge: true }).then(function(){
      commit('notificacion',[true,'light-green darken-1',3000,'Datos guardados'])
      dispatch('buscarjuego',state.busqueda.juegocargado.idbgg)
      setTimeout(() => {
        router.push('/juego/'+ state.busqueda.juegocargado.idbgg)
      }, 500)
      Vue.set(state.busqueda,'paraguardar',false)
      state.menu.juegoscargados = 0
    })
}
}

const getters = {
  selectfondo(state){
    if(state.menu.dark){return '10deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0)'}
    else{return '10deg, rgba(240, 240, 240, 0.7), rgba(240, 240, 240)'}
  },
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
  },
  botonguardar(state){
    if(
      state.busqueda.juegocargado.nombre !== state.busqueda.juegocargadoraw.nombre ||
      state.busqueda.juegocargado.ano !== state.busqueda.juegocargadoraw.ano ||
      state.busqueda.juegocargado.imagen !== state.busqueda.juegocargadoraw.imagen ||
      state.busqueda.juegocargado.desc !== state.busqueda.juegocargadoraw.desc ||
      state.busqueda.juegocargado.azar !== state.busqueda.juegocargadoraw.azar ||
      state.busqueda.juegocargado.pierdeamigos !== state.busqueda.juegocargadoraw.pierdeamigos ||
      state.busqueda.juegocargado.duracion[0] !== state.busqueda.juegocargadoraw.duracion[0] ||
      state.busqueda.juegocargado.duracion[1] !== state.busqueda.juegocargadoraw.duracion[1] ||
      state.busqueda.juegocargado.jugadores[0] !== state.busqueda.juegocargadoraw.jugadores[0] ||
      state.busqueda.juegocargado.jugadores[1] !== state.busqueda.juegocargadoraw.jugadores[1] ||
      state.busqueda.juegocargado.edadminima !== state.busqueda.juegocargadoraw.edadminima
     ) {
        Vue.set(state.busqueda,'paraguardar',true)
     }
     else {
        Vue.set(state.busqueda,'paraguardar',false)
      }
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
      'menu',
      'juegos'
    ],
    getState: (key) => cookie.getJSON(key),
    setState: (key, state) => cookie.set(key, state, {expires: 7})
  })]
})
