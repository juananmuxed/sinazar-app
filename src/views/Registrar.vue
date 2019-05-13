<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex pa-2 xs12><span class="display-2 font-weight-light text-uppercase">Registrar</span></v-flex>
        </v-layout>
        <v-form  ref="form">
            <v-layout row wrap>
                <v-flex xs12 pa-2><v-text-field box label="Correo electrónico" required v-model="mailcorrecto" :rules="formulario.registrar.reglasemail" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
                <v-flex xs12 pa-2><v-text-field box label="Contraseña" required v-model="passcorrecta" :rules="formulario.registrar.reglaspass" type="password" :color="menu.color + selectcolorinvert()"></v-text-field></v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex pa-2><v-btn :color="menu.color" block>Registrar</v-btn></v-flex>
                <v-flex pa-2><v-btn :color="menu.color + selectcolor()" @click="limpiar()" block>Limpiar</v-btn></v-flex>
                <v-flex pa-2><v-btn to="/entrar" block>Entrar</v-btn></v-flex>
            </v-layout>
        </v-form>
    </v-container>
</template>

<script>
import { mapState , mapGetters } from 'vuex';
export default {
    computed:{
        ...mapState(['menu','formulario']),
        mailcorrecto:{
            get() {return this.$store.state.formulario.registrar.email}, 
            set(value) {this.$store.commit('cambiaremailreg',value)}
        },
        passcorrecta:{
            get() {return this.$store.state.formulario.registrar.pass}, 
            set(value) {this.$store.commit('cambiarpassreg',value)}
        }
    },
    methods: {
        limpiar() {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
        },
        ...mapGetters(['selectcolor','selectcolorinvert']),
    }
}
</script>
