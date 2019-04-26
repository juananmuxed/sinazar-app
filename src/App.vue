<template>
  <v-app :dark="menu.dark">
    <mux-navegador></mux-navegador>
    <v-content>
      <v-fade-transition mode="out-in"><router-view/></v-fade-transition>
    </v-content>
    <mux-pie></mux-pie>
  </v-app>
</template>

<script>
import navegador from './components/Naveg.vue'
import pie from './components/Pie.vue'
import { mapState } from 'vuex';
export default {
  name: 'App',
  components: {
    'mux-navegador': navegador,
    'mux-pie': pie
  },
  computed:{
    ...mapState(['menu'])
  },
  data () {
    return {
      //
    }
  }
}
</script>
