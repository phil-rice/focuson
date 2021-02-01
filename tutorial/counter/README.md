# This is a tutorial on how to create a counter using the lens for state management

The completed code for this tutorial can be found at https://github.com/phil-rice/ts-lens-react/tree/master/examples/lens/counter

It is based on the redux counter example https://github.com/reduxjs/redux/tree/master/examples/counter/src. It is 
well worth comparing the two, as this very simple case highlights the improvements in readability and maintainability

* Readability: count the number of webpages/ide pages you need to have open to understand the redux code, and compare that with this approach. Look at the amount of boilerplate code you need for redux and compare that with this approach
* Maintainability: at the end of this tutorial we extend the gui to have two counters. It is the work of seconds. Try that with redux, and then weep. Most of the redux code needs to be thrown away and rewritten.


# New react project

You can do this anyway you want. You could use
```shell
npx create-react-app counter --template typescript
cd counter
```

# Add dependencies

```shell
 yarn add @phil-rice/lens
```

# Replace index.tsx

```typescript jsx
interface CounterDomain{}
let domain: CounterDomain = {}

export interface CounterData {value: number}

export function Counter<Main>({context}: LensProps<CounterDomain, Main, CounterData>) {
    let value = context.json().value
    let increment = () => context.setJson({value: value + 1})
    let decrement = () => context.setJson({value: value - 1})
    return (<p>Clicked: {value} times
            {' '}<button onClick={increment}>+</button>
            {' '}<button onClick={decrement}>-</button></p>)
}

let rootElement = getElement("root");
let setJson = LensContext.setJsonForReact<CounterDomain, CounterData>(domain, 'counter',
    c => (ReactDOM.render(<Counter context={c}/>, rootElement)))

setJson({value: 0})
```

# Check it works
```shell
yarn start
```
# Let's examine the code

## Domain
```typescript jsx
interface CounterDomain{}
let domain: CounterDomain = {}
```

A domain is for dependency injection. Most projects need things like 'the api I call to get something', or 'complicated business logic'.
The domain is a place we place those so that all the components can access them. 

This project is so simple it has no need for dependency injection, although if we chose we could put the 'increment' / 'decrement' logic here.
In this case I think it is cleaner and more readable not to use it

## Data model
```typescript jsx
export interface CounterData {value: number}
```

This is the state that a Counter needs. It could be just a 'number' if that was desired

### The types

```typescript jsx
export function Counter<Main>({context}: LensProps<CounterDomain, Main, CounterData>) {
```
* Main is the generic for 'the main data that this is a part of'. The component doesn't know anything at all about Main. 
* LensProps<CounterDomain,Main,CounterData> is the 'properties' for this component. The three generics in LensProps are the
dependency injection context, the 'Main' data object and the 'data that this component is focused on' (in this case CounterData)

Note the use of the language 'the data that this component is focused on'. With this style of state management the basic
idea is that each component is focused on some part of the Main data. The component is allowed to see and  change the data it
is focused on. 

## The react component

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
This has been taken from the redux example.

This line shows how we access state. Remember that the type of data the component is focused on is a `CounterData` and
counter data has a value field. `context.json()` returns a `CounterData` and `context.json().value` is the current numeric value of the count
```typescript jsx
    let value = context.json().value
```

### Modifying the state

```typescript jsx
export function Counter<Main>({context}: LensProps<CounterDomain, Main, CounterData>) {
    let value = context.json().value
    let increment = () => context.setJson({value: value + 1})
    //...
    return (<p>
            ...
            {' '}<button onClick={increment}>+</button>
            ...
        </p>
    )
}
```
The method `context.setJson` allows us to 'set the json' that the component is focused on. This 'setting' is actually `create an immutable copy with these changes`.

