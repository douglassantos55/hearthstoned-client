<script lang="ts">
import { defineComponent, ref } from 'vue'
import server from '@/server'
import type { Card } from '@/types'
import CardComponent from './Card.vue'

export default defineComponent({
    components: {
        CardComponent,
    },
    setup() {
        const card = ref<Card>()

        server.on('card_played', function (payload) {
            card.value = payload
            setTimeout(function () {
                card.value = undefined
            }, 1700)
        })

        return { card }
    },
})
</script>

<template>
    <div class="played-card">
        <transition name="card">
            <CardComponent :card="card" v-if="card" />
        </transition>
    </div>
</template>

<style scoped>
.played-card .card {
    pointer-events: none;
    transform: scale(1.3);
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);
}
.card-enter-active,
.card-leave-active {
    transition: all 1s ease 0.5s;
}
.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: scale(1.5);
}
</style>
