<template>
    <v-container fluid>
        <v-layout row wrap align-center justify-end>
            <v-flex xs2 pa-2 class="text-xs-left">Página {{ menu.paginacion.page }} - {{ Math.ceil(juegos.length/menu.paginacion.rowsPerPage) }}</v-flex>
            <v-flex xs1 pa-2>
                <v-select label="Por página" :color="menu.color + selectcolor()" v-model="paginas" :items="[4, 8, 16,{'text':'∞','value':-1}]"></v-select>
            </v-flex>
            <v-flex xs2 pa-2 class="text-xs-left">Total juegos: {{ juegos.length }}</v-flex>
            <v-spacer></v-spacer>
            <v-flex pa-2 class="text-xs-right">
                <v-pagination v-model="menu.paginacion.page" :length="Math.ceil(juegos.length/menu.paginacion.rowsPerPage)" :color="menu.color + selectcolor()" prev-icon="fas fa-caret-left" next-icon="fas fa-caret-right"></v-pagination>
            </v-flex>
            <v-flex xs12>
                <v-expansion-panel>
                    <v-expansion-panel-content>
                        <template v-slot:actions>
                            <v-icon :color="menu.color + selectcolor()">fas fa-dice-six</v-icon>
                        </template>
                        <template v-slot:header>
                            <span class="title font-weight-light text-uppercase">Búsqueda de juegos</span>
                        </template>
                        <v-card>
                            <v-card-text :class="menu.color + selectcolor()">
                                <v-layout row wrap>
                                    <v-flex xs12 pa-1><v-text-field box label="Nombre" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
                                    <v-flex xs12 md6 pa-1><v-slider prepend-icon="fas fa-dice-six" append-icon="fas fa-dice-one" step="1" ticks min="1" max="20" thumb-label :color="menu.color + selectcolorinvert()"></v-slider></v-flex>
                                    <v-flex xs12 md6 pa-1><v-slider prepend-icon="fas fa-user" append-icon="far fa-user" step="1" ticks min="1" max="20" thumb-label :color="menu.color + selectcolorinvert()"></v-slider></v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout>
            <v-flex xs12 pa-2><v-btn block flat to="/crearjuego" large v-if="autentificado()">Añadir juego<v-icon right :color="menu.color + selectcolor()">fas fa-plus</v-icon></v-btn></v-flex>
        </v-layout>
        <v-fade-transition>
            <v-data-iterator hide-actions :pagination.sync="menu.paginacion" :items="juegos" content-tag="v-layout" row wrap :rows-per-page-items="[4, 8, 16,{'text':'∞','value':-1}]" rows-per-page-text="Juegos por página" prev-icon="fas fa-caret-left" next-icon="fas fa-caret-right" no-data-text="Sin juegos que mostrar..." no-results-text="No se encuentran juegos con ese filtro...">
                <template v-slot:item="juego" v-if="!progreso.barracarga.activo">
                    <v-flex xs12 md6 lg3 pa-2>
                        <v-card>
                            <v-layout>
                                <v-flex xs4 pa-2><v-img lazy-src contain :src="juego.item.imagen" height="120" position="top left"></v-img></v-flex>
                                <v-flex xs8>
                                    <v-card-title>
                                        <div>
                                            <div class="title font-weight-light pa-1">{{ juego.item.nombre}}</div>
                                            <div class="pa-1 font-weight-bold subheading">({{ juego.item.ano }})</div>
                                        </div>
                                    </v-card-title>
                                </v-flex>
                            </v-layout>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-layout pa-1 align-center>
                                    <v-flex xs2><v-avatar size="40" :color="juego.item.colorazar"><span class="title white--text">{{ juego.item.azar }}</span></v-avatar></v-flex>
                                    <v-flex xs10><v-rating dense v-model="juego.item.azar" size="14" length="20" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating></v-flex>
                                </v-layout>
                                <v-layout pa-1 align-center>
                                    <v-flex xs2><v-avatar size="40" :color="juego.item.colorpierde"><span class="title white--text">{{ juego.item.pierdeamigos }}</span></v-avatar></v-flex>
                                    <v-flex xs10><v-rating dense v-model="juego.item.pierdeamigos" size="14" length="20" empty-icon="far fa-user" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating></v-flex>
                                </v-layout>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn :color="menu.color + selectcolor()" :href="'https://boardgamegeek.com/boardgame/' + juego.item.id" target="_blank">Enlace a BGG</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn disabled v-if="autentificado()" icon><v-icon>fas fa-marker</v-icon></v-btn>
                                <v-btn disabled icon><v-icon>fas fa-info</v-icon></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </template>
            </v-data-iterator>
        </v-fade-transition>
        <v-layout row wrap>
            <v-flex xs12 pa-2 class="text-xs-right">
                <v-pagination v-model="menu.paginacion.page" :length="Math.ceil(juegos.length/menu.paginacion.rowsPerPage)" :color="menu.color + selectcolor()" prev-icon="fas fa-caret-left" next-icon="fas fa-caret-right"></v-pagination>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
const fb = require('../configFB.js')
const db = fb.db
export default {
    computed:{
        ...mapState(['menu','usuario','juegos','progreso']),
        paginas:{
            get() {return this.$store.state.menu.paginacion.rowsPerPage},
            set(value) {this.$store.commit('paginascambiar',value)}
        }
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert','autentificado'])
    },
    created() {
        this.$store.dispatch('cargarjuegos')
    }
}
</script>