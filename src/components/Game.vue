<script lang="ts">
import { ref, defineComponent } from 'vue'
import anime from 'animejs'
import server from '../server'
import type { Card } from '../types'
import Timer from './Timer.vue'
import Player from './Player.vue'
import Opponent from './Opponent.vue'
import PlayedCard from './PlayedCard.vue'
import Error from './Error.vue'
import Result from './Result.vue'
import useRouter from '@/composables/useRouter'

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
        Error,
        Player,
        Result,
        Opponent,
        PlayedCard,
    },
    setup() {
        const { route } = useRouter()

        const result = ref('')
        const waiting = ref(false)
        const id = ref(route.state.game_id)
        const timer = ref(route.state.duration)

        const attackerId = ref('')
        const attacker = ref<HTMLElement>()

        server.on('win', function () {
            setTimeout(function () {
                timer.value = 0
                result.value = 'win'
            }, 1200)
        })

        server.on('loss', function () {
            setTimeout(function () {
                timer.value = 0
                result.value = 'loss'
            }, 1200)
        })

        server.on('wait_turn', function (payload: TurnPayload) {
            waiting.value = true
            timer.value = payload.duration

            anime({
                targets: '.opponent-turn',
                opacity: 1,
                translateX: ['-50%', '-50%'],
                translateY: ['-100%', '-50%'],
                duration: 1000,
                direction: 'alternate',
            })
        })

        server.on('start_turn', function (payload: TurnPayload) {
            waiting.value = false
            timer.value = payload.duration

            anime({
                targets: '.your-turn',
                opacity: 1,
                translateX: ['-50%', '-50%'],
                translateY: ['-100%', '-50%'],
                duration: 1000,
                direction: 'alternate',
            })
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

        function attackPlayer(target: HTMLElement, playerId: string) {
            if (attackerId.value) {
                if (attacker.value) {
                    animate(attacker.value, target, function () {
                        server.send('attack_player', {
                            GameId: id.value,
                            Defender: playerId,
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
        }

        return { id, timer, result, endTurn, waiting, attack, setAttacker, attackPlayer }
    },
})
</script>

<template>
    <div class="game">
        <Error />
        <Result :result="result" v-if="result" />
        <PlayedCard class="game__played-card" />
        <Timer v-model:duration="timer" class="game__timer" />

        <h1 class="your-turn">It's your turn!</h1>
        <h1 class="opponent-turn">Opponent's turn!</h1>

        <button @click="endTurn" :disabled="waiting" class="end-turn">
            {{ waiting ? 'Enemy Turn' : 'End Turn' }}
        </button>

        <Opponent
            :playing="waiting"
            @minion-selected="attack"
            @player-selected="attackPlayer"
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
    z-index: 700;
    position: fixed;
}
.game__played-card {
    top: 50%;
    left: 50px;
    z-index: 300;
    position: fixed;
    transform: translateY(-50%);
}
.end-turn {
    top: 50%;
    border: 0;
    right: 30px;
    color: #fff;
    z-index: 400;
    cursor: pointer;
    position: fixed;
    padding: 15px 20px;
    background: #4f4ff1;
    border-radius: 10px;
    transform: translateY(-50%);
}
.end-turn:disabled {
    background: #ddd;
    cursor: not-allowed;
}
.your-turn, .opponent-turn {
    top: 50%;
    left: 50%;
    margin: 0;
    opacity: 0;
    z-index: 300;
    position: fixed;
    font-size: 60px;
    white-space: nowrap;
    pointer-events: none;
    transform: translate(-50%, -100%);
}
</style>
