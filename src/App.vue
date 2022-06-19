<script lang="ts">
import { ref, defineComponent } from 'vue'
import server from './server'
import Queue from './components/Queue.vue'
import StartingHand from './components/StartingHand.vue'

export default defineComponent({
    components: {
        Queue,
        StartingHand,
    },
    setup() {
        const state = ref('Queue')
        server.on('starting_hand', () => state.value = 'StartingHand')

        return { state }
    },
})
/*
const match = ref(null)
const game = ref(null)
const timeLeft = ref(0)
const waiting = ref(false)

const startingCards = ref(null)
const toDiscard = ref([])

const id = ref('')
const mana = ref(0)
const hand = ref([])
const board = ref([])
const attacker = ref(null)

const opponentMana = ref(0)
const opponentHand = ref(0)
const opponentBoard = ref([])

let ticker = null

ws.onmessage = function (message) {
    const data = JSON.parse(message.data)

    if (data.type == "wait_for_match") {
        waiting.value = true
    }

    if (data.type == 'confirm_match') {
        waiting.value = false
        match.value = data.payload
    }

    if (data.type == 'wait_other_players') {
        waiting.value = true
    }

    if (data.type == 'starting_hand') {
        match.value = null
        waiting.value = false

        id.value = data.payload.Id
        game.value = data.payload.game_id
        startingCards.value = data.payload.hand
        timeLeft.value = data.payload.duration / 1000000000;

        ticker = setInterval(function () {
            timeLeft.value -= 1
        }, 1000)
    }

    if (data.type == 'wait_other_players') {
        startingCards.value = null
        hand.value = data.payload
    }

    if (data.type == 'start_turn') {
        waiting.value = false
        timeLeft.value = data.payload.duration / 1000000000;
        hand.value = data.payload.cards
        mana.value = data.payload.mana
    }

    if (data.type == 'wait_turn') {
        waiting.value = true
        opponentMana.value = data.payload.mana
        opponentHand.value = data.payload.cards_in_hand
        timeLeft.value = data.payload.duration / 1000000000;
    }

    if (data.type == 'card_played') {
        if (waiting.value) {
            opponentHand.value--
            opponentMana.value -= data.payload.Mana
            opponentBoard.value.push(data.payload)
        } else {
            mana.value -= data.payload.Mana
            hand.value.splice(hand.value.findIndex(c => c.Id == data.payload.Id), 1)
            board.value.push(data.payload)
        }
    }

    if (data.type == 'minion_destroyed') {
        const index = board.value.findIndex()
    }

    if (data.type == 'attack_result') {
        board.value = Object.values(data.payload[0].Defenders).map(item => item.Defender)
        opponentBoard.value = Object.values(data.payload[1].Defenders).map(item => item.Defender)
    }

    if (data.type == 'error') {
        console.log(data.payload)
    }
}

function queueUp() {
    ws.send(JSON.stringify({ type: 'queue' }))
}

function confirm() {
    ws.send(JSON.stringify({ type: 'match_confirmed', payload: match.value }))
}

function cancel() {
    ws.send(JSON.stringify({ type: 'match_declined', payload: match.value }))
}

function discard() {
    ws.send(JSON.stringify({
        type: 'card_discarded',
        payload: {
            GameId: game.value,
            Cards: toDiscard.value
        }
    }))
}

function play(idx: number) {
    const card = hand.value[idx]
    ws.send(JSON.stringify({
        type: 'play_card',
        payload: {
            GameId: game.value,
            CardId: card.Id,
        },
    }))
}

function endTurn() {
    ws.send(JSON.stringify({ type: 'end_turn', payload: game.value }))
}

function attack(cardId: string) {
    ws.send(JSON.stringify({
        type: 'attack',
        payload: {
            GameId: game.value,
            Attacker: attacker.value,
            Defender: cardId
        },
    }))
}*/
</script>

<template>
    <Queue v-show="state == 'Queue'" />
    <StartingHand v-show="state == 'StartingHand'" />

    <!--
  <header>
  </header>

  <main>
    <button @click="queueUp" v-if="!match && !game" :disabled="waiting">Queue up</button>

    <button @click="confirm" v-if="match" :disabled="waiting">Confirm match</button>
    <button @click="cancel" v-if="match" :disabled="waiting">Cancel match</button>

    <button
        v-for="card in startingCards"
        :key="card.Id"
        @click="toDiscard.push(card.Id)"
        :disabled="toDiscard.indexOf(card.Id) != -1"
    >
        {{ card.Name }}<br>
        Damage: {{ card.Damage }}
        Health: {{ card.Health }}
        Mana: {{ card.Mana }}
    </button>

    <button @click="discard" v-if="startingCards">Confirm selection</button>

    <span v-if="timeLeft > 0">{{timeLeft}}</span>

    <div class="board">
        <button v-for="card in opponentBoard" :key="card.Id" @click="attack(card.Id)">
            {{ card.Name }}<br>
            Damage: {{ card.Damage }}
            Health: {{ card.Health }}
            Mana: {{ card.Mana}}
        </button>
    </div>

    <div class="board">
        <button v-for="card in board" :key="card.Id" @click="attacker = card.Id">
            {{ card.Name }}<br>
            Damage: {{ card.Damage }}
            Health: {{ card.Health }}
            Mana: {{ card.Mana}}
        </button>
    </div>

    <div class="hand">
        <button
            v-for="(card, idx) in hand"
            :key="card.Id"
            :disabled="waiting || card.Mana > mana"
            @click="play(idx)"
        >
            {{ card.Name }}<br>
            Damage: {{ card.Damage }}
            Health: {{ card.Health }}
            Mana: {{ card.Mana }}
        </button>
    </div>

    <button v-if="game" :disabled="waiting" @click="endTurn">End turn</button>

    <p v-if="game">{{ mana }}</p>
  </main>
  -->
</template>

<style>
* {
    box-sizing: border-box;
}
</style>
