<script lang="ts">
import anime from 'animejs'
import type { Card } from '@/types'
import useCardDetails from '@/composables/useCardDetails'
import { reactive, watch, defineComponent, type PropType, computed, ref } from 'vue'

type Minion = Card & {
    State: string
    Ability: { Description: string }
}

export default defineComponent({
    props: {
        playing: {
            type: Boolean,
            required: true,
        },
        selected: {
            type: Boolean,
        },
        minion: {
            type: Object as PropType<Minion>,
            required: true,
        },
    },
    setup(props) {
        const attrs = reactive({
            damage: props.minion.Damage,
            health: props.minion.Health,
        })

        const disabled = computed(function () {
            return props.minion.State == 'Exhausted' && props.playing
        })

        const { setCard, removeCard } = useCardDetails()

        watch(() => props.minion, function (minion: Card) {
            anime({
                round: 1,
                duration: 1000,
                targets: attrs,
                damage: minion.Damage,
                health: minion.Health,
            })
        })

        return { attrs, disabled, setCard, removeCard }
    },
})
</script>

<template>
    <div @mouseenter="setCard(minion)" @mouseleave="removeCard">
        <button :disabled="disabled" :class="['minion', {'minion--exhausted': disabled, 'minion--selected': selected}]">
            <div class="minion__name">
                {{ minion.Name }}
            </div>

            <div class="minion__ability" v-if="minion.Ability">
                <img src="thunder-icon.png" width="17" height="17" />
            </div>

            <div class="minion__stat minion__damage">{{ attrs.damage }}</div>
            <div class="minion__stat minion__health">{{ attrs.health }}</div>
        </button>
    </div>
</template>

<style>
</style>
<style scoped>
.minion {
    width: 100px;
    height: 120px;
    cursor: pointer;
    background: #ddd;
    position: relative;
    border-radius: 100%;
    border: 2px solid #aaa;
    font-family: sans-serif;
    transition: all 0.2s ease-out;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}
.minion:disabled {
    cursor: not-allowed;
}
.minion--exhausted:before,
.minion--exhausted:after {
    top: 0;
    right: 0;
    opacity: 0;
    color: #222;
    content: 'z';
    font-size: 10px;
    position: absolute;
    pointer-events: none;
    animation: floatUp 3s ease-out 0s infinite;
}
.minion--exhausted:after {
    animation-delay: 1.5s;
}
.minion--selected {
    transform: scale(1.1);
    box-shadow: 0 7px 9px rgba(0, 0, 0, 0.3);
}
.minion:hover,
.minion--selected {
    border-color: green;
}
.minion__name {
    top: 35%;
    width: 100%;
    text-align: center;
    padding: 0 10px;
    position: absolute;
    pointer-events: none;
}
.minion__stat {
    color: #fff;
    width: 25px;
    height: 25px;
    bottom: 15px;
    display: flex;
    font-weight: bold;
    position: absolute;
    border-radius: 100%;
    align-items: center;
    pointer-events: none;
    justify-content: center;
}
.minion__damage {
    left: 0;
    background: #a3a31c;
}
.minion__health {
    right: 0;
    background: #991919;
}
.minion__ability {
    left: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    bottom: -5px;
    background: #555;
    position: absolute;
    align-items: center;
    border-radius: 100%;
    pointer-events: none;
    border: 2px solid #888;
    justify-content: center;
    transform: translateX(-50%);
}
@keyframes floatUp {
    0% {
        transform: none;
    }
    25% {
        transform: translateX(-5px) translateY(-10px);
    }
    50% {
        opacity: 1;
        transform: translateX(5px) translateY(-20px);
    }
    100% {
        opacity: 0;
        font-size: 25px;
        transform: translateX(-5px) translateY(-40px);
    }
}
</style>
