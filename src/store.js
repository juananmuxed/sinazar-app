import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menu:{
      active:false,
      dark:false,
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
        {name:'Sobre...',link:'/sobre',active:true,logo:'info'}
      ]
    }
  },
  mutations: {
    // Mutations -- toolbar
    changelight: (state,value) => state.menu.dark = value,
    changecolor: (state,color) => state.menu.color = color,
  },
  actions: {

  },
  getters: {
    selectcolor(state){
      if(state.menu.dark){return ' darken-5'}
      else{return ' lighten-5'}
    },
    selectcolorinvert(state){
        if(!state.menu.dark){return ' darken-2'}
        else{return ' lighten-4'}
    }
  }
})
