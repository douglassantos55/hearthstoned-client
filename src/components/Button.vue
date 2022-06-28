<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        danger: Boolean,
        success: Boolean,
        large: Boolean,
    },
    setup() {
    },
})
</script>

<template>
    <button
        type="button"
        :class="[
            'btn',
            {
                'btn--lg': large,
                'btn--success': success,
                'btn--danger': danger,
            }
        ]"
    >
        <slot />
    </button>
</template>


<style scoped>
.btn {
    border: 0;
    color: #fff;
    cursor: pointer;
    padding: 15px 20px;
    background: #4f4ff1;
    border-radius: 10px;
}
.btn--lg {
    font-size: 16px;
    padding: 17px 35px;
}
.btn--success {
    background-color: green;
}
.btn--danger {
    background-color: red;
}
.btn:disabled {
    background: #ddd;
    cursor: not-allowed;
}
</style>
