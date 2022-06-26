<script lang="ts">
import { computed, defineComponent, onUnmounted } from 'vue'

export default defineComponent({
    props: {
        duration: {
            type: Number,
            required: true,
        }
    },
    setup(props, { emit }) {
        const ticker = computed(() => props.duration / 1000000000)

        const interval = setInterval(function () {
            emit('update:duration', props.duration - 1000000000)
        }, 1000)

        onUnmounted(function () {
            clearInterval(interval)
        })

        return { ticker }
    },
})
</script>

<template>
    <span class="timer" v-if="ticker > 0">{{ ticker }}</span>
</template>

<style scoped>
.timer {
    font-size: 30px;
    font-weight: bold;
}
</style>
