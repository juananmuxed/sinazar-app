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
                                    <v-flex xs10 md8>
                                        <v-text-field :counter="100" v-model="cambiarnombre" label="Nombre" :color="menu.color" required :rules="[() => !!busqueda.juegocargado.nombre || 'No puede estar vacío', () => busqueda.juegocargado.nombre.length < 100 || 'Demasiado largo']">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirnombre();botonguardar()" class="pr-3" v-if="busqueda.juegocargado.nombre !== busqueda.juegocargadoraw.nombre" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs10 md2>
                                        <v-text-field v-model="cambiarano" label="Año" :color="menu.color" prefix="(" suffix=")" mask="####"  required :rules="[() => !!busqueda.juegocargado.ano || 'No puede estar vacío']">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirano();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.ano !== busqueda.juegocargadoraw.ano" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs10>
                                        <span clas="font-weight-bold">Creado por: </span><span>{{ busqueda.juegocargado.uidusuario }}</span><span v-if="busqueda.juegocargado.fcreacion" class="pa-1 text-uppercase caption font-weight-light">({{ busqueda.juegocargado.fcreacion }})</span>
                                    </v-flex>
                                    <v-flex xs10 v-if="busqueda.juegocargado.ultimamodif">
                                        <span clas="font-weight-light font-italic">Ultima modificación: </span><span>{{ busqueda.juegocargado.modificadopor }}</span><span class="pa-1 text-uppercase caption font-weight-light font-italic">({{ busqueda.juegocargado.ultimamodif }})</span>
                                    </v-flex>
                                    <v-flex xs10 md8>
                                        <v-text-field v-model="cambiarimagen" label="Enlace a imagen" :color="menu.color">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirimagen();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.imagen !== busqueda.juegocargadoraw.imagen" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-slide-x-transition>
                                    <v-btn fab v-if="busqueda.paraguardar" :color="menu.color" @click="arreglarcambios" fixed bottom right depressed class="mb-5"><v-icon>fas fa-undo-alt</v-icon></v-btn>
                                </v-slide-x-transition>
                                <v-btn fab :color="menu.color" small absolute bottom right depressed :to="{ name: 'juego' , params :{id : busqueda.juegocargado.idbgg}}" class="mb-5"><v-icon>fas fa-eye</v-icon></v-btn>
                            </v-container>
                        </v-img>
                        <v-card-text>
                            <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex xs12 pa-1 class="font-weight-light body-1">Acepta código HTML como <kbd>&lt;br&gt;</kbd> o <kbd>&lt;ul&gt; &lt;li&gt;</kbd></v-flex>
                                    <v-flex xs12 pa-1>
                                        <v-textarea label="Descripción" :counter="5000" auto-grow :color="menu.color" v-model="cambiardesc" required :rules="[() => busqueda.juegocargado.nombre.length < 5000 || 'Demasiado largo']">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirdesc();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.desc !== busqueda.juegocargadoraw.desc" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap class="text-xs-left" pt-3 justify-space-between fill-height>
                                    <v-flex xs9 md11 pa-2>
                                        <v-slider min="1" max="20" v-model="cambiarazar" label="Azar" :color="menu.color + selectcolor()"></v-slider>
                                    </v-flex>
                                    <v-flex xs3 md1 pa-2>
                                        <v-text-field :color="menu.color + selectcolor()" mask="##" v-model="busqueda.juegocargado.azar" required :rules="[() => busqueda.juegocargado.azar > 0 || 'Mayor que 0']">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirazar();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.azar !== busqueda.juegocargadoraw.azar" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs9 md11 pa-2>
                                        <v-slider min="1" max="20" v-model="cambiarpierde" label="Pierde Amigos" :color="menu.color + selectcolor()"></v-slider>
                                    </v-flex>
                                    <v-flex xs3 md1 pa-2>
                                        <v-text-field :color="menu.color + selectcolor()" mask="##" v-model="busqueda.juegocargado.pierdeamigos" required :rules="[() => busqueda.juegocargado.pierdeamigos > 0 || 'Mayor que 0']">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertirpierde();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.pierdeamigos !== busqueda.juegocargadoraw.pierdeamigos" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md4 pa-4 class="headline">
                                        <v-layout class="text-xs-center">
                                            <v-flex xs5>
                                                <v-text-field :max="busqueda.juegocargado.jugadores[1]" v-model="cambiarjugmin" :color="menu.color" label="Jugadores Min" mask="##">
                                                    <template v-slot:append>
                                                        <v-slide-x-transition><v-icon @click="revertirjugadores(0);botonguardar()" class="pr-1" v-if="busqueda.juegocargado.jugadores[0] !== busqueda.juegocargadoraw.jugadores[0]" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                                    </template>
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs2>-</v-flex>
                                            <v-flex xs5>
                                                <v-text-field :min="busqueda.juegocargado.jugadores[0]" v-model="cambiarjugmax" :color="menu.color" label="Jugadores Max" mask="##">
                                                    <template v-slot:append>
                                                        <v-slide-x-transition><v-icon @click="revertirjugadores(1);botonguardar()" class="pr-1" v-if="busqueda.juegocargado.jugadores[1] !== busqueda.juegocargadoraw.jugadores[1]" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                                    </template>
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 md4 pa-4 class="headline">
                                        <v-layout class="text-xs-center">
                                            <v-flex xs5>
                                                <v-text-field v-model="cambiardurmin" :color="menu.color" label="Duración Min" mask="###">
                                                    <template v-slot:append>
                                                        <v-slide-x-transition><v-icon @click="revertirduracion(0);botonguardar()" class="pr-1" v-if="busqueda.juegocargado.duracion[0] !== busqueda.juegocargadoraw.duracion[0]" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                                    </template>
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs2>-</v-flex>
                                            <v-flex xs5>
                                                <v-text-field v-model="cambiardurmax" :color="menu.color" label="Duración Max" mask="###">
                                                    <template v-slot:append>
                                                        <v-slide-x-transition><v-icon @click="revertirduracion(1);botonguardar()" class="pr-1" v-if="busqueda.juegocargado.duracion[1] !== busqueda.juegocargadoraw.duracion[1]" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                                    </template>
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 md4 pa-4 class="headline">
                                        <v-text-field v-model="cambiaredad" :color="menu.color" label="Edad Mínima" mask="###">
                                            <template v-slot:append>
                                                <v-slide-x-transition><v-icon @click="revertiredad();botonguardar()" class="pr-1" v-if="busqueda.juegocargado.edadminima !== busqueda.juegocargadoraw.edadminima" small :color="menu.color">fas fa-undo-alt</v-icon></v-slide-x-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-slide-x-transition>
                            <v-btn fab v-if="!busqueda.paraguardar" :color="menu.color" small absolute top right depressed to="/juegos" class="mt-5"><v-icon>fas fa-angle-left</v-icon></v-btn>
                        </v-slide-x-transition>
                        <v-layout row justify-center>
                            <v-dialog persistent v-model="busqueda.modalguardar" max-width="520">
                                <template v-slot:activator="{ on }">
                                    <v-slide-x-reverse-transition>
                                        <v-btn v-on="on" fab v-if="busqueda.paraguardar" :color="menu.color" small absolute top right depressed class="mt-5"><v-icon>fas fa-save</v-icon></v-btn>
                                    </v-slide-x-reverse-transition>
                                </template>
                                <v-card>
                                    <v-card-title class="headline text-uppercase" :color="menu.color">¿Desea guardar las modificaciones?</v-card-title>
                                    <v-card-actions>
                                        <v-layout row wrap>
                                            <v-flex xs12 md4 pa-2><v-btn block @click="guardarcambios()">Guardar</v-btn></v-flex>
                                            <v-flex xs12 md4 pa-2><v-btn block @click="salirsinguardar()">Salir sin guardar</v-btn></v-flex>
                                            <v-flex xs12 md4 pa-2><v-btn block @click="cancelarmodal()">Cancelar</v-btn></v-flex>
                                        </v-layout>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-slide-y-reverse-transition>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
