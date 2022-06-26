<script lang="ts">
import useRouter from '@/composables/useRouter'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        result: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const { redirect } = useRouter()

        const title = computed(function () {
            return props.result == 'win' ? 'Victory!' : 'Defeat!'
        })

        return { title, redirect }
    },
})
</script>

<template>
    <Teleport to="body">
        <div class="wrapper">
            <div class="modal">
                <h1 class="title">{{ title }}</h1>
                <button class="continue" @click="redirect('/')">Continue</button>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.wrapper {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 400;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}
.modal {
    min-width: 320px;
    display: flex;
    padding: 50px;
    background: #fff;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
.title {
    font-size: 50px;
    font-family: sans-serif;
}
.continue {
    border: 0;
    padding: 15px 30px;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    border-radius: 10px;
    font-size: 20px;
    background: green;
    margin-top: 50px;
}
</style>
