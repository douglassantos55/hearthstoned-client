<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Card } from '../types'

export default defineComponent({
    props: {
        card: Object as PropType<Card>,
    },
})
</script>

<template>
    <button class="card">
        <span class="card__item card__mana">{{ card.Mana }}</span>

        <span class="card__name">{{ card.Name }}</span>
        <span class="card__ability" v-if="card.Ability">
            {{ card.Ability.Description }}
        </span>

        <span class="card__item card__damage">{{ card.Damage }}</span>
        <span class="card__item card__health">{{ card.Health }}</span>
    </button>
</template>

<style scoped>
.card {
    z-index: 200;
    width: 150px;
    height: 190px;
    cursor: pointer;
    position: relative;
    border-radius: 5px;
    background: #f4f4f4;
    border: 1px solid #ccc;
    transition: all 0.1s ease-out;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
.card:hover {
    z-index: 201;
    transform: translateY(-20px) rotateZ(-1deg);
}
.card--selected {
    transform: translateY(-10px);
}
.card__item {
    color: #fff;
    padding: 2px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    line-height: 26px;
    font-weight: bold;
    position: absolute;
    border-radius: 100%;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}
.card__mana {
    top: -6px;
    left: -6px;
    background: #4f4ff1;
}
.card__name {
    left: 0;
    top: 40%;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    transform: translateY(-50%);
}
.card__ability {
    left: 0;
    top: 55%;
    width: 100%;
    padding: 5px 10px;
    position: absolute;
}
.card__damage {
    left: -6px;
    bottom: -6px;
    background: #a3a31c;
}
.card__health {
    right: -6px;
    bottom: -6px;
    background: #991919;
}
</style>
