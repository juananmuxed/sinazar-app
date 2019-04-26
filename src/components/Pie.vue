<template>
    <v-footer app :color="menu.color + selectcolor()" class="pa-3">
        Footer
    </v-footer>
</template>

<script>
import { mapState , mapGetters } from "vuex";
export default {
    computed:{
        ...mapState(['menu'])
    },
    methods:{
        ...mapGetters(['selectcolor','selectcolorinvert'])
    }
}
</script>