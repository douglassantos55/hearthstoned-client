<script lang="ts">
import { defineComponent, ref } from 'vue'
import server from '@/server'
import Minion from './Minion.vue'
import type { Card, MapOfCards } from '@/types'

export default defineComponent({
    props: {
        playing: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Minion,
    },
    setup(props, { emit }) {
        const selectedMinion = ref('')
        const minions = ref<MapOfCards>({})

        server.on('card_played', function (payload: Card) {
            if (props.playing) {
                minions.value[payload.Id] = payload
                emit('minionPlayed', payload.Id)
            }
        })

        server.on('minion_destroyed', function (payload: Card) {
            if (minions.value[payload.Id]) {
                minions.value[payload.Id] = payload
                setTimeout(function () {
                    delete minions.value[payload.Id]
                    emit('minionDestroyed', payload.Id)
                }, 500)
            }
        })

        server.on('minion_taken_damage', function (payload: Card) {
            if (minions.value[payload.Id]) {
                minions.value[payload.Id] = payload
            }
        })

        server.on('attribute_changed', function (payload) {
            if (minions.value[payload.Id]) {
                minions.value[payload.Id] = payload
            }
        })

        function select(event: any, minionId: string) {
            if (props.playing) {
                selectedMinion.value = minionId
            }
            emit('minionSelected', event.target, minionId)
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
            @click.self="select($event, minion.Id)"
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
