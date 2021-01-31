import {PartialProfunctor} from "../profunctor/Profunctor";

export class MetricsStore {
    counts = new Map
    occured(msg: string) {
        if (this.counts.has(msg)) {
            this.counts.set(msg, this.counts.get(msg) + 1)
        } else
            this.counts.set(msg, 1)
    }
}

export function metricsProfunctor(metricStore: MetricsStore): PartialProfunctor {
    return {
        name: "metricsProfunctor",
        pre(msg) { },
        post(msg, input, output) { metricStore.occured(msg) }
    }
}