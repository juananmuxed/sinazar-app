<template>
  <v-app :dark="menu.dark">
    <mux-menulateral></mux-menulateral>
    <mux-navegador></mux-navegador>
    <v-content>
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
import { mapState } from 'vuex';
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
  data () {
    return {
      //
    }
  }
}
</script>
