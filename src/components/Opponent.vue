<script lang="ts">
import { defineComponent, ref } from 'vue'
import Board from './Board.vue'
import server from '@/server'

export default defineComponent({
    props: {
        playing: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Board,
    },
    setup(props) {
        const curMana = ref(0)
        const maxMana = ref(0)
        const cardsInHand = ref(3)

        server.on('wait_turn', function (payload) {
            maxMana.value = payload.mana
            curMana.value = maxMana.value
            cardsInHand.value = payload.cards_in_hand
        })

        server.on('card_played', function (payload) {
            if (props.playing) {
                cardsInHand.value--
                curMana.value -= payload.Mana
            }
        })

        return { curMana, maxMana, cardsInHand }
    },
})
</script>

<template>
    <div class="opponent">
        <div class="opponent__hand">
            <div class="opponent__card" v-for="i in cardsInHand" :key="i" />
        </div>

        <Board :playing="playing" class="board--reverse" />

        <span class="opponent__mana">
            {{ curMana }}/{{ maxMana }}
        </span>
    </div>
</template>

<style scoped>
.opponent {
    top: 0;
    left: 0;
    width: 100%;
    height: 50vh;
    position: fixed;
}
.opponent__mana {
    top: 10px;
    right: 10px;
    font-size: 15px;
    position: fixed;
}
.opponent__hand {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.opponent__card {
    width: 150px;
    height: 190px;
    flex-shrink: 0;
    border-radius: 5px;
    background: brown;
    border: 1px solid #ccc;
    transition: all 0.1s ease-out;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
</style>
