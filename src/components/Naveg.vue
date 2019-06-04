<template>
    <v-toolbar absolute app class="elevation-0" :color="menu.color + selectcolor()">
        <v-btn icon @click="menu.drawer = !menu.drawer"><v-icon :color="menu.color + selectcolorinvert()">fas fa-bars</v-icon></v-btn>
        <v-toolbar-title class="text-uppercase font-weight-light display-1">Sin <span class="font-weight-black">Azar</span><v-icon class="pl-3" large :color="menu.color + selectcolorinvert()">fas fa-dice</v-icon></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn  class="hidden-sm-and-down" icon v-for="link in menu.links" :to="link.link" :disabled="!link.active" active-class="nolink" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">{{ 'fas fa-' + link.logo }}</v-icon></v-btn>
            <v-menu :close-on-content-click="false" offset-y transition="slide-y-transition">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" :ripple="{ class: menu.color + '--text' }"><v-icon :color="menu.color + selectcolorinvert()">fas fa-wrench</v-icon></v-btn>
                </template>
                <v-card>
                    <v-card-title class="title text-uppercase">Opciones</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12><v-switch :color="menu.color" label="Apaga las luces" v-model="switchlight"></v-switch></v-flex>
                            <v-flex xs12><v-select box :items="menu.colorlist" label="Selecciona un color..." append-icon="fa-palette" :color="menu.color + selectcolorinvert()" :background-color="menu.color + selectcolor()" v-model="schemecolor"></v-select></v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
    computed:{
        ...mapState(['menu']),
        switchlight:{
            get() {return this.$store.state.menu.dark}, 
            set(value) {this.$store.commit('changelight',value)}
        },
        schemecolor:{
            get() {return this.$store.state.menu.color},
            set(value) {this.$store.commit('changecolor',value)}
        },
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert','autentificado'])
    }
}
</script>

<style scoped>
.nolink{
    background-color: transparent
}
</style>
