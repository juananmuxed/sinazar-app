<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex class="display-2 font-weight-light text-uppercase">Crear juego</v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 md6 pa-2><v-text-field prefix="boardgamegeek.com/boardgame/" :rules="[() => !!nuevojuego.idtemporal || 'Campo requerido']" @keyup.enter="testeoidbgg(nuevojuego.idtemporal)" v-model="paytheid" box label="ID *" required type="text" :color="menu.color + selectcolorinvert()" mask="############"></v-text-field></v-flex>
            <v-flex xs12 md6 pa-2><v-btn :disabled="entendido()" block :color="menu.color + selectcolor()" @click="testeoidbgg(nuevojuego.idtemporal)" large>Cargar desde BGG</v-btn></v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
            <v-flex xs12 pa-2 class="display-2 font-weight-light text-uppercase" v-if="nuevojuego.id !== ''">Juego ID {{ nuevojuego.id }}</v-flex>
            <v-flex xs12 md6 pa-2>
                <v-text-field :disabled="entendido()" box label="Nombre *" :counter="100" :rules="[() => !!nuevojuego.nombre || 'Campo requerido', () => nuevojuego.nombre.length < 100 || 'Demasiado largo']" v-model="paythenombre" required type="text" :color="menu.color + selectcolorinvert()"></v-text-field>
            </v-flex>
            <v-flex xs12 md6 pa-2>
                <v-text-field :disabled="entendido()" box label="Imagen" v-model="paytheimagen" type="text" :color="menu.color + selectcolorinvert()"></v-text-field>
            </v-flex>
            <v-flex xs9 md11 pa-2>
                <v-slider min="1" max="20" v-model="payazar" label="Azar" :color="menu.color + selectcolor()"></v-slider>
            </v-flex>
            <v-flex xs3 md1 pa-2>
                <v-text-field outline :color="menu.color + selectcolor()" mask="##" v-model="payazar"></v-text-field>
            </v-flex>
            <v-flex xs9 md11 pa-2>
                <v-slider min="1" max="20" v-model="paypierde" label="Pierde Amigos" :color="menu.color + selectcolor()"></v-slider>
            </v-flex>
            <v-flex xs3 md1 pa-2>
                <v-text-field outline :color="menu.color + selectcolor()" mask="##" v-model="paypierde"></v-text-field>
            </v-flex>
            <v-flex xs12 pa-2>
                <v-textarea :disabled="entendido()" box label="Descripción" :counter="5000" auto-grow v-model="paythedescripcion" :color="menu.color + selectcolorinvert()" :rules="[() => nuevojuego.desc.length < 5000 || 'Demasiado largo']"></v-textarea>
            </v-flex>
            <v-flex xs12 md4 pa-2>
                <v-text-field :disabled="entendido()" box label="Año de publicación" v-model="nuevojuego.ano" :color="menu.color + selectcolorinvert()" mask="####"></v-text-field>
            </v-flex>
            <v-flex xs12 md8 pa-2>
                <v-range-slider thumb-label="always" :thumb-size="24" :disabled="entendido()" label="Duración" max="360" v-model="payduracion" type="text" :color="menu.color + selectcolor()"></v-range-slider>
            </v-flex>
            <v-flex xs9 md11 pa-2>
                <v-slider :disabled="entendido()" v-model="payedadminima" label="Edad mínima" :color="menu.color + selectcolor()"></v-slider>
            </v-flex>
            <v-flex xs3 md1 pa-2>
                <v-text-field outline :disabled="entendido()" :color="menu.color + selectcolor()" mask="###" v-model="payedadminima"></v-text-field>
            </v-flex>
            <v-flex xs3 md1 pa-2>
                <v-text-field outline :disabled="entendido()" :color="menu.color + selectcolor()" mask="###" v-model="paymin"></v-text-field>
            </v-flex>
            <v-flex xs6 md10 pa-2>
                <v-range-slider v-model="payjugadores" label="Jugadores" :color="menu.color + selectcolor()" :disabled="entendido()"></v-range-slider>
            </v-flex>
            <v-flex xs3 md1 pa-2>
                <v-text-field outline :disabled="entendido()" :color="menu.color + selectcolor()" mask="###" v-model="paymax"></v-text-field>
            </v-flex>
            <v-flex xs12 md6 pa-2>
                <v-btn :disabled="entendidoguardar()" block :color="menu.color + selectcolor()" @click="guardarjuego" large>Guardar</v-btn>
            </v-flex>
            <v-flex xs12 md6 pa-2>
                <v-btn :disabled="entendido()" block :color="menu.color + selectcolorinvert()" @click="limpiarcreacion" large>Limpiar</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    computed:{
        ...mapState(['menu','nuevojuego']),
        paytheid:{
            get() {return this.$store.state.nuevojuego.id}, 
            set(value) {this.$store.commit('cambiaridnuevo',value)}
        },
        paythenombre:{
            get() {return this.$store.state.nuevojuego.nombre}, 
            set(value) {this.$store.commit('cambiarnombrenuevo',value)}
        },
        paytheimagen:{
            get() {return this.$store.state.nuevojuego.imagen}, 
            set(value) {this.$store.commit('cambiarimagennuevo',value)}
        },
        paythedescripcion:{
            get() {return this.$store.state.nuevojuego.desc}, 
            set(value) {this.$store.commit('cambiardescnuevo',value)}
        },
        payedadminima:{
            get() {return this.$store.state.nuevojuego.edadminima}, 
            set(value) {this.$store.commit('cambiaredadnuevo',value)}
        },
        paymin:{
            get() {return this.$store.state.nuevojuego.jugadores[0]}, 
            set(value) {this.$store.commit('cambiarmin',value)}
        },
        paymax:{
            get() {return this.$store.state.nuevojuego.jugadores[1]}, 
            set(value) {this.$store.commit('cambiarmax',value)}
        },
        payjugadores:{
            get() {return this.$store.state.nuevojuego.jugadores}, 
            set(value) {this.$store.commit('cambiarjug',value)}
        },
        payduracion:{
            get() {return this.$store.state.nuevojuego.duracion}, 
            set(value) {this.$store.commit('cambiarduracion',value)}
        },
        payano:{
            get() {return this.$store.state.nuevojuego.ano}, 
            set(value) {this.$store.commit('cambiarano',value)}
        },
        payazar:{
            get() {return this.$store.state.nuevojuego.azar}, 
            set(value) {this.$store.commit('cambiarazar',value)}
        },
        paypierde:{
            get() {return this.$store.state.nuevojuego.pierdeamigos}, 
            set(value) {this.$store.commit('cambiarpierde',value)}
        }
    },
    methods:{
        ...mapGetters(['selectcolorinvert','selectcolor','entendido','entendidoguardar']),
        ...mapActions(['testeoidbgg','limpiarcreacion','guardarjuego'])
    }
}
</script>