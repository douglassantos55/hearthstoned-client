<script lang="ts">
import { defineComponent } from 'vue'
import useRouter from './composables/useRouter'

export default defineComponent({
    setup() {
        const { view } = useRouter()
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
