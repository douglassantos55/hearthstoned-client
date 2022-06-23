<script lang="ts">
import server from '@/server'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const errors = ref<string[]>([])

        server.on('error', function (payload: string) {
            errors.value.push(payload)
            setTimeout(function () {
                errors.value.pop()
            }, 3000)
        })

        return { errors }
    },
})
</script>

<template>
    <Teleport to="body">
        <div class="errors">
            <div class="error" v-for="(error, idx) in errors" :key="idx">
                {{ error }}
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.errors {
    top: 10px;
    gap: 20px;
    right: 10px;
    z-index: 2000;
    display: flex;
    position: fixed;
    flex-direction: column;
}
.error {
    color: #fff;
    padding: 10px;
    background: red;
    display: inline-block;
}
</style>
