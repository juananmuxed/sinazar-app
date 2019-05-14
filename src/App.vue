<template>
  <v-app :dark="menu.dark">
    <mux-menulateral></mux-menulateral>
    <mux-navegador></mux-navegador>
    <v-content>
      <v-slide-y-transition><v-progress-linear class="ma-0" v-if="progreso.barracarga.activo" :value="progreso.barracarga.valor" height="12" :color="menu.color + selectcolorinvert()"></v-progress-linear></v-slide-y-transition>
      <v-fade-transition mode="out-in"><router-view/></v-fade-transition>
    </v-content>
    <v-snackbar v-model="progreso.snackbar.activo" :timeout="progreso.snackbar.tiempo" bottom multi-line :color="progreso.snackbar.color">{{ progreso.snackbar.texto }}</v-snackbar>
    <mux-pie></mux-pie>
  </v-app>
</template>

<script>
import navegador from './components/Naveg.vue'
import pie from './components/Pie.vue'
import menulateral from './components/MenuLateral.vue'
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'App',
  components: {
    'mux-menulateral' : menulateral,
    'mux-navegador': navegador,
    'mux-pie': pie
  },
  computed:{
    ...mapState(['menu','progreso'])
  },
  methods: {
    ...mapGetters(['selectcolorinvert'])
  },
  data () {
    return {
      //
    }
  }
}
</script>
