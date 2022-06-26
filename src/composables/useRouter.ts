import { computed, reactive } from "vue"
import Game from '../components/Game.vue'
import Queue from '../components/Queue.vue'

const routes: Record<string, any> = {
    '^/$': Queue,
    '^/game/(.+)': Game,
}

type Route = {
    url: string
    params: string[]
    state: Record<string, any>
}

const route = reactive<Route>({
    state: {},
    params: [],
    url: window.location.pathname,
})

const view = computed(() => {
    for (const url in routes) {
        const matches = route.url.match(url)
        if (matches) {
            route.params = matches.slice(1)
            return routes[url]
        }
    }
})

function redirect(url: string, state = {}) {
    route.url = url
    route.state = state
    window.history.pushState(state, '', url)
}

window.addEventListener('popstate', function(event: PopStateEvent) {
    route.url = window.location.pathname
    route.state = event.state
})

export default function() {
    return { route, view, redirect }
}
