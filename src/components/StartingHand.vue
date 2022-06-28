<script lang="ts">
import { ref, defineComponent, type PropType } from 'vue'
import server from '../server'
import Button from './Button.vue'
import CardComponent from './Card.vue'
import type { Card, MapOfCards } from '../types'
import useRouter from '@/composables/useRouter'

export default defineComponent({
    name: 'StartingHand',
    props: {
        cards: {
            type: Object as PropType<MapOfCards>,
            required: true,
        },
    },
    components: {
        Button,
        CardComponent,
    },
    setup(_,  { emit }) {
        const { route } = useRouter()

        const waiting = ref(false)
        const gameId = ref(route.state.game_id)
        const cardsToDiscard = ref<string[]>([])

        server.on('wait_other_players', (payload: Card[]) => {
            waiting.value = true
            if (payload && payload.length > 0) {
                emit('update:cards', payload)
            }
        })

        function discard() {
            server.send('card_discarded', {
                GameId: gameId.value,
                Cards: cardsToDiscard.value,
            })
        }

        function toggleCard(id: string) {
            const index = findIndex(id)
            if (index != -1) {
                cardsToDiscard.value.splice(index, 1)
            } else {
                cardsToDiscard.value.push(id)
            }
        }

        function findIndex(id: string): number {
            return cardsToDiscard.value.indexOf(id)
        }

        function isSelected(id: string): boolean {
            return findIndex(id) != -1
        }

        return { waiting, discard, toggleCard, isSelected }
    }
})
</script>

<template>
    <div class="starting-hand">
        <h1 class="starting-hand__title">Choose which cards you wish to discard</h1>

        <h2 class="wait-message" v-if="waiting">Please, wait while the other player selects his starting hand</h2>

        <div class="starting-hand__cards">
            <CardComponent
                :card="card"
                :key="card.Id"
                :disabled="waiting"
                v-for="card in cards"
                @click="toggleCard(card.Id)"
                :class="{'card--selected': isSelected(card.Id)}"
            />
        </div>

        <Button @click="discard" :disabled="waiting">Confirm</Button>
    </div>
</template>

<style scoped>
.starting-hand {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 500;
    position: fixed;
    background: #fff;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.starting-hand__title {
    font-size: 35px;
    font-family: sans-serif;
}
.starting-hand__cards {
    gap: 20px;
    display: flex;
    margin: 30px 0 80px;
}
.wait-message {
    font-size: 20px;
    font-family: sans-serif;
}
</style>
