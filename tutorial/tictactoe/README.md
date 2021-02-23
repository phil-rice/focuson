# This is a tutorial on how to create the react tic-tac-toe example using the lens for state management

The completed code for this tutorial can be found
at https://github.com/phil-rice/ts-lens-react/tree/master/examples/lens/tictactoe

Here is an example of redux and tictactoe. https://ramonvictor.github.io/tic-tac-toe-js/

# New react project

You can do this anyway you want. You could use

```shell
npx create-react-app tictactoe --template typescript
cd tictactoe
```

# Add dependencies

```shell
 yarn add @focuson/state
```

## Create the data representation

```typescript jsx
export interface GameData {
    next: NoughtOrCross,
    board: BoardData
}
type NoughtOrCross = "O" | "X" | ""
export interface BoardData {squares: SquareData}
type SquareData = NoughtOrCross[]

export let emptyGame: GameData = {
    "next": "X",
    "board": {
        "squares": ["", "", "", "", "", "", "", "", ""]
    }
}
```

## Components to view the data

```typescript jsx
export type GameProps<Main,T> = LensProps<GameDomain, Main, T>

export function SimpleGame<Main>({state}: GameProps<Main,GameData>) {
    return (
        <div className='game'>
            <NextMove state={state.focusOn('next')}/>
            <Board state={state.focusOn('board')}/>
        </div>)
}

export function NextMove<Main>({state}: GameProps<Main,NoughtOrCross>) {
    return (<div> Next Move{state.json()}</div>)
}

export function Board<Main>({state}: GameProps<Main,BoardData>) {
    let squares = state.focusOn('squares');
    let sq = (n: number) => (<Square state={focusOnNth(squares, n)}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

export function Square<Main>({state}: GameProps<Main,NoughtOrCross>) {
    return (<button className='square'>{state.json()}</button>)
}
```
The key to understanding this is understanding `context.focusOn`. This method creates a new context focused on 
a part of the `current json`. Focused on means that the we have json with the following two methods
* `json()`. This returns the json that the context is focused on
*  `setJson(j)`. This will create a copy of the main json, with `j` replacing whatever was being focused on

As example, if we are focused on a square, and call `setJson` the square will be 'set' to the new value. The word 'set'
is in quotes, because the state is not mutated: it is copied.

## The main 'loop'

```typescript jsx
let setJson = setJsonForFlux<GameData, void>('game', (s: LensState<GameData, GameData>): void =>
    ReactDOM.render(<SimpleGame state={s}/>, rootElement))
```

## Now we need to mutate the state

When we click a square there are two things that need to change
* The value of the square: set it to 'next value'
* The 'next value': invert it

We use the `useOtherLensAsWell ... transformTwoValues` pattern. This is given a lens and two functions. The following 
code demonstrates this. The two functions each get 'the current value' of the data the state is focused on, as well
as the 'current value' of the second lens. 


```typescript jsx
//We want a lens that is focused on 'the next state'
export let nextStateLens: Lens<GameData, NoughtOrCross> = Lenses.build<GameData>('game').focusOn('next')

function invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

const nextValueForSquare = (sq: NoughtOrCross, next: NoughtOrCross) => next;
const nextValueForNext = (sq: NoughtOrCross, next: NoughtOrCross) => invert(next);

export function Square({state}: GameProps<GameData, NoughtOrCross>) {
    let onClick = () => {
        if (state.json() == '')
            state.useOtherLensAsWell<NoughtOrCross>(nextStateLens).transformTwoValues(nextValueForSquare, nextValueForNext)
    }
    return (<button className='square' onClick={onClick}>{state.json()}</button>)
}
```

# Wrapping it up

The final code can be found [here](https://github.com/phil-rice/ts-lens-react/tree/master/examples/state/tictactoe)

