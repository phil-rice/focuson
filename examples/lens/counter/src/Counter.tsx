
import {LensProps} from "@phil-rice/lens";
import {CounterData, CounterDomain, TwoCounterData} from "./domain";

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
