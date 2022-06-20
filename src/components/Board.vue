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
    setup(props) {
        const minions = ref<MapOfCards>({})

        server.on('card_played', function (payload: Card) {
            if (props.playing) {
                minions.value[payload.Id] = payload
            }
        })

        return { minions }
    },
})
</script>

<template>
    <div class="board">
        <Minion
            v-for="minion in minions"
            :minion="minion"
            :key="minion.Id"
        />
    </div>
</template>

<style scoped>
.board {
    gap: 10px;
    z-index: 99;
    display: flex;
    position: relative;
    align-items: flex-start;
    justify-content: center;
    height: calc(50vh - 200px);
}
.board--reverse {
    align-items: flex-end;
}
</style>
