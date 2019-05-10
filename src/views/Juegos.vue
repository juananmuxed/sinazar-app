<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 md6 lg3 v-for="juego in juegos" pa-2>
                <v-card>
                    <v-img :src="juego.imagen" height="140" position="top center"></v-img>
                    <v-card-title>
                        <v-avatar></v-avatar>
                        <span class="title font-weight-light">{{ juego.nombre}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-avatar><span class="caption font-weight-light">{{ juego.azar }}/20</span></v-list-tile-avatar>
                                <v-list-tile-content><v-rating dense v-model="juego.azar" small length="20" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-3'" :color="menu.color + ' darken-4'"></v-rating></v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-avatar><span class="caption font-weight-light">{{ juego.pierdeamigos }}/10</span></v-list-tile-avatar>
                                <v-list-tile-content><v-rating dense v-model="juego.pierdeamigos" small length="10" empty-icon="fas fa-users" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-3'" :color="menu.color + ' darken-4'"></v-rating></v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-avatar><span class="caption font-weight-light">{{ juego.nota }}/10</span></v-list-tile-avatar>
                                <v-list-tile-content><v-rating dense v-model="juego.nota" small length="10" empty-icon="far fa-star" full-icon="fas fa-star" :readonly="true" :background-color="menu.color + ' lighten-3'" :color="menu.color + ' darken-4'"></v-rating></v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :color="menu.color + selectcolor()" :href="'https://boardgamegeek.com/boardgame/' + juego.id" target="_blank">Enlace a BGG</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn disabled v-if="autentificado()" icon><v-icon>fas fa-marker</v-icon></v-btn>
                        <v-btn disabled icon><v-icon>fas fa-info</v-icon></v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs12 md6 lg3 pa-2><v-card to="/crearjuego" hover height="100%" v-if="autentificado()"><v-container fill-height grid-list-md text-xs-center><v-layout row wrap align-center><v-flex xs12 class="text-xs-center"><v-icon size="160" :color="menu.color + selectcolor()">fas fa-plus</v-icon></v-flex></v-layout></v-container></v-card></v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
const fb = require('../configFB.js')
const db = fb.db
export default {
    data() {
        return {
            juegos:[]
        }
    },
    computed:{
        ...mapState(['menu','usuario'])
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert','autentificado'])
    },
    created() {
        db.collection('juegos').get().then((snapshot) => {
            this.juegos = []
            snapshot.forEach(juego => {
                this.juegos.push({
                    key: juego.id,
                    id: juego.data().idbgg,
                    nombre: juego.data().nombre,
                    azar: juego.data().azar,
                    imagen: juego.data().imagen,
                    nota: juego.data().nota,
                    pierdeamigos: juego.data().pierdeamigos
                })
            })
        })     
    }
}
</script>