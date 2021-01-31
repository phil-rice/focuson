//Copyright (c)2020-2021 Philip Rice. <br />Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the Software), to dealin the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  <br />The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED AS
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