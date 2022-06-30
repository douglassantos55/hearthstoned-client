<script lang="ts">
import useCardDetails from '@/composables/useCardDetails'
import useRouter from '@/composables/useRouter'
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
        const { route } = useRouter()
        const { setCard, removeCard } = useCardDetails()

        const startingHand = ref(false)
        const hand = ref<MapOfCards>({})

        if (route.state.hand) {
            setCards(route.state.hand)
            startingHand.value = true
        }

        server.on('wait_turn', function () {
            startingHand.value = false
        })

        server.on('start_turn', function (payload) {
            startingHand.value = false
            setCards(payload.cards)
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

        return { startingHand, hand, setCards, setCard, removeCard }
    },
})
</script>

<template>
    <div class="hand">
        <Teleport to="body">
            <StartingHand
                :cards="hand"
                @update:cards="setCards"
                v-show="startingHand"
            />
        </Teleport>

        <transition-group name="cards" class="cards" v-if="!startingHand" tag="div">
            <CardComponent
                v-for="card in hand"
                :card="card"
                :key="card.Id"
                class="hand__card"
                @click="$emit('playCard', card.Id)"
                @mouseenter="setCard(card)"
                @mouseleave="removeCard"
            />
        </transition-group>
    </div>
</template>

<style scoped>
.cards {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hand__card {
    margin-right: -3%;
    width: calc(50vh / 3 - 20px);
    height: calc(50vh / 3);
}
.cards-enter-active {
    pointer-events: none;
    transition: opacity 0.1s, transform 0.5s ease;
}
.cards-enter-from {
    opacity: 0.5;
    transform: translateY(-30px) rotateZ(5deg);
}
.cards-leave-active {
    pointer-events: none;
    transition: opacity 0.5s, transform 1s ease;
}
.cards-leave-to {
    opacity: 0;
    transform: translateY(-100px);
}
</style>
