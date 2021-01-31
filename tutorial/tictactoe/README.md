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
 yarn add @phil-rice/lens
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

export function SimpleGame<Main>({context}: GameProps<Main,GameData>) {
    return (
        <div className='game'>
            <NextMove context={context.focusOn('next')}/>
            <Board context={context.focusOn('board')}/>
        </div>)
}

export function NextMove<Main>({context}: GameProps<Main,NoughtOrCross>) {
    return (<div> Next Move{context.json()}</div>)
}

export function Board<Main>({context}: GameProps<Main,BoardData>) {
    let squares = context.focusOn('squares');
    let sq = (n: number) => (<Square context={focusOnNth(squares, n)}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

export function Square<Main>({context}: GameProps<Main,NoughtOrCross>) {
    return (<button className='square'>{context.json()}</button>)
}
```
The key to understanding this is understanding `context.focusOn`. This method creates a new context focused on 
a part of the `current json`. Focused on means that the we have json with the following two methods
* `json()`. This returns the json that the context is focused on
*  `setJson(j)`. This will create a copy of the main json, with `j` replacing whatever was being focused on

As example, if we are focused on a square, and call `setJson` the square will be 'set' to the new value. The word 'set'
is in quotes, because the state is not mutated: it is copied.

## The main loop

```typescript jsx
let setJson = LensContext.setJsonForReact<GameDomain, GameData>(domain, 'game',
                          c => (ReactDOM.render(<SimpleGame context={c}/>, rootElement)))
setJson(emptyGame)
```

## Now we need to mutate the state

When we click a square there are two things that need to change
* The value of the square: set it to 'next value'
* The 'next value': invert it

There are a number of options we could have chosen for how to mutate the state that isn't our primary focus. The one
selected is to have a lens from the  `GameData` to the `next value`. There is a nice property of these lens that if 
we combine two lens we can end up with a new lens.

```typescript jsx
export class GameDomain {
    nextStateLens = Lens.build<GameData>('game').field('next')
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')};
    setSquareAndInvertNext<Main>(context: LensContext<GameDomain, GameData, NoughtOrCross>) {
        let next = context.jsonFromLens(this.nextStateLens)
        if (context.json() === '')
            context.setFromTwo(this.nextStateLens, next, this.invert(next))
    }
}
```

There are three moving parts here
* `nextStateLens` This is a lens from GameData to `next`.
* `invert` Given a NoughtOrCross it returns the inverted NoughtOrCross
* `setSquareAndInvertNext`. 
    * `let next = context.jsonFromLens(domain.nextStateLens)` This retrieves the value of `next` from the current state
    * `if (context.json() === '')` We only set the value if it's not already empty. `context.json()` is the current square in this case
    * `context.setFromTwo(this.nextStateLens, next, this.invert(next))` 
        * The context has a built in lens
        * `this.nextStatelens` is the lens from the main data to the `nextState`
        * `next` is the value that will be written to the `context built in lens`
        * `this.invert(next)` is the value that will be written to `next`
        
The only complicated thing here is the `context.setFromTwo`. It is quite a common thing to want to modify
two parts of the data, so there is a helper method

We also need to add an onClick method

```typescript jsx
export function Square<Main>({context}: GameProps<Main,NoughtOrCross>) {
    return (
        <button className='square' onClick={() => context.domain.setSquareAndInvertNext(context)}>
            {context.json()}
        </button>)
}
```



