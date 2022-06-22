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
        <transition-group tag="div" name="cards" class="opponent__hand">
            <div class="opponent__card" :id="i" v-for="i in cardsInHand" :key="i" />
        </transition-group>

        <button class="opponent__portrait" @click="$emit('playerSelected', $event.target)">
            <img src="http://placeimg.com/100/100/people" />
        </button>

        <Board
            :playing="playing"
            class="board--reverse"
            @minion-selected="(target, id) => $emit('minionSelected', target, id)"
        />

        <span class="opponent__mana">
            {{ curMana }}/{{ maxMana }}
        </span>
    </div>
</template>

<style scoped>
.opponent {
    left: 0;
    top: -5%;
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
    width: calc(50vh / 3 - 20px);
    height: calc(50vh / 3);
    margin-left: -5%;
    border-radius: 5px;
    background: brown;
    border: 1px solid #ccc;
    transition: all 0.1s ease-out;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
.opponent__portrait {
    margin: auto;
    display: block;
    height: calc(50vh / 3);
}
.cards-enter-active {
    transition: opacity 0.1s, transform 0.5s ease;
}
.cards-enter-from {
    opacity: 0.5;
    transform: translateY(30px) rotateZ(-5deg);
}
.cards-leave-active {
    transition: opacity 0.5s, transform 1s ease;
}
.cards-leave-to {
    opacity: 0;
    transform: translateY(100px);
}
</style>
