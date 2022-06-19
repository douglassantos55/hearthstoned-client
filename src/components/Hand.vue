<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from '../server'
import type { Card, MapOfCards } from '../types'
import CardComponent from './Card.vue'
import StartingHand from './StartingHand.vue'

export default defineComponent({
    components: {
        StartingHand,
        CardComponent,
    },
    setup() {
        const startingHand = ref(false)
        const hand = ref<MapOfCards>({})

        server.on('wait_turn', function () {
            startingHand.value = false
        })

        server.on('start_turn', function (payload) {
            startingHand.value = false
            setCards(payload.cards)
        })

        server.on('starting_hand', function (payload) {
            setCards(payload.hand)
            startingHand.value = true
        })

        server.on('card_played', function (payload) {
            delete hand.value[payload.Id]
        })

        function setCards(cards: Card[]) {
            if (cards.length > 0) {
                hand.value = {}
                for (const card of cards) {
                    hand.value[card.Id] = card
                }
            }
        }

        return { startingHand, hand, setCards }
    },
})
</script>

<template>
    <div class="hand">
        <StartingHand
            :cards="hand"
            @update:cards="setCards"
            v-show="startingHand"
        />

        <div class="cards" v-if="!startingHand">
            <CardComponent
                v-for="card in hand"
                :card="card"
                :key="card.Id"
                @click="$emit('play-card', card.Id)"
            />
        </div>
    </div>
</template>

<style scoped>
.hand {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
