<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-fade-transition mode="out-in">
                <v-flex xs12 v-if="progreso.cargando" pa-5 text-xs-center>
                    <v-progress-circular indeterminate :color="menu.color" :size="80" :width="9"></v-progress-circular>
                </v-flex>
            </v-fade-transition>
            <v-fade-transition mode="in-out">
                <v-flex xs12 v-if="!progreso.cargando">
                    <v-layout row wrap>
                        <v-flex xs12 md3 pa-3 text-xs-center>
                            <v-badge right color="transparent">
                                <template v-slot:badge>
                                    <v-dialog persistent max-width="320" v-model="menu.modalimagen">
                                        <template v-slot:activator="{ on }">
                                            <v-slide-x-reverse-transition>
                                                <v-btn icon :color="menu.color" v-on="on"><v-icon>fas fa-image</v-icon></v-btn>
                                            </v-slide-x-reverse-transition>
                                        </template>
                                        <v-card>
                                            <v-card-text>
                                                <v-layout row wrap>
                                                    <v-flex xs12 pa-3 text-xs-center>
                                                        <v-avatar :size="150" :color="menu.color + selectcolor()">
                                                            <img v-if="usuario.foto" :src="usuario.foto" :alt="usuario.email">
                                                            <v-icon v-else :size="100">fas fa-user</v-icon>
                                                        </v-avatar>
                                                    </v-flex>
                                                    <v-flex xs12 pa-2><v-text-field v-model="nuevos.imagen" :color="menu.color + selectcolor()" box label="Nueva Foto de Perfil"></v-text-field></v-flex>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-layout row wrap>
                                                    <v-flex xs12 md6 pa-2><v-btn @click="guardardatosusuario(nuevos)" :color="menu.color" block>Guardar</v-btn></v-flex>
                                                    <v-flex xs12 md6 pa-2><v-btn block @click="salirmodal()">Cancelar</v-btn></v-flex>
                                                </v-layout>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </template>
                                <v-avatar :size="150" :color="menu.color + selectcolor()">
                                    <img v-if="usuario.foto" :src="usuario.foto" :alt="usuario.email">
                                    <v-icon v-else :size="100">fas fa-user</v-icon>
                                </v-avatar>
                            </v-badge>
                        </v-flex>
                        <v-flex xs12 md9 pa-3>
                            <v-layout row wrap>
                                <v-flex xs10 class="display-2 font-weight-thin" pa-2>
                                    <span v-if="usuario.nombre" v-text="usuario.nombre"></span>
                                    <span v-else v-text="'Nombre no proporcionado'"></span>
                                </v-flex>
                                <v-flex xs2 pa-2>
                                    <v-dialog persistent max-width="320" v-model="menu.modalnombre">
                                        <template v-slot:activator="{ on }">
                                            <v-slide-x-reverse-transition>
                                                <v-btn icon :color="menu.color" v-on="on"><v-icon :size="18">fas fa-user-edit</v-icon></v-btn>
                                            </v-slide-x-reverse-transition>
                                        </template>
                                        <v-card>
                                            <v-card-text>
                                                <v-layout row wrap>
                                                    <v-flex xs12 pa-3 text-xs-center>
                                                        <span v-if="usuario.nombre" v-text="usuario.nombre"></span>
                                                        <span v-else v-text="'Sin nombre'"></span>
                                                    </v-flex>
                                                    <v-flex xs12 pa-2><v-text-field v-model="nuevos.nombre" :color="menu.color + selectcolor()" box label="Nuevo nombre"></v-text-field></v-flex>
                                                </v-layout>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-layout row wrap>
                                                    <v-flex xs12 md6 pa-2><v-btn @click="guardardatosusuario(nuevos)" :color="menu.color" block>Guardar</v-btn></v-flex>
                                                    <v-flex xs12 md6 pa-2><v-btn block @click="salirmodal()">Cancelar</v-btn></v-flex>
                                                </v-layout>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-flex>
                                <v-flex xs12 pa-2>
                                    <span v-text="usuario.email" class="headline font-weight-light font-italic"></span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs12 pa-2 v-if="!usuario.verificado">
                                    <v-btn block large :color="menu.color + selectcolor()" @click="verificarmail">Verificar Correo</v-btn>
                                </v-flex>
                                <v-flex xs12 md6 pa-2>
                                    <v-dialog persistent max-width="320" v-model="menu.modalpass">
                                        <template v-slot:activator="{ on }">
                                            <v-btn v-on="on" block :color="menu.color">Cambiar Contraseña</v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <v-layout row wrap>
                                                    <v-flex xs12 pa-3 text-xs-center class="font-weight-light headline" v-text="'¿Enviar correo para cambio de Contraseña?'"></v-flex>
                                                </v-layout>
                                            </v-card-title>
                                            <v-card-actions>
                                                <v-layout row wrap>
                                                    <v-flex xs12 md6 pa-2><v-btn @click="mailreestablecercontraseña()" :color="menu.color" block>Enviar</v-btn></v-flex>
                                                    <v-flex xs12 md6 pa-2><v-btn block @click="salirmodal()">Cancelar</v-btn></v-flex>
                                                </v-layout>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-flex>
                                <v-flex xs12 md6 pa-2>
                                    <v-btn block :color="menu.color + selectcolorinvert()" disabled>Eliminar</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-fade-transition>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    data() {
        return {
            nuevos:{
                nombre:'',
                imagen:''
            }   
        }
    },
    created() {
        this.$store.dispatch('revisarusuario')
    },
    computed: {
        ...mapState(['usuario','progreso','menu'])  
    },
    methods: {
        ...mapGetters(['selectcolor','selectcolorinvert']) ,
        ...mapActions(['salirmodal','guardardatosusuario','verificarmail','mailreestablecercontraseña']) 
    },
}
</script>
