<script lang="ts">
import { defineComponent } from 'vue'
import server from '@/server'
import CardComponent from './Card.vue'
import useCardDetails from '@/composables/useCardDetails'

export default defineComponent({
    components: {
        CardComponent,
    },
    setup() {
        const { card, setCard, removeCard } = useCardDetails()

        server.on('card_played', function (payload) {
            setCard(payload)
            setTimeout(removeCard, 1500)
        })

        server.on('minion_destroyed', function (payload) {
            if (payload.Id === card.value?.Id) {
                removeCard()
            }
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
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6);
}
.card-enter-active,
.card-leave-active {
    transition: all 0.5s ease;
}
.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: scale(1.5);
}
</style>
