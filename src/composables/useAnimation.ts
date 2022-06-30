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

function animate(target: Element, config: AnimeParams) {
    queue.push({ ...config, targets: target })
}

function play(target: Element, config: AnimeParams) {
    anime({ ...config, targets: target })
}

export default function() {
    return { playing, play, animate }
}
