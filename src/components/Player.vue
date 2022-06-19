<script lang="ts">
import { ref, defineComponent } from 'vue'
import CardComponent from './Card.vue'
import server from '../server'
import type { Card, MapOfCards } from '../types'
import StartingHand from './StartingHand.vue'

export default defineComponent({
    name: 'Player',
    props: {
        gameId: {
            type: String,
            required: true,
        },
    },
    components: {
        StartingHand,
        CardComponent,
    },
    setup(props) {
        const curMana = ref(0)
        const maxMana = ref(0)
        const health = ref(30)
        const startingHand = ref(false)
        const hand = ref<MapOfCards>({})

        server.on('wait_turn', function () {
            startingHand.value = false
        })

        server.on('start_turn', function (payload) {
            startingHand.value = false

            maxMana.value = payload.mana
            curMana.value = maxMana.value

            setCards(payload.cards)
        })

        server.on('starting_hand', function (payload) {
            setCards(payload.hand)
            startingHand.value = true
        })

        server.on('card_played', function (payload) {
            delete hand.value[payload.Id]
            curMana.value -= payload.Mana
        })

        function setCards(cards: Card[]) {
            if (cards.length > 0) {
                hand.value = {}
                for (const card of cards) {
                    hand.value[card.Id] = card
                }
            }
        }

        function playCard(cardId: string) {
            server.send('play_card', {
                GameId: props.gameId,
                CardId: cardId,
            })
        }

        return {
            curMana,
            maxMana,
            health,
            hand,
            startingHand,
            playCard,
            setCards
        }
    },
})
</script>

<template>
    <StartingHand v-show="startingHand" @hand="setCards" />

    <div class="player">
        <span class="player__mana">
            {{ curMana }}/{{ maxMana }}
        </span>

        <div class="player__hand" v-if="!startingHand">
            <CardComponent
                v-for="card in hand"
                :card="card"
                :key="card.Id"
                @click="playCard(card.Id)"
            />
        </div>
    </div>
</template>

<style scoped>
.player__mana {
    right: 10px;
    bottom: 10px;
    position: fixed;
}
.player__hand {
    left: 0;
    width: 100%;
    bottom: 10px;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
}
</style>
