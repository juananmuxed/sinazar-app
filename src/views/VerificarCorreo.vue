<template>
  <v-container fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>
        <v-flex xs12 class="text-uppercase">
            <p class="font-weight-black display-1">Verifica tu Correo para continuar</p>
            <v-btn @click="verificarmail" :color="menu.color + selectcolor()">Verifica: {{ usuario.email }}</v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    computed:{
        ...mapState(['usuario','menu'])
    },
    methods:{
        ...mapGetters(['selectcolor']),
        ...mapActions(['verificarmail'])
    }
}
</script>
