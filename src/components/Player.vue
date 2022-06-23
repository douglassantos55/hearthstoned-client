<script lang="ts">
import { ref, toRefs, defineComponent } from 'vue'
import server from '../server'
import Hand from './Hand.vue'
import Board from './Board.vue'
import useAnimation from '@/composables/useAnimation'

export default defineComponent({
    name: 'Player',
    props: {
        playing: {
            type: Boolean,
            required: true,
        },
        gameId: {
            type: String,
            required: true,
        },
    },
    components: {
        Hand,
        Board,
    },
    setup(props) {
        const curMana = ref(0)
        const maxMana = ref(0)
        const health = ref(30)

        const attrs = useAnimation({ health, curMana, maxMana })

        server.on('start_turn', function (payload) {
            maxMana.value = payload.mana
            curMana.value = maxMana.value
        })

        server.on('card_played', function (payload) {
            if (props.playing) {
                curMana.value -= payload.Mana
            }
        })

        server.on('player_damage_taken', function (payload) {
            if (!props.playing) {
                health.value = payload.Health
            }
        })

        function playCard(cardId: string) {
            server.send('play_card', {
                GameId: props.gameId,
                CardId: cardId,
            })
        }

        return {
            playCard,
            ...toRefs(attrs),
        }
    },
})
</script>

<template>
    <div class="player">
        <Board
            :playing="playing"
            @minion-selected="(target, id) => $emit('minionSelected', target, id)"
        />

        <div class="player__portrait">
            <img src="http://placeimg.com/100/100/people" />
            <span class="player__health">{{ health }}</span>
        </div>

        <Hand @play-card="playCard" />

        <span class="player__mana">
            {{ curMana }}/{{ maxMana }}
        </span>
    </div>
</template>

<style scoped>
.player {
    left: 0;
    bottom: 1%;
    width: 100%;
    height: 50vh;
    position: fixed;
}
.player__portrait {
    text-align: center;
    height: calc(50vh / 3);
}
.player__mana {
    right: 10px;
    bottom: 10px;
    font-size: 15px;
    position: fixed;
}
</style>
