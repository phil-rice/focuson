# What is this project?

While react is a great project, react state management leaves much to be desired. Most comparisons of frameworks such as
angular and react will list the issue that 'state management in react is difficult'.

Redux is one of the obvious candidates for state management, but it is difficult to use and full of boilerplate code.
The pieces in redux are not easy to change or reuse. This project you are looking at now arose out of a refactoring of
redux projects. By utilising a functional programming technique known as optics, and more specifically lens, much of the
complexity of redux vanishes.

One of things I don't like about redux is that actions can do 'anything'. A second is that it is very hard to combine actions together: they
are designed as 'atomic standalone components' rather than as 'composible unit'. The project gives the following benefits:
* A much simpler and easier to read model of state management
* Composability so it is as easy to plug the state management together as it is to plug the components together
* Much stronger protection about what the equivalent of actions can and cannot do

With this project we have the idea that a lens is focused on a bit of the state. With this state management,components display a subset of the json
(just like in redux), and components can normally change just that bit of the json (unlike redux where there is no such
protection).

# Getting started

## Download

```shell
npm install @focuson/state
````

## Related projects

This code uses the lens defined [here](https://github.com/phil-rice/ts-lens-react/tree/master/modules/lens). The
README introduces Lens.

## Tutorials
* [Getting started with a simple counter example](https://github.com/phil-rice/ts-lens-react/tree/master/tutorial/counter)
* [A more complicated example](https://github.com/phil-rice/ts-lens-react/blob/master/tutorial/tictactoe)

## Examples
 * [@focuson/example_state_cpq - the Redux 'counter' example](https://github.com/phil-rice/ts-lens-react/tree/master/examples/state/counter)
 * [@focuson/example_state_cpq - A 'configure price quote' example](https://github.com/phil-rice/ts-lens-react/tree/master/examples/state/cpq)
 * [@focuson/example_state_cart - The Redux 'shopping cart' example](https://github.com/phil-rice/ts-lens-react/tree/master/examples/state/shopping-cart)
 * [@focuson/example_state_tictactoe - The React tictactoe example](https://github.com/phil-rice/ts-lens-react/tree/master/examples/state/tictactoe)

# When should I use this project

This project isn't suitable for everything. It works best when the rendering and editing of a bit piece of state is
split across multiple components. If there are many components that change many parts of state simultaneously then
perhaps redux is better suited. If instead your display is split up with a 'editor component' that displays part of the
state and lets you change that part of the state, then this project is the clear winner


# Presentation

[This presentation details how the react lens works](https://docs.google.com/presentation/d/e/2PACX-1vRvIfvQHiMw10X9bAek_hK1eE6WDqP8V4X85fJ8gT4RaQU9mPh9yu9j0bRpLnfKEptqwpLqowGy43vK/pub?start=false&loop=false&delayms=3000)


### What is cool about Lens

They are composable and simple. Given a `Lens<Main,Child>` and `Lens<Child,GrandChild>` we can create a lens from `Main`
to `GrandChild`.

```typescript
let msgToCupLens = Lens.build<Msg>('msg').focusOn('order').focusOn('cup')
let cupToMadeofLens = Lens.build<Cup>('cup').focusOn('madeOf')
let msgToMadeOfLens = msgToCupLens.andThen(cupToMadeofLens)
```

# Lens state

There are many uses cases (like a react gui) where there is a 'main json' and different components are responsible for
different parts. `LensState` represents this. Internally it has the following

* `main`... the main json
* `lens` ... a lens to the bit of json we are interested
* `dangerouslySetMain` This should not be directly called. It sets the state in the react application. Normally it is
  called by methods that provide cleaner access.

We use `LensState` extensively in our react state management. The most used methods/fields on the context are

* `json()` returns the json that the context is focused on
* `setJson(j)` Uses the lens to make a new 'main json'. Precisely what else happens is determined at the time the
  context is created. In the react statemanagement this causes a clean re-render
* `focusOn(fieldName)` Returns a new context with a lens focused on the field name

The following shows how focusOn is used to create a context suitable for child components, and how we use `.json()` to
access the component's json
```typescript jsx
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
```

This example shows how we can use the setJson method. Note that if we wanted to we could inject the increment and decrement methods,
but in this example I think the code is much cleaner as it is.

```typescript jsx
export function Counter<Main>({context}: LensProps<CounterDomain, Main, CounterData>) {
    let value = context.json().value
    let increment = () => context.setJson({value: value + 1})
    let decrement = () => context.setJson({value: value - 1})
    return (<p>Clicked: {value} times
            {' '}<button onClick={increment}>+</button>
            {' '}<button onClick={decrement}>-</button></p>)
}
```

# More complicated methods

It is quite common to want to change two parts of the state simultaneously. For example if we are the tictactoe came and click on a square, the lens
for the component displaying the square is 'focusedon' the square. As well as wanting to change the square we also want to change the 'next value'.

Here we are setting the two values explicitly
```typescript
//Setting the values explicitly
let nextStateLens: Lens<GameData, NoughtOrCross> = Lenses.build<GameData>('game').focusOn('next')
let squareValue='X'
let nextValue= 'O'
context.useOtherLensAsWell<NoughtOrCross>(nextStateLens).setTwoValues(squareValue,nextValue)
```

It is more common to want to have the new values a function of the old. Here we see `transformTwoValues`. 
```typescript
let nextStateLens: Lens<GameData, NoughtOrCross> = Lenses.build<GameData>('game').focusOn('next')
let nextValueForSquare = (sq: NoughtOrCross, next: NoughtOrCross) => next;
let nextValueForNext = (sq: NoughtOrCross, next: NoughtOrCross) => invert(next);
context.useOtherLensAsWell<NoughtOrCross>(nextStateLens).transformTwoValues(nextValueForSquare, nextValueForNext)
```

# Theoretical musings about quality

For me quality is about four things. I've included what is for me the reason I care about each thing. These qualities
are all about 'how easy is it to change my software' and 'how easy is it to test my software'

* Composability (how easy can I 'plug these things together'?)
* Decoupling (how many lines of code are impacted when I make a change?)
* Cohesion (how many windows do I have to open to see one aspect of the code?)
* Readability of the result (Can I come back in six months and still understand it?)

In all but decoupling I feel this state management is a clear improvement over redux.When it comes to decoupling
my experience in the projects I have looked at, this lens approach is usually better as most redux actions become bound
to the structure. However there are projects I can visualise where redux would be more decoupled (especially if the
redux actions actually used lens)

Certainly the ability to test the code is (in my experience) far easier than with redux.
