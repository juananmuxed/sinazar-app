<template>
    <v-footer app :color="menu.color + selectcolor()" class="pa-3">
        <span>MuXeD</span>
        <v-spacer></v-spacer>
        <span class="font-weight-thin subheading">Administración</span>
        <v-btn icon to="/entrar" active-class="nolink" :ripple="{ class: menu.color + '--text' }" v-if="!autentificado()"><v-icon :color="menu.color + selectcolorinvert()">fas fa-sign-in-alt</v-icon></v-btn>
        <template v-else>
            <v-btn icon to="/registrar" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-user-plus</v-icon></v-btn>
            <v-btn icon @click="salir" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-sign-out-alt</v-icon></v-btn>
        </template>
    </v-footer>
</template>

<script>
import { mapState , mapGetters, mapActions } from "vuex";
export default {
    computed:{
        ...mapState(['menu'])
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert','autentificado']),
        ...mapActions(['salir'])
    }
}
</script>

<style scoped>
.nolink{
    background-color: transparent
}
</style>
