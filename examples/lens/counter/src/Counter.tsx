import {LensProps} from "../../..";
import * as React from 'react'
import ReactDOM from 'react-dom';
import {emptyGame, GameData, GameDomain, nextStateLens, SimpleGame} from "../../tictactoe/src/game";
import {getElement, LensContext} from "@phil-rice/lens";


class CounterDomain{}

interface TwoCounterData{valueOne: CounterData, valueTwo: CounterData}
interface CounterData{value: number}

let domain = new GameDomain(nextStateLens)
let rootElement = getElement("root");


export function Counter<Main>(props: LensProps<CounterDomain, Main, CounterData>){
    let value = props.context.json().value
    let increment=() => this.props.context.setJson(value + 1)
    let decrement=() => this.props.context.setJson(value - 1)
    return(  <p>
            Clicked: {value} times
            {' '}<button onClick={increment}>+</button>
            {' '}<button onClick={decrement}>-</button>
        </p>
    )
}

export function TwoCounter<Main>(props: LensProps<CounterDomain, Main, TwoCounterData>){
    return(<div>
        <Counter context={props.context.focusOn('valueOne')} />
        <Counter context={props.context.focusOn('valueOne')} />
        </div>    )
}

let setJson = LensContext.setJsonForReact<CounterDomain, CounterData>(domain, 'counter',
    c => (ReactDOM.render(<Counter context={c}/>, rootElement)))

setJson({value: 0})


