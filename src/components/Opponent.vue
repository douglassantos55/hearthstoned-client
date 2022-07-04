<script lang="ts">
import { defineComponent, ref } from 'vue'
import server from '@/server'
import Board from './Board.vue'
import useAttributes from '@/composables/useAttributes'
import useAnimation from '@/composables/useAnimation'

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
    setup(props, { emit }) {
        const id = ref('')
        const mana = ref(0)
        const health = ref(30)
        const maxMana = ref(0)
        const cardsInHand = ref(3)
        const minions = ref(0)

        const { animate } = useAnimation()
        const attrs = useAttributes({ mana, health, maxMana })

        server.on('reconnected', function(payload) {
            id.value = payload.Opponent.Id
            mana.value = payload.Opponent.Mana
            health.value = payload.Opponent.Health
            maxMana.value = payload.Opponent.MaxMana
            minions.value = Object.values(payload.Opponent.Board.Minions).length
            cardsInHand.value = Object.values(payload.Opponent.Hand.Cards).length
        })

        server.on('wait_turn', function (payload) {
            maxMana.value = payload.mana
            mana.value = maxMana.value
            id.value = payload.opponent_id
            cardsInHand.value = payload.cards_in_hand
        })

        server.on('player_damage_taken', function (payload) {
            if (payload.Player.Id == id.value) {
                const defender = document.getElementById(payload.Player.Id)
                const attacker = document.getElementById(payload.Attacker.Id)

                if (attacker && defender) {
                    const dest = defender.getBoundingClientRect()
                    const source = attacker.getBoundingClientRect()

                    animate(attacker, {
                        scale: 1.2,
                        zIndex: 999,
                        duration: 500,
                        easing: 'cubicBezier(0,.74,1,-0.31)',
                        direction: 'alternate',
                        complete: function () {
                            health.value = payload.Player.Health
                        },
                        translateX: function () {
                            return dest.x - source.x
                        },
                        translateY: function () {
                            return (dest.y) - source.y
                        },
                    })
                }
            }
        })

        server.on('card_played', function (payload) {
            if (props.playing) {
                cardsInHand.value--
                mana.value -= payload.Mana
            }
        })

        function select() {
            emit('playerSelected', id.value)
        }

        return { id, attrs, minions, cardsInHand, select }
    },
})
</script>

<template>
    <div class="opponent">
        <transition-group tag="div" name="cards" class="opponent__hand">
            <div class="opponent__card" :id="i" v-for="i in cardsInHand" :key="i" />
        </transition-group>

        <button
            :id="id"
            class="opponent__portrait"
            @click="select"
            :disabled="minions > 0"
        >
            <img src="http://placeimg.com/100/100/people" />
            {{ attrs.health }}
        </button>

        <Board
            :playing="playing"
            class="board--reverse"
            @minion-played="minions++"
            @minion-destroyed="minions--"
            @minion-selected="(id) => $emit('minionSelected', id)"
        />

        <span class="opponent__mana">
            {{ attrs.mana }}/{{ attrs.maxMana }}
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
