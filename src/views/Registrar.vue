<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex pa-2 xs12><span class="display-2 font-weight-light text-uppercase">Registrar</span></v-flex>
        </v-layout>
        <v-form  ref="form">
            <v-layout row wrap>
                <v-flex xs12 pa-2><v-text-field box label="Correo electrónico" required v-model="usuario.email" :rules="usuario.reglasemail" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
                <v-flex xs12 pa-2><v-text-field box label="Contraseña" @keyup.enter="registrar(usuario.email,usuario.pass)" required v-model="usuario.pass" :rules="usuario.reglaspass" type="password" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex pa-2><v-btn :color="menu.color" block @click="registrar(usuario.email,usuario.pass)">Registrar</v-btn></v-flex>
                <v-flex pa-2><v-btn :color="menu.color + selectcolor()" @click="limpiar()" block>Limpiar</v-btn></v-flex>
            </v-layout>
        </v-form>
    </v-container>
</template>

<script>
import { mapState , mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            usuario:{
                valido:false,
                email:'',
                pass:'',
                reglasemail:[
                v => !!v || 'Email requerido',
                v => /.+@.+/.test(v) || 'Introduce un correo válido'
                ],
                reglaspass:[
                v => !!v || 'Contraseña requerida'
                ]
            }
        }
    },
    computed:{
        ...mapState(['menu'])
    },
    methods: {
        limpiar() {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
        },
        registrar() {
            if(this.$refs.form.validate()) {
                this.$store.dispatch('registrar',{
                    mail: this.usuario.email,
                    pass: this.usuario.pass
                })
            }
        },
        ...mapGetters(['selectcolor','selectcolorinvert']),
        ...mapActions(['revisarusuario'])
    }
}
</script>
