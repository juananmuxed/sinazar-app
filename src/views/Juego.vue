<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-slide-y-transition mode="out-in">
                <v-flex xs12 v-if="progreso.cargando" pa-5 text-xs-center>
                    <v-progress-circular indeterminate :color="menu.color" :size="80" :width="9"></v-progress-circular>
                </v-flex>
            </v-slide-y-transition>
            <v-slide-y-reverse-transition mode="out-in">
                <v-flex xs12 v-if="!progreso.cargando">
                    <v-card v-if="!busqueda.juegocargado.idbgg">
                        <v-card-title class="display-1 font-weight-light text-uppercase">Este juego no existe en la base de datos</v-card-title>
                        <v-card-actions><v-btn to="/juegos" :color="menu.color + selectcolor()" block>Volver</v-btn></v-card-actions>
                    </v-card>
                    <v-card v-else>
                        <v-img :src="busqueda.juegocargado.imagen" aspect-ratio="5" position="top center" :gradient="selectfondo()">
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex xs10>
                                        <span class="display-1 font-weight-regular text-uppercase">{{ busqueda.juegocargado.nombre }}</span><span class="pl-3 title font-weight-light text-uppercase">({{ busqueda.juegocargado.ano }})</span>
                                    </v-flex>
                                    <v-flex v-if="autentificado()" xs10>
                                        <span clas="font-weight-bold">Creado por: </span><span>{{ busqueda.juegocargado.uidusuario }}</span><span class="pa-1 text-uppercase caption font-weight-light font-italic">{{ busqueda.juegocargado.ultimamodif }}</span>
                                    </v-flex>
                                </v-layout>
                                <v-btn v-if="autentificado()" fab :color="menu.color" small absolute bottom right depressed :to="{ name: 'editarjuego' , params :{id : busqueda.juegocargado.idbgg}}" class="mb-5"><v-icon>fas fa-edit</v-icon></v-btn>
                            </v-container>
                        </v-img>
                        <v-card-text>
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex xs12 pa-2 class="text-xs-justify"><p v-html="busqueda.juegocargado.desc"></p></v-flex>
                                </v-layout>
                                <v-layout row wrap class="text-xs-left" pt-3 justify-space-between fill-height>
                                    <v-flex xs12 md1 pa-2>
                                        <v-tooltip right :color="menu.color">
                                            <template v-slot:activator="{ on }">
                                                <v-avatar v-on="on" size="40" :color="menu.color"><span class="title white--text">{{ busqueda.juegocargado.azar }}</span></v-avatar>
                                            </template>
                                            <span>Azar: {{ busqueda.juegocargado.azar }}</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs12 md11 pa-2><v-rating v-model="busqueda.juegocargado.azar" length="20" empty-icon="fas fa-dice-one" full-icon="fas fa-dice-six" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating></v-flex>
                                    <v-flex xs12 md1 pa-2>
                                        <v-tooltip right :color="menu.color">
                                            <template v-slot:activator="{ on }">
                                                <v-avatar v-on="on" size="40" :color="menu.color"><span class="title white--text">{{ busqueda.juegocargado.pierdeamigos }}</span></v-avatar>
                                            </template>
                                            <span>Pierdeamigos: {{ busqueda.juegocargado.pierdeamigos }}</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs12 md11 pa-2><v-rating v-model="busqueda.juegocargado.pierdeamigos" length="20" empty-icon="far fa-user" full-icon="fas fa-user" :readonly="true" :background-color="menu.color + ' lighten-2'" :color="menu.color + ' darken-3'"></v-rating></v-flex>
                                    <v-flex xs6 md2 pa-2>
                                        <v-tooltip right :color="menu.color">
                                            <template v-slot:activator="{ on }">
                                                <v-avatar v-on="on" size="40" :color="menu.color"><v-icon color="white">fas fa-users</v-icon></v-avatar>
                                            </template>
                                            <span>Jugadores</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex v-if="busqueda.juegocargado.jugadores[0] === busqueda.juegocargado.jugadores[1]" xs6 md2 pa-2 class="headline">{{ busqueda.juegocargado.jugadores[0] }}</v-flex>
                                    <v-flex v-else xs6 md2 pa-2 class="headline">{{ busqueda.juegocargado.jugadores[0] }} - {{ busqueda.juegocargado.jugadores[1] }}</v-flex>
                                    <v-flex xs6 md2 pa-2>
                                        <v-tooltip right :color="menu.color">
                                            <template v-slot:activator="{ on }">
                                                <v-avatar v-on="on" size="40" :color="menu.color"><v-icon color="white">fas fa-clock</v-icon></v-avatar>
                                            </template>
                                            <span>Duración</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex v-if="busqueda.juegocargado.duracion[0] === busqueda.juegocargado.duracion[1]" xs6 md2 pa-2 class="headline">{{ busqueda.juegocargado.duracion[0] }}</v-flex>
                                    <v-flex v-else xs6 md2 pa-2 class="headline">{{ busqueda.juegocargado.duracion[0] }} - {{ busqueda.juegocargado.duracion[1] }}</v-flex>
                                    <v-flex xs6 md2 pa-2>
                                        <v-tooltip right :color="menu.color">
                                            <template v-slot:activator="{ on }">
                                                <v-avatar v-on="on" size="40" :color="menu.color"><v-icon color="white">fas fa-child</v-icon></v-avatar>
                                            </template>
                                            <span>Edad Mínima</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs6 md2 pa-2 class="headline">{{ busqueda.juegocargado.edadminima }}</v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn :color="menu.color + selectcolor()" large block :href="'https://boardgamegeek.com/boardgame/' + busqueda.juegocargado.idbgg" target="_blank">Enlace a BGG</v-btn>
                        </v-card-actions>
                        <v-slide-x-transition>
                            <v-btn fab v-if="!busqueda.paraguardar" :color="menu.color" small absolute top right depressed to="/juegos" class="mt-5"><v-icon>fas fa-angle-left</v-icon></v-btn>
                        </v-slide-x-transition>
                        <v-slide-x-reverse-transition>
                            <v-btn fab v-if="busqueda.paraguardar" :color="menu.color" small absolute top right depressed class="mt-5"><v-icon>fas fa-save</v-icon></v-btn>
                        </v-slide-x-reverse-transition>
                    </v-card>
                </v-flex>
            </v-slide-y-reverse-transition>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
    created() {
        if(this.$route.params.id !== this.$store.state.busqueda.juegocargado.idbgg){
            this.$store.commit('barracarga',[true,10])
            this.$store.dispatch('buscarjuego',this.$route.params.id)
        }
    },
    computed: {
        ...mapState(['busqueda','progreso','menu'])
    },
    methods: {
        ...mapGetters(['selectcolor','selectfondo','autentificado','selectcolorinvert'])
    }
}
</script>