export default {
    created() {
        if(this.$route.params.id !== this.$store.state.busqueda.juegocargado.idbgg){
            this.$store.commit('barracarga',[true,10])
            this.$store.dispatch('buscarjuego',this.$route.params.id)
        }
    },
    computed: {
        ...mapState(['busqueda','progreso','menu']),
        cambiarnombre:{
            get() {return this.$store.state.busqueda.juegocargado.nombre},
            set(value) {
                this.$store.commit('actualizarnombre',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiarano:{
            get() {return this.$store.state.busqueda.juegocargado.ano},
            set(value) {
                this.$store.commit('actualizarano',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiarimagen:{
            get() {return this.$store.state.busqueda.juegocargado.imagen},
            set(value) {
                this.$store.commit('actualizarimagen',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiardesc:{
            get() {return this.$store.state.busqueda.juegocargado.desc},
            set(value) {
                this.$store.commit('actualizardesc',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiarazar:{
            get() {return this.$store.state.busqueda.juegocargado.azar},
            set(value) {
                this.$store.commit('actualizarazar',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiarpierde:{
            get() {return this.$store.state.busqueda.juegocargado.pierdeamigos},
            set(value) {
                this.$store.commit('actualizarpierde',value)
                this.$store.getters.botonguardar
            } 
        },
        cambiarjugmin:{
            get() {return this.$store.state.busqueda.juegocargado.jugadores[0]},
            set(value) {
                var indice = 0
                this.$store.commit('actualizarjug',[value,0])
                this.$store.getters.botonguardar
            } 
        },
        cambiarjugmax:{
            get() {return this.$store.state.busqueda.juegocargado.jugadores[1]},
            set(value) {
                this.$store.commit('actualizarjug',[value,1])
                this.$store.getters.botonguardar
            } 
        },
        cambiardurmin:{
            get() {return this.$store.state.busqueda.juegocargado.duracion[0]},
            set(value) {
                this.$store.commit('actualizardur',[value,0])
                this.$store.getters.botonguardar
            } 
        },
        cambiardurmax:{
            get() {return this.$store.state.busqueda.juegocargado.duracion[1]},
            set(value) {
                this.$store.commit('actualizardur',[value,1])
                this.$store.getters.botonguardar
            } 
        },
        cambiaredad:{
            get() {return this.$store.state.busqueda.juegocargado.edadminima},
            set(value) {
                this.$store.commit('actualizaredad',value)
                this.$store.getters.botonguardar
            } 
        }
    },
    methods: {
        ...mapGetters(['selectcolor','selectfondo','autentificado','selectcolorinvert','botonguardar']),
        ...mapActions(['arreglarcambios','guardarcambios','salirsinguardar','cancelarmodal']),
        ...mapMutations(['revertirnombre','revertirano','revertirimagen','revertirdesc','revertirazar','revertirpierde','revertiredad','revertirjugadores','revertirduracion'])
    }
}
</script>