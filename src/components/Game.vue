<script lang="ts">
import { ref, defineComponent } from 'vue'
import type { Card } from '../types'
import Timer from './Timer.vue'
import Player from './Player.vue'
import Opponent from './Opponent.vue'
import server from '../server'
import anime from 'animejs'

type TurnPayload = {
    cards: Card[]
    mana: number
    cards_in_hand: number
    duration: number
    game_id: string
}

export default defineComponent({
    components: {
        Timer,
        Player,
        Opponent,
    },
    setup() {
        const id = ref('')
        const timer = ref(0)
        const waiting = ref(false)

        const attackerId = ref('')
        const attacker = ref<HTMLElement>()

        server.on('starting_hand', function (payload) {
            id.value = payload.game_id
            timer.value = payload.duration
        })

        server.on('wait_turn', function (payload: TurnPayload) {
            waiting.value = true
            timer.value = payload.duration
        })

        server.on('start_turn', function (payload: TurnPayload) {
            waiting.value = false
            timer.value = payload.duration
        })

        function endTurn() {
            server.send('end_turn', id.value)
        }

        function setAttacker(target: HTMLElement, minionId: string) {
            attacker.value = target
            attackerId.value = minionId
        }

        function attack(target: HTMLElement, minionId: string) {
            if (attackerId.value) {
                if (attacker.value) {
                    animate(attacker.value, target, function () {
                        server.send('attack', {
                            GameId: id.value,
                            Defender: minionId,
                            Attacker: attackerId.value,
                        })
                    })
                }
            }
        }

        function animate(attacker: HTMLElement, target: HTMLElement, callback: any) {
            const dest = target.getBoundingClientRect()
            const source = attacker.getBoundingClientRect()

            anime({
                scale: 1.2,
                zIndex: 99,
                duration: 500,
                easing: 'cubicBezier(0,.74,1,-0.31)',
                direction: 'alternate',
                targets: attacker,
                complete: callback,
                translateX: function () {
                    return dest.x - source.x
                },
                translateY: function () {
                    return (dest.y) - source.y
                },
            })

            /**
            anime({
                delay: 550,
                duration: 100,
                translateY: -10,
                targets: target,
                background: '#ffc2c2',
                direction: 'alternate',
                complete: callback,
            })
            */
        }

        return { id, timer, endTurn, waiting, attack, setAttacker }
    },
})
</script>

<template>
    <div class="game">
        <Timer v-model:duration="timer" class="game__timer" />

        <button @click="endTurn" :disabled="waiting" class="end-turn">
            {{ waiting ? 'Enemy Turn' : 'End Turn' }}
        </button>

        <Opponent
            :playing="waiting"
            @minion-selected="attack"
        />

        <Player
            :game-id="id"
            :playing="!waiting"
            @minion-selected="setAttacker"
        />
    </div>
</template>

<style scoped>
.game {
    width: 100%;
    height: 100vh;
}
.game__timer {
    top: 30px;
    left: 20px;
    position: fixed;
}
.end-turn {
    z-index: 99;
    position: relative;
}
</style>
