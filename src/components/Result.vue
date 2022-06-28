<script lang="ts">
import { computed, defineComponent } from 'vue'
import useRouter from '@/composables/useRouter'
import Button from './Button.vue'

export default defineComponent({
    props: {
        result: {
            type: String,
            required: true,
        },
    },
    components: {
        Button,
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

                <Button
                    large
                    @click="redirect('/')"
                    :danger="result == 'loss'"
                    :success="result == 'win'"
                >
                    Continue
                </Button>
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
</style>
