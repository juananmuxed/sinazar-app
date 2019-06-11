<template>
    <v-container fluid>
        <v-layout row wrap align-center justify-end>
            <v-flex xs12>
                <v-expansion-panel class="elevation-0">
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
                                    <v-flex xs12 pa-1><v-text-field @keyup.escape="busqueda.nombre = ''" v-model="filtronombre" box label="Nombre" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
                                    <v-flex xs12 md6 pa-1><v-slider v-model="filtroazar" prepend-icon="fas fa-dice-six" append-icon="fas fa-dice-one" step="1" ticks min="1" max="20" thumb-label :color="menu.color + selectcolorinvert()"></v-slider></v-flex>
                                    <v-flex xs12 md6 pa-1><v-slider v-model="filtropierde" prepend-icon="fas fa-user" append-icon="far fa-user" step="1" ticks min="1" max="20" thumb-label :color="menu.color + selectcolorinvert()"></v-slider></v-flex>
                                    <v-flex xs12 pa-1><v-btn block flat :class="menu.color" @click="busqueda.nombre = '' ; filtrarxpierdeamigos(1) ; filtrarxazar(1) ">Limpiar filtros</v-btn></v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
            <v-divider></v-divider>
            <v-flex xs12 md10 pa-2 class="text-xs-center">
                <v-pagination v-model="menu.paginacion.page" :length="Math.ceil(juegos.length/menu.paginacion.rowsPerPage)" :color="menu.color + selectcolor()" prev-icon="fas fa-caret-left" next-icon="fas fa-caret-right"></v-pagination>
            </v-flex>
            <v-flex xs6 md1 pa-2>
                <v-select label="Por página" :color="menu.color + selectcolor()" v-model="paginas" :items="[4, 8, 16]"></v-select>
            </v-flex>
            <v-flex xs6 md1 pa-2 class="text-xs-left caption">Total: {{ juegos.length }}</v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 pa-2><v-btn block flat to="/crearjuego" large v-if="autentificado()">Añadir juego<v-icon right :color="menu.color + selectcolor()">fas fa-plus</v-icon></v-btn></v-flex>
        </v-layout>
        <v-layout>
            <v-slide-y-transition>
                <v-flex v-if="busqueda.nombre || busqueda.azar > 1 || busqueda.pierdeamigos > 1">
                    <span class="font-weight-light"><v-icon>fas fa-filter</v-icon></span>
                    <v-chip class="pa-1" close v-if="busqueda.nombre" @input="busqueda.nombre = ''">Nombre: {{ busqueda.nombre }}</v-chip>
                    <v-chip class="pa-1" close v-if="busqueda.azar > 1" @input="filtrarxazar(1)">Azar: +{{ busqueda.azar }}</v-chip>
                    <v-chip class="pa-1" close v-if="busqueda.pierdeamigos > 1" @input="filtrarxpierdeamigos(1)">Pierdeamiguismo: +{{ busqueda.pierdeamigos }}</v-chip>
                </v-flex>
            </v-slide-y-transition>
        </v-layout>
        <v-fade-transition>
            <v-data-iterator :search="busqueda.nombre" hide-actions :pagination.sync="menu.paginacion" :items="juegosfiltrados" content-tag="v-layout" row wrap no-data-text="Sin juegos que mostrar..." :rows-per-page-items="[4, 8, 16,{'text':'∞','value':-1}]" no-results-text="No se encuentran juegos con ese filtro...">
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
                                    <v-flex xs3 md2><v-avatar size="40" :color="juego.item.colorazar"><span class="white--text caption">{{ juego.item.azar }}/10</span></v-avatar></v-flex>
                                    <v-flex xs9 md10>
                                        <v-rating v-if="juego.item.azar > 10" dense :value="10" size="18" length="10" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating>
                                        <v-rating v-if="juego.item.azar > 10" dense :value="juego.item.azar - 10" size="21" length="10" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-4'" :color="menu.color + ' darken-4'"></v-rating>
                                        <v-rating v-else v-model="juego.item.azar" dense size="18" length="10" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating>
                                    </v-flex>
                                </v-layout>
                                <v-layout pa-1 align-center>
                                    <v-flex xs3 md2><v-avatar size="40" :color="juego.item.colorpierde"><span class="white--text caption">{{ juego.item.pierdeamigos }}/10</span></v-avatar></v-flex>
                                    <v-flex xs9 md10>
                                        <v-rating v-if="juego.item.pierdeamigos > 10" dense :value="10" size="18" length="10" empty-icon="far fa-user" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating>
                                        <v-rating v-if="juego.item.pierdeamigos > 10" dense :value="juego.item.pierdeamigos - 10" size="21" length="10" empty-icon="far fa-user" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-4'" :color="menu.color + ' darken-4'"></v-rating>
                                        <v-rating v-else v-model="juego.item.pierdeamigos" dense size="18" length="10" empty-icon="far fa-user" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn :color="menu.color + selectcolor()" :href="'https://boardgamegeek.com/boardgame/' + juego.item.id" target="_blank">Enlace a BGG</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn v-if="autentificado()" icon :to="{ name: 'editarjuego' , params :{id : juego.item.id}}"><v-icon :color="menu.color + selectcolorinvert()">fas fa-marker</v-icon></v-btn>
                                <v-btn icon :to="{ name: 'juego' , params :{id : juego.item.id}}"><v-icon :color="menu.color + selectcolorinvert()" >fas fa-info</v-icon></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </template>
            </v-data-iterator>
        </v-fade-transition>
        <v-layout row wrap>
            <v-flex xs12 pa-2 class="text-xs-center">
                <v-pagination v-model="menu.paginacion.page" :length="Math.ceil(juegos.length/menu.paginacion.rowsPerPage)" :color="menu.color + selectcolor()" prev-icon="fas fa-caret-left" next-icon="fas fa-caret-right"></v-pagination>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
const fb = require('../configFB.js')
const db = fb.db
export default {
    computed:{
        ...mapState(['menu','usuario','juegos','progreso','busqueda','juegosfiltrados']),
        paginas:{
            get() {return this.$store.state.menu.paginacion.rowsPerPage},
            set(value) {this.$store.commit('paginascambiar',value)}
        },
        filtronombre:{
            get() {return this.$store.state.busqueda.nombre},
            set(value) {this.$store.commit('filtrarxnombre',value)}
        },
        filtroazar:{
            get() {return this.$store.state.busqueda.azar},
            set(value) {this.$store.commit('filtrarxazar',value)}
        },
        filtropierde:{
            get() {return this.$store.state.busqueda.pierdeamigos},
            set(value) {this.$store.commit('filtrarxpierdeamigos',value)}
        }
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert','autentificado']),
        ...mapMutations(['filtrarxpierdeamigos','filtrarxazar'])
    },
    created() {
        this.$store.dispatch('cargarjuegos')
    }
}
</script>