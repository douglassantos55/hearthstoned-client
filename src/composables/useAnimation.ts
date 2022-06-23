import anime from 'animejs'
import type { Ref } from 'vue'
import { watch, reactive } from 'vue'

export default function(attrs: { [key: string]: Ref }) {
    const state = reactive<{ [key: string]: any }>({})

    for (const ref in attrs) {
        state[ref] = attrs[ref].value

        watch(attrs[ref], function(value: any) {
            anime({
                round: 1,
                duration: 1000,
                targets: state,
                [ref]: value,
            })
        })
    }

    return state
}
