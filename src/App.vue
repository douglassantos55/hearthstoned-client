<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import server from './server'
import useRouter from './composables/useRouter'

export default defineComponent({
    setup() {
        const { view } = useRouter()
        server.connect('ws://0.0.0.0:8080')

        onUnmounted(server.close)

        return { view }
    },
})
</script>

<template>
    <component :is="view" />
</template>

<style>
* {
    box-sizing: border-box;
}
html, body {
    margin: 0;
}
</style>
