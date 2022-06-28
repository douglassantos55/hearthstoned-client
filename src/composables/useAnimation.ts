import { ref, reactive, watch } from 'vue'
import anime, { type AnimeParams } from 'animejs'

const playing = ref(false)
const queue = reactive<AnimeParams[]>([])

watch(queue, function(queue) {
    if (!playing.value) {
        if (queue.length > 0) {
            playing.value = true

            const config = queue[0]
            const animation = anime(config)

            animation.finished.then(function() {
                setTimeout(function() {
                    playing.value = false
                    queue.shift()
                }, 500)
            })
        }
    }
})


export default function() {
    function animate(target: Element, config: AnimeParams) {
        console.log(target, config)
        queue.push({ ...config, targets: target })
    }

    return { playing, animate }
}
