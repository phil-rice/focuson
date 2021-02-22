
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

We have the idea that a lens is focused on a bit of the state. With this state management,components display a subset of the json
(just like in redux), and components can normally change just that bit of the json (unlike redux where there is no such
protection).


# When should I use this project

This project isn't suitable for everything. It works best when the rendering and editing of a bit piece of state is
split across multiple components. If there are many components that change many parts of state simultaneously then
perhaps redux is better suited. If instead your display is split up with a 'editor component' that displays part of the
state and lets you change that part of the state, then this project is the clear winner


# Presentation

[This presentation details how the react lens works](https://docs.google.com/presentation/d/e/2PACX-1vRvIfvQHiMw10X9bAek_hK1eE6WDqP8V4X85fJ8gT4RaQU9mPh9yu9j0bRpLnfKEptqwpLqowGy43vK/pub?start=false&loop=false&delayms=3000)

# Examples

There are a number of examples in the `examples` folder.

## lens

See https://medium.com/@gcanti/introduction-to-optics-lenses-and-prisms-3230e73bfcfe

A lens allows us to 'focus in' on a small part of a big data structure. Without these lens we have to write a lot of '
copy code' manually. Javascript/typescript has very few built in tools for manipulating and working with immutable
objects, and as a consequence you will hear people saying `don't have deep data structures`. Lens allow us to decouple
our code from the data structure, and allow us not to care about how deep the data is

### What is a lens

A lens is simply two functions. A lens that 'goes from' a `Main` to a `Child` would have signature `Lens<Main,Child>`.
The two functions have signatures `(m: Main) => Child` and `(m: Main, newChild: Child) => Main`. The first allows us to
find the child and the second allows us to 'set' it (using the usual immutable definition of set which is 'a copy with
this value replaced')

### How do I use the lens code

```typescript
let json: Msg = { // Msg can be found in LensDemo.ts
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
let msgToMadeOfLens = Lens.build<Msg>('msg').focusOn('order').focusOn('cup').focusOn('madeOf')
msgToMadeOfLens.set(json, 'soy')
```

xNote that the parameters to `focusOn` are typesafe (as long as Msg is defined without wildcards). We have IDE code insight
working with them, and we have the compiler checking that the values we use are legal.

Also note that the parameter to 'build' (`Lens.build<Msg>('msg')`)  is just to improve the readability of some error messages and testing

Let's compare that to the code without lens

```
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

And it gets worse: the more nested the worse, and if there are arrays involved this code often gets error prone and
messy.

### What is cool about Lens

They are composable and simple. Given a `Lens<Main,Child>` and `Lens<Child,GrandChild>` we can create a lens from `Main`
to `GrandChild`.

```typescript
let msgToCupLens = Lens.build<Msg>('msg').focusOn('order').focusOn('cup')
let cupToMadeofLens = Lens.build<Cup>('cup').focusOn('madeOf')
let msgToMadeOfLens = msgToCupLens.andThen(cupToMadeofLens)
```

### Change and lens

It is common for us to want to change the structure of our data. Without lens the impact can be very high: both in the
code and in the tests. With lens we can isolate the changes from the business logic, which means that typically we only
have to make very few changes when we makes changes to the structure. Without lens if we aren't extremely careful (which
may require us to program in a way that isn't idiomatic javascript/typescript)
we couple all the business logic to the structure.

If you want to play with the difference and experience it for yourself the  `dragon` example project is a great place to
try that. It has a deeper structure than than the coffee example and has many tests. You can do things like 'remove the
body structure' and see that the impact using lens is a few lines of code, whereas for the 'without lens' code, the
impact is around half the entire code base. This is because lens give us the ability to decouple, and decoupling
supports and empowers change.

## examples/lens/...

There are a few projects that demonstrate the use of the lens code.

* The dragon example is particularly good for demonstrating how lens remove boilerplate code
* The counter example is a good example of how easy it is to reuse these components
    * As an exercise you could try taking the standard redux
      counter https://github.com/reduxjs/redux/tree/master/examples/counter/src and try and have two on them on the
      screen
    * Note that it was trivially easy in the lens example, because the power of lens is that they make this kind of
      reuse trivially easy
    * Try and do it with redux without rewriting totally the dispatcher/render code... bascially react supports reuse
      and redux doesn't.

# Articles about lens

* Lens in Javascript: https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5
* Lens in scala:  https://docs.google.com/presentation/d/1bahDdJQS3bP9HxDJTJ2YjRT30FRUL4n9mfvcUSm3X8g/edit#slide=id.p

# Lens context

There are many uses cases (like a react gui) where there is a 'main json' and different components are responsible for
different parts. `LensContext` represents this. Internally it has the following

* `domain`... something to simplify message signatures (at the cost of the types signature... but we can use type aliases to hide
  this)
* `main`... the main json
* `lens` ... a lens to the bit of json we are interested
* `dangerouslySetMain` This should not be directly called. It sets the state in the react application. Normally it is
  called by methods that provide cleaner access.

We use `LensContext` extensively in our react state management. The most used methods/fields on the context are

* `json()` returns the json that the context is focused on
* `setJson(j)` Uses the lens to make a new 'main json'. Precisely what else happens is determined at the time the
  context is created. In the react statemanagement this causes a clean re-render
* `domain`. Gives access to the json
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
