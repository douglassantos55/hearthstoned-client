<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from '../server'
import type { Card } from '../types'
import CardComponent from './Card.vue'

type MapOfCards = {
    [uuid: string]: Card
}

type Payload = {
    game_id: string
    hand: Card[]
}

export default defineComponent({
    name: 'StartingHand',
    components: {
        CardComponent,
    },
    setup() {
        const gameId = ref('')
        const waiting = ref(false)

        const cards = ref<MapOfCards>({})
        const cardsToDiscard = ref<string[]>([])

        server.on('wait_other_players', () => waiting.value = true)

        server.on('starting_hand', (payload: Payload) => {
            gameId.value = payload.game_id
            for (const card of payload.hand) {
                cards.value[card.Id] = card
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

        return { cards, waiting, discard, toggleCard, isSelected }
    }
})
</script>

<template>
    <div class="starting-hand">
        <h1 class="starting-hand__title">Choose which cards you wish to discard</h1>

        <div class="starting-hand__cards">
            <CardComponent
                :card="card"
                :key="card.Id"
                v-for="card in cards"
                @click="toggleCard(card.Id)"
                :class="{'card--selected': isSelected(card.Id)}"
            />
        </div>

        <button @click="discard" :disabled="waiting">Confirm</button>
    </div>
</template>

<style scoped>
.starting-hand {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.starting-hand__title {
    font-size: 35px;
    font-family: sans-serif;
}
.starting-hand__cards {
    margin: 30px 0 80px;
}
</style>
