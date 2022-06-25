import { ref } from 'vue'
import type { Card } from '../types'

const current = ref<Card>()

export default function() {
    function removeCard() {
        current.value = undefined
    }

    function setCard(card: Card) {
        if (current.value === undefined) {
            current.value = card
        }
    }

    return { card: current, setCard, removeCard }
}
