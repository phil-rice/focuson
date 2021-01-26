export class CounterDomain {}

export interface CounterData {value: number}

export interface TwoCounterData {
    counterOne: CounterData,
    counterTwo: CounterData
}

