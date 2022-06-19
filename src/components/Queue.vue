<script lang="ts">
import { ref } from 'vue'
import server from '../server'

export default {
    name: 'Queue',
    setup() {
        const matchId = ref('')
        const waiting = ref(false)

        server.on('wait_for_match', () => waiting.value = true)
        server.on('wait_other_players', () => waiting.value = true)

        server.on('confirm_match', (match: string) => {
            matchId.value = match
            waiting.value = false
        })

        function queueUp() {
            server.send('queue')
        }

        function confirm() {
            server.send('match_confirmed', matchId.value)
        }

        function decline() {
            server.send('match_declined', matchId.value)
        }

        return { matchId, waiting, queueUp, confirm, decline }
    }
}
</script>

<template>
    <div class="queue">
        <button @click="queueUp" v-if="!matchId" :disabled="waiting">Queue up</button>

        <button @click="confirm" v-if="matchId" :disabled="waiting">Confirm match</button>
        <button @click="cancel" v-if="matchId" :disabled="waiting">Cancel match</button>
    </div>
</template>
