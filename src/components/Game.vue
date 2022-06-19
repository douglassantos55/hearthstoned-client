<script lang="ts">
import { ref, defineComponent } from 'vue'
import type { Card } from '../types'
import Timer from './Timer.vue'
import Player from './Player.vue'
import server from '../server'

type TurnPayload = {
    cards: Card[]
    mana: number
    cards_in_hand: number
    duration: number
    game_id: string
}

export default defineComponent({
    components: {
        Timer,
        Player,
    },
    setup() {
        const id = ref('')
        const timer = ref(0)
        const waiting = ref(true)

        server.on('starting_hand', function (payload) {
            id.value = payload.game_id
            timer.value = payload.duration
        })

        server.on('wait_turn', function (payload: TurnPayload) {
            waiting.value = true
            timer.value = payload.duration
        })

        server.on('start_turn', function (payload: TurnPayload) {
            waiting.value = false
            timer.value = payload.duration
        })

        function endTurn() {
            server.send('end_turn', id.value)
        }

        return { id, timer, endTurn, waiting }
    },
})
</script>

<template>
    <div class="game">
        <Timer v-model:duration="timer" class="game__timer" />
        <Player :game-id="id" />

        <button @click="endTurn" :disabled="waiting">
            {{ waiting ? 'Enemy Turn' : 'End Turn' }}
        </button>
    </div>
</template>

<style scoped>
.game {
    width: 100%;
    height: 100vh;
}
.game__timer {
    top: 10px;
    right: 10px;
    position: fixed;
}
</style>
