<template>
    <v-navigation-drawer absolute stateless clipped app floating :value="menu.drawer">
        <v-list two-line>
            <v-list-tile class="tile" v-ripple="{ class: `${menu.color}--text` }" @click="menu.drawer = !menu.drawer">
                <v-list-tile-action><v-icon :color="menu.color + selectcolorinvert()">fas fa-arrow-left</v-icon></v-list-tile-action>
                <v-list-tile-content>Cerrar</v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile class="tile" :active-class="menu.color + selectcolor()" v-ripple="{ class: `${menu.color}--text` }" v-for="link in menu.links" :to="link.link">
                <v-list-tile-action><v-avatar icon><v-icon :color="menu.color + selectcolorinvert()">{{ 'fas fa-' + link.logo }}</v-icon></v-avatar></v-list-tile-action>
                <v-list-tile-content><v-list-tile-title v-text="link.name"></v-list-tile-title></v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile :active-class="menu.color + selectcolor()" v-ripple="{ class: `${menu.color}--text` }" to="opciones">
                <v-list-tile-action><v-avatar icon><v-icon :color="menu.color + selectcolorinvert()">fas fa-wrench</v-icon></v-avatar></v-list-tile-action>
                <v-list-tile-content><v-list-tile-title>Opciones</v-list-tile-title></v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState , mapGetters } from 'vuex'
export default {
    computed: {
        ...mapState(['menu'])
    },
    methods: {
        ...mapGetters(['selectcolorinvert','selectcolor'])
    }
}
</script>

<style scoped>
.tile:hover{
    background:rgba(255, 255, 255, 0.1)
}
</style>

