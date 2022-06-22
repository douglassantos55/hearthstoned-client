<script lang="ts">
import anime from 'animejs'
import type { Card } from '@/types'
import { reactive, watch, defineComponent, type PropType } from 'vue'

export default defineComponent({
    props: {
        selected: {
            type: Boolean,
        },
        minion: {
            type: Object as PropType<Card>,
            required: true,
        },
    },
    setup(props) {
        const attrs = reactive({
            damage: props.minion.Damage,
            health: props.minion.Health,
        })

        watch(() => props.minion, function (minion: Card) {
            anime({
                round: 1,
                duration: 1000,
                targets: attrs,
                damage: minion.Damage,
                health: minion.Health,
            })
        })

        return { attrs }
    },
})
</script>

<template>
    <div :class="['minion', {'minion--selected': selected}]">
        <div class="minion__name">{{ minion.Name }}</div>
        <div class="minion__stat minion__damage">{{ attrs.damage }}</div>
        <div class="minion__stat minion__health">{{ attrs.health }}</div>
    </div>
</template>

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
.minion--selected {
    transform: scale(1.1);
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
}
.minion:hover {
    border-color: green;
}
.minion__name {
    top: 35%;
    width: 100%;
    text-align: center;
    padding: 0 10px;
    position: absolute;
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
</style>
