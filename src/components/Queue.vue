<script lang="ts">
import { ref } from 'vue'
import server from '../server'
import Button from './Button.vue'
import useRouter from '@/composables/useRouter'

export default {
    name: 'Queue',
    components: {
        Button,
    },
    setup() {
        const matchId = ref('')
        const waiting = ref(false)
        const { redirect } = useRouter()

        server.on('starting_hand', function(payload) {
            redirect('/game/' + payload.game_id, payload)
        })

        server.on('wait_for_match', function () {
            waiting.value = true
        })

        server.on('wait_other_players', function () {
            waiting.value = true
        })

        server.on('match_canceled', function () {
            matchId.value = ''
            if (!waiting.value) {
                waiting.value = false
            }
        })

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
        <Button @click="queueUp" v-if="!matchId" :disabled="waiting">Queue up</Button>

        <Button success @click="confirm" v-if="matchId" :disabled="waiting">Confirm match</Button>
        <Button danger @click="decline" v-if="matchId" :disabled="waiting">Cancel match</Button>
    </div>
</template>