The code `context.setJson(context.setJson({value: value + 1})` replaces all the boiler plate code in redux while delivering many of the same values. It handles
data flow through the component tree. A major difference between this and redux is that idiomatic normal usage means that the component can only change the
json it is focused on, and a second major difference is the ease of composibility. Redux actions compose poorly. These components compose beautifully

### Setting it all up
```typescript jsx
let rootElement = getElement("root");
let setJson = LensContext.setJsonForReact<CounterDomain, CounterData>(domain, 'counter',
                            c => (ReactDOM.render(<Counter context={c}/>, rootElement)))

setJson({value: 0})
```
* `getElement` is basically `document.getElementById(name);` with an error reported if the name doesn't exist
* `LensContext.setJsonForReact` is the method that sets up the data flow loop. Whenever `setJson` is called it will
render code.
* `(domain, 'counter', c =>` 
     * `domain` is our 'blank' domain (not needed because this very simple application has no need for dependency injection
     * `'counter'` is a text string used mostly while debugging
     * `c` is the LensContext that is passed to the root component (`Counter`)
* `(ReactDOM.render(<Counter context={c}/>, rootElement)))` This is how we tell react to render the component


# Let's now modify our example

I do urge you to try the same exercise with redux: it is extremely challenging to refactor it, and in practice the result is probably a total rewrite of most of the 
code in the project. It is when you do this exercise that I feel you are likely to realise why I feel this approach is a clear win over redux for most cases.
Here we are just going to modify the application to have two counters.

```typescript jsx
export interface TwoCounterData {
    counterOne: CounterData,
    counterTwo: CounterData
}

export function TwoCounter<Main>({context}: LensProps<CounterDomain, Main, TwoCounterData>) {
return (<div>
   <Counter context={context.focusOn('counterOne')}/>
   <Counter context={context.focusOn('counterTwo')}/>
</div>)
}

//replace the existing setJson and it's call to
let setJson = LensContext.setJsonForReact<CounterDomain, TwoCounterData>(domain, 'twoCounter',
    c => (ReactDOM.render(<TwoCounter context={c}/>, rootElement)))

setJson({counterOne: {value: 0}, counterTwo: {value: 0}})
```

Note the ease with which we write the TwoCounter component. TwoCounterData has two counters: counterOne and counterTwo. The component has two `Counter` components. One
is focused on counterOne, and the second on counterTwo. 

All the wiring of `how do I flow data through the component tree`, `how do I change things` are handled by the lens library.

# What is the 'weakness' of this approach over Redux

## The equivalent of actions just change the json

While this is significantly less coupled than redux in most areas (you can validate that yourself by doing the refactoring exercise in redux: decoupled code does not
require much effort to refactor) it is more tightly coupled in one way. In this case the `increment` and `decrement` methods are required to increment and decrement
the value of the counter.

We can remove this coupling, but in practice I actually like it! I like the fact that `increment` is clearly incrementing the value. We can imagine worlds in
which we need to do something else at the same time and about half the time it is something like `recalculate the price of the whole json`, in which case 
we modify the global setJson method. But we can also imagine that we might want some complex business logic. 

If we actually have this need we can add the increment and decrement to the domain. This though damages readability, so I would only do it if I actually the need

Note that it is as easy to add it afterwards as it is to add it at the beginning, so I personally would follow the [YAGNI principle](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) 
and only introduce the decoupling when I actually need it

## If we have actions that change many bits of json simultaneously, as well as doing other activities then they may be more complex to code

So we can imagine a situation where a redux action might change ten separate parts of the json simultaneously. This isn't a scenario I
commonly face but should it occur I can imagine that redux would have an advantage.

It is the case that many times we want to change two parts:
* In tictactoe we change the 'next state' and 'the value of the square we clicked on'
* In a shopping cart we add an item to the shopping cart, and we might remove it from stock (only in the redux example: in practice I don't think the client does this... it's done by the server)

In this case it's not too challenging (there are helper methods: see the tictactoe example/tutorial) but when we get to doing three or four it will become challenging
and the readability will suffer