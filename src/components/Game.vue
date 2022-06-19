<script lang="ts">
import { ref, defineComponent } from 'vue'
import type { Card, MapOfCards } from '../types'
import CardComponent from './Card.vue'
import StartingHand from './StartingHand.vue'
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
        StartingHand,
        CardComponent,
    },
    setup() {
        const id = ref('')
        const timer = ref(0)
        const state = ref('')
        const hand = ref<MapOfCards>({})

        server.on('starting_hand', function (payload) {
            setCards(payload.hand)

            id.value = payload.game_id
            state.value = 'StartingHand'
            timer.value = payload.duration
        })

        server.on('wait_turn', function (payload: TurnPayload) {
            state.value = 'Turn'
            timer.value = payload.duration
        })

        server.on('start_turn', (payload: TurnPayload) => {
            state.value = 'Turn'
            setCards(payload.cards)
        })

        function setCards(cards: Card[]) {
            if (cards.length > 0) {
                hand.value = {}
                for (const card of cards) {
                    hand.value[card.Id] = card
                }
            }
        }

        return { state, hand, setCards }
    },
})
</script>

<template>
    <div class="game">
        {{ state }}

        <StartingHand @hand="setCards" v-show="state == 'StartingHand'" />

        <div class="hand" v-if="state == 'Turn'">
            <CardComponent
                v-for="card in hand"
                :card="card"
                :key="card.Id"
            />
        </div>
    </div>
</template>

<style scoped>
.hand {
    left: 0;
    width: 100%;
    bottom: 10px;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
}
</style>
