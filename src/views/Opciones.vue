<template>
    <v-container fluid>
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
    </v-container>
</template>

<script>
import { mapState , mapGetters } from "vuex";
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
        }
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert']),
    }
}
</script>