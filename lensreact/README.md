# Lens and react

This project is presenting an alternative and much simpler approach to state management than either redux or the context.

# If this project is about react, why is react not in package.json
This project has very few dependencies, and react is not one of them. The use of the generic 'ReactElement' is 
used to indicate the generic should be replaced in usage with `React.ReactElement`. This means that the library can
be used with pretty much any version of React, and won't need to be constantly published and updated.

## Lens for state in react

React is a great library but is un-opinionated about how state should be managed. Redux is 
one library for doing this, and it's a fine library but is too complicated and brittle  for my liking. It produces code that 
is verbose, hard to 'explain to my mother', and it's looses cohession (although it has excellent decoupling). 
* By 'looses' cohession I mean that the information about a component is scattered through the code base, and its not easy to
see from looking at the object what is happening (the dispatch methods and the actions and ... as well as the component itself)
** The decoupling is great
** Actions can do anything and the more things a thing could do, the less you know about what is actually happening.
*** In this approach, the components should just 'update the json'. There maybe a sideeffect when the json is updated, 
but that's the same sideeffect for every update. (for example send the json to the server, get new json and re-render it)

### A description of many systems
There are many cases in which there is a 'single block of json' representing the state, and 
each react component is primarily focused on one part of it.

For example in a CPQ (configuration/price/quotation) for a cup of coffee, we might
have components for 'milk type selector', others for 'type of drink'. Each of these components is
primarily about a field or an object in the block of json, although it might have a secondary
place.

A good example of a secondary place is in the 'tutorial' for react. The square component is
primarily about the square (which is a string in an array of strings), but the onclick event can
modify the 'next state' which is about 'the game' and not 'the square'

### Why is react brittle
React allows a function for each component to get the 'part of the state we are interested in'.
This is usually implemented in a non composable approach: the function is about 'from the big to me', and if the structure changes pretty 
much each function needs to change. 

A component needs to know about 'the big picture'. Or at least this function does. And the wiring needs to be done in a difficult
to compose way. If I want to reuse a component I need to wire it into the new world

### Let's have a state management system that is easy in this world
In the 'coffee' example, there is an assumption that an api is being called to find details about
what the price of the coffee is, and what are legal options...
For example if the customer has selected tea, there is no need to ask them 'do they want an extra shot'.

In systems I am working with at the moment, this business logic is all on the server, but we want react to 
be able to render up the world.

### Lens to the rescue
Lens can be thought of 'focusing on a block of json'. If we have our coffee example, we can imagine a lens that focuses in on the
'what size of cup' part. This lens allows the component to just edit the 'what size of cup' easily, and the lens takes care of the problem of
copying the immutable parts.

#### Example of immutable state change without lens

```let json: Msg = {
    order: {
        cup: {
            size: "small",       // medium large
            madeOf: "styrofoam"  // or you could be eating in and it be a proper cup
        },
        milk: {
            type: "almond",
            amount: "splash"
        },
        shots: 1
    }
}
```

If we want to 'get and set' the cup size (in immutable world we make a copy and 'set' the value in the copy) it might look like this
```function getCupSize(json: Msg) {return json.order.cup.size}
function setCupSize(json: Msg, size: Cupsize): Msg {
    return ({
        ...json,
        order: {
            ...json.order,
            cup: {
                ...json.order.cup, size
            }
        }
    })
}
```

With lens it might look like this 
```
let msgToCupsizeLens = Lens.build<Msg>().then('order').then('cup').then('size')
let getCupSize= msgToCupsizeLens.get
let setCupSize= msgToCupsizeLens.get
```
As well as being much more intention revealing, it is simpler and much less error prone. 

### Uses lens to manage state in React

Let's look at how we might code up the 'tutorial'

Things to look at:
* How easy it is to 'focus' a child component on a part of the whole
* The only place that changes state is the onclick method
** This is actually a little bit hard... it changes two places: the game state and the state need to be changed
** the business logic is in 'domain'
** and ... I'll be trying to clean this up and that bit simpler and more intention revealing

```
export type NoughtOrCross = "O" | "X" | ""

export interface GameData extends SelfLink {
    state: NoughtOrCross
    _embedded: { board: BoardData }
}

export interface BoardData extends SelfLink {
    squares: SquareData
}
export type SquareData = NoughtOrCross[]

type GameProps<Main, T> = LensProps<Domain, React.ReactElement, Main, T>

class Domain {
    stateLens: Lens<GameData, NoughtOrCross>  =Lens.build<GameData>().field('state');
    constructor(stateLens: Lens<GameData, NoughtOrCross>) { this.stateLens = stateLens;}
    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}
    setSquareAndToggleState = (context: LensContext<Domain, React.ReactElement, GameData, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)
}

function SimpleGame(props: GameProps<GameData, GameData>) {
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board(props: GameProps<GameData, BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

function Square(props: GameProps<GameData, NoughtOrCross>) {
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}

let element = getElement("root")
let gameDomain: Domain = new Domain(defaultStateLens)
LensContext.setJson<Domain, React.ReactElement, GameData>(gameDomain, element, c => (ReactDOM.render(<SimpleGame context={c}/>, element)))
```
# Comparing the above to react/redux

The wiring is done by the parent: the parent just tells the child what to focus on
```
function SimpleGame(props: GameProps<GameData, GameData>) {
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}
function Board(props: GameProps<GameData, BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}
```
Note how the wiring is done. The context tells the child to 'focusOn' a part of the json. That's it. 

If the structure of the json changes (for example we delete the `_embedded`, then the only place that needs to know is the link
between the game and the board




