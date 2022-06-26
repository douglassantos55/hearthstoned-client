<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from './server'
import Game from './components/Game.vue'
import Queue from './components/Queue.vue'

export default defineComponent({
    components: {
        Game,
        Queue,
    },
    setup() {
        const state = ref('Queue')

        server.on('starting_hand', function () {
            state.value = 'Game'
        })

        return { state }
    },
})
</script>

<template>
    <Queue v-show="state == 'Queue'" />

    <Game
        v-show="state == 'Game'"
        @game-over="state = 'Queue'"
    />
</template>

<style>
* {
    box-sizing: border-box;
}
html, body {
    margin: 0;
}
</style>
