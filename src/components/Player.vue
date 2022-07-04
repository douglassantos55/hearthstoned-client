<script lang="ts">
import { ref, toRefs, defineComponent } from 'vue'
import Hand from './Hand.vue'
import Board from './Board.vue'
import server from '@/server'
import useAttributes from '@/composables/useAttributes'
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
        const id = ref('')
        const curMana = ref(0)
        const maxMana = ref(0)
        const health = ref(30)

        const { animate } = useAnimation()
        const attrs = useAttributes({ health, curMana, maxMana })

        server.on('reconnected', function(payload) {
            id.value = payload.Player.Id
            curMana.value = payload.Player.Mana
            health.value = payload.Player.Health
            maxMana.value = payload.Player.MaxMana
        })

        server.on('start_turn', function (payload) {
            id.value = payload.player_id
            maxMana.value = payload.mana
            curMana.value = maxMana.value
        })

        server.on('card_played', function (payload) {
            if (props.playing) {
                curMana.value -= payload.Mana
            }
        })

        server.on('player_damage_taken', function (payload) {
            if (payload.Player.Id == id.value) {
                const defender = document.getElementById(payload.Player.Id)
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
                        complete: function () {
                            health.value = payload.Player.Health
                        },
                        translateX: function () {
                            return dest.x - source.x
                        },
                        translateY: function () {
                            return (dest.y) - source.y
                        },
                    })
                }
            }
        })

        function playCard(cardId: string) {
            server.send('play_card', {
                GameId: props.gameId,
                CardId: cardId,
            })
        }

        return {
            id,
            playCard,
            ...toRefs(attrs),
        }
    },
})
</script>

<template>
    <div class="player">
        <Board
            player
            :playing="playing"
            @minion-selected="id => $emit('minionSelected', id)"
        />

        <button :id="id" class="player__portrait">
            <img src="http://placeimg.com/100/100/people" />
            <span class="player__health">{{ health }}</span>
        </button>

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
    margin: auto;
    display: block;
    height: calc(50vh / 3);
}
.player__mana {
    right: 10px;
    bottom: 10px;
    font-size: 15px;
    position: fixed;
}
</style>
