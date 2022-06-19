<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from '../server'
import Hand from './Hand.vue'

export default defineComponent({
    name: 'Player',
    props: {
        gameId: {
            type: String,
            required: true,
        },
    },
    components: {
        Hand,
    },
    setup(props) {
        const curMana = ref(0)
        const maxMana = ref(0)
        const health = ref(30)

        server.on('start_turn', function (payload) {
            maxMana.value = payload.mana
            curMana.value = maxMana.value
        })

        server.on('card_played', function (payload) {
            curMana.value -= payload.Mana
        })


        function playCard(cardId: string) {
            server.send('play_card', {
                GameId: props.gameId,
                CardId: cardId,
            })
        }

        return {
            curMana,
            maxMana,
            health,
            playCard,
        }
    },
})
</script>

<template>
    <div class="player">
        <span class="player__mana">
            {{ curMana }}/{{ maxMana }}
        </span>

        <Hand
            class="player__hand"
            @play-card="playCard"
        />
    </div>
</template>

<style scoped>
.player__mana {
    right: 10px;
    bottom: 10px;
    font-size: 15px;
    position: fixed;
}
.player__hand {
    left: 0;
    bottom: 10px;
    position: fixed;
}
</style>
