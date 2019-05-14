<template>
    <v-footer app :color="menu.color + selectcolor()" class="pa-3">
        <span class="mr-1 hidden-sm-and-down">MuXeD</span><v-icon class="mr-5 hidden-sm-and-down">far fa-copyright</v-icon>
        <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon target="_blank" href="https://github.com/juananmuxed/sinazar-app" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fab fa-github</v-icon></v-btn>
            </template>
            <span>GitHub</span>
        </v-tooltip>
        <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon target="_blank" href="https://github.com/juananmuxed/sinazar-app/wiki/Inicio" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fab fa-wikipedia-w</v-icon></v-btn>
            </template>
            <span>WikiGit</span>
        </v-tooltip>
        <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
            <template v-slot:activator="{ on }">
                <v-btn dense v-on="on" icon target="_blank" href="http://muxed.es/" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-globe</v-icon></v-btn>
            </template>
            <span>MuXeD</span>
        </v-tooltip>
        <v-spacer class="mr-3"></v-spacer>
        <v-chip class="mr-3 hidden-sm-and-down" label>Beta</v-chip>
        <v-chip class="mr-3 hidden-sm-and-down" label>Versión v0.1</v-chip>
        <template v-if="!autentificado()">
            <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
                <template v-slot:activator="{ on }">
                    <v-btn flat v-on="on" to="/entrar" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-sign-in-alt</v-icon></v-btn>
                </template>
                <span>Entrar</span>
            </v-tooltip>
        </template>
        <template v-else>
            <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" to="/crearjuego" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-plus-square</v-icon></v-btn>
                </template>
                <span>Añadir juego</span>
            </v-tooltip>
            <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" to="/registrar" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-user-plus</v-icon></v-btn>
                </template>
                <span>Registrar Admin</span>
            </v-tooltip>
            <v-tooltip top :color="menu.color + ' ' + menu.color + '--text' + ' text--lighten-4'">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="salir" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-sign-out-alt</v-icon></v-btn>
                </template>
                <span>Desconectar</span>
            </v-tooltip>
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
