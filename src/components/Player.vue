<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from '../server'
import Hand from './Hand.vue'
import Board from './Board.vue'

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

        server.on('start_turn', function (payload) {
            maxMana.value = payload.mana
            curMana.value = maxMana.value
        })

        server.on('card_played', function (payload) {
            if (props.playing) {
                curMana.value -= payload.Mana
            }
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
        <Board
            :playing="playing"
            @minion-selected="(target, id) => $emit('minionSelected', target, id)"
        />

        <div class="player__portrait">
            <img src="http://placeimg.com/100/100/people" />
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
