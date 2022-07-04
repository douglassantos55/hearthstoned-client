<script lang="ts">
import { defineComponent, ref } from 'vue'
import server from '@/server'
import Minion from './Minion.vue'
import type { Card, MapOfCards } from '@/types'
import useAnimation from '@/composables/useAnimation'

export default defineComponent({
    props: {
        player: {
            type: Boolean,
        },
        playing: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Minion,
    },
    setup(props, { emit }) {
        const { animate } = useAnimation()

        const selectedMinion = ref('')
        const minions = ref<MapOfCards>({})

        server.on('reconnected', function(payload) {
            console.log(props.player)
            if (props.player) {
                minions.value = payload.Player.Board.Minions
            } else {
                minions.value = payload.Opponent.Board.Minions
            }
        })

        server.on('card_played', function (payload: Card) {
            if (props.playing) {
                minions.value[payload.Id] = payload
                emit('minionPlayed', payload.Id)
            }
        })

        server.on('minion_taken_damage', function (payload) {
            if (minions.value[payload.Defender.Id]) {
                const defender = document.getElementById(payload.Defender.Id)
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
                        translateX: function () {
                            return dest.x - source.x
                        },
                        translateY: function () {
                            return (dest.y) - source.y
                        },
                        complete: function () {
                            minions.value[payload.Defender.Id] = {
                                ...minions.value[payload.Defender.Id],
                                Health: payload.Defender.Health,
                            }

                            setTimeout(function() {
                                if (payload.Defender.Health <= 0) {
                                    delete minions.value[payload.Defender.Id]
                                    emit('minionDestroyed', payload.Defender.Id)
                                }
                            }, 500)
                        },
                    })
                }
            }
        })

        server.on('attribute_changed', function (payload) {
            if (minions.value[payload.Id]) {
                minions.value[payload.Id] = {
                    ...minions.value[payload.Id],
                    State: payload.State,
                    Damage: payload.Damage,
                }
            }
        })

        function select(minionId: string) {
            if (props.playing) {
                selectedMinion.value = minionId
            }
            emit('minionSelected', minionId)
        }

        return { minions, select, selectedMinion }
    },
})
</script>

<template>
    <transition-group name="board" tag="div" class="board">
        <Minion
            :id="minion.Id"
            v-for="minion in minions"
            :minion="minion"
            :key="minion.Id"
            :playing="playing"
            @click="select(minion.Id)"
            :selected="selectedMinion == minion.Id"
        />
    </transition-group>
</template>

<style scoped>
.board {
    gap: 10px;
    z-index: 100;
    display: flex;
    position: relative;
    align-items: flex-start;
    justify-content: center;
    height: calc(50vh / 3);
}
.board--reverse {
    align-items: flex-end;
}
.board-enter-active,
.board-leave-active {
    transition: all 0.5s ease 0.5s;
}
.board-enter-from,
.board-leave-to {
    opacity: 0;
}
.board-enter-from {
    transform: scale(1.1);
    box-shadow: 0 0 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
