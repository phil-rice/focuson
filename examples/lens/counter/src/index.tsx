import * as React from 'react'
import ReactDOM from 'react-dom';

import {getElement, LensContext, LensProps} from "@phil-rice/lens";


class CounterDomain {}

interface CounterData {value: number}
interface TwoCounterData {
    counterOne: CounterData,
    counterTwo: CounterData
}


let domain = new CounterDomain() // Domains are to allow us to dependancy inject things. We don't need it with this simple example

let rootElement = getElement("root");

export function Counter<Main>({context}: LensProps<CounterDomain, Main, CounterData>) {
    let value = context.json().value
    let increment = () => context.setJson({value: value + 1})
    let decrement = () => context.setJson({value: value - 1})
    return (<p>
            Clicked: {value} times
            {' '}
            <button onClick={increment}>+</button>
            {' '}
            <button onClick={decrement}>-</button>
        </p>
    )
}

export function TwoCounter<Main>({context}: LensProps<CounterDomain, Main, TwoCounterData>) {
    return (<div>
        <Counter context={context.focusOn('counterOne')}/>
        <Counter context={context.focusOn('counterTwo')}/>
    </div>)
}

let setJson = LensContext.setJsonForReact<CounterDomain, TwoCounterData>(domain, 'counter',
    c => (ReactDOM.render(<TwoCounter context={c}/>, rootElement)))

setJson({counterOne: {value: 0}, counterTwo: {value: 0}})


