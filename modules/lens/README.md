# What is this project?

Immutable data structures are becoming the norm in both front end and server side code. Javascript and typescript have
become better at code for handling immutables. Projects such as 'immer' have arisen to help handle this.

This project offers a very simple way to handle one of the most important tasks: accessing deep parts of data structures
and perhaps more importantly offering easy ways to mutate them. The code is very small and light weight with no
dependancies (other than devDependencies)

# Getting started

## Tutorials
* [Getting started with a simple counter example](https://github.com/phil-rice/ts-lens-react/tree/master/tutorial/counter)
* [A more complicated example](https://github.com/phil-rice/ts-lens-react/blob/master/tutorial/tictactoe)

## Links about lenses

* https://medium.com/@gcanti/introduction-to-optics-lenses-and-prisms-3230e73bfcfe
* https://medium.com/javascript-scene/lenses-b85976cb0534
* https://www.linkedin.com/pulse/functional-lenses-javascript-vladim%C3%ADr-gorej/

## Example projects
* [An example showing how much simpler lens code is than the normal copy code](https://github.com/phil-rice/ts-lens-react/blob/master/examples/lens/dragon)
* [State management in react](https://github.com/phil-rice/ts-lens-react/blob/master/modules/state)

# Downloading

You can install this project by

 ```shell
npm install @focuson/lens
```

# Where are the tests?

To keep the projects small, the tests have been moved  [here](https://github.com/phil-rice/ts-lens-react/blob/master/modules/lenstest)

# Example usage

We'll start with examining how we work with a deep data structure. Here we can see a block of json representing a
dragon. In the dragon's stomach is some hapless adventurer. Our job is to write the eat method which will return a copy
of the dragon with the parameter added to the existing contents of the stomach

```typescript

export let startDragon: Dragon = {
    body: {
        chest: {
            hitpoints: 10,
            stomach: {
                contents: ['the adventurer']
            }
        },
        leftWing: {hitpoints: 5},
        rightWing: {hitpoints: 4}
    },
    head: {hitpoints: 3, leftEye: {color: "blue"}, rightEye: {color: "green"}}
}
```

Let's write it without Lens first. And once we've written it, let's consider how fragile this code is. Imagine how easy
or hard it would be to change if the structure of the dragon changed.

```typescript

export function eat(dragon: Dragon, item: any): Dragon {
    return {
        ...dragon,
        body: {
            ...dragon.body,
            chest: {
                ...dragon.body.chest,
                stomach: {
                    ...dragon.body.chest.stomach,
                    contents: [...dragon.body.chest.stomach.contents, item]
                }
            }
        }
    }
}
```

Now let's try writing it with Lenses. And once we've written it, let's consider how easy or hard it would be to change if the structure of
the dragon changed
```typescript
export let dragonContentsL: Lens<Dragon, any[]> = Lenses.build<Dragon>('dragon').focusOn('body').focusOn('chest').focusOn('stomach').focusOn('contents')
export let eat: (dragon: Dragon, item: any) => dragonContentsL.transform(oldContents => [...oldContents, item])(dragon);
```

# Lenses and focus

The idea behind lenses is that they are 'focused' on a small part of a big object.  In the example above the lens `dragonContentsl` was a lens that 
given the 'main object' (a Dragon in this case) is focused on just the contents of the stomach. The lens allows us easy access to the thing that is focused
on, and allows us to change easily (in the sense of making an immutable copy with the changes) the focused part

In the example above `dragonContentsL.transform(oldContents => [...oldContents, item])` creates a function that goes from a dragon to a new dragon. The
only difference between the new dragon and the input dragon is the transform function applied to the contents. In otherwords it 
returns a new dragon, identical except that new one has `item` added to `oldContents`

# How do they work

A lens has the signature `Lens[Main,Child` and is two functions. One is a `getter` of signature `(m: Main) => Child`. The other is the `setter` which
takes an original main, a new child and returns a new main. `(m: Main, c: Child)=> Main`.


## The magic of composibility
This is easy enough, but the magic comes when we discover that they are composible. It is the composibility that allows the magic of 
```typescript
export let dragonContentsL: Lens<Dragon, any[]> = Lenses.build<Dragon>('dragon').focusOn('body').focusOn('chest').focusOn('stomach').focusOn('contents')
```
Here we started with a lens that was focused on the whole dragon (not the most exciting lens), and then gradually 'focused in' on 
the place of interest (the contents of the stomach). This works because lenses are composible. If I have a `Lens[Main,Child]` and a `Lens[Child,Grandchild]` 
I can smash them together and create `Lens[Main,Grandchild`. Intuitively we can just thing 'focuses in on the next part'

Another example can be seen here:

```typescript
let msgToCupLens = Lens.build<Msg>('msg').focusOn('order').focusOn('cup')
let cupToMadeofLens = Lens.build<Cup>('cup').focusOn('madeOf')
let msgToMadeOfLens = msgToCupLens.andThen(cupToMadeofLens)
```

# How can I use Lens

## Changing immutable structures
(With the usual meaning of getting a copy with the difference). The above example shows a simple way to do that

## Decoupling the structure from business logic
A good example of this is in the examples code `examples/lens/dragon`. Here we can see the 'damage' method is handed a lens. 
The damage code knows nothing about the structure of the dragon, it just knows how to go from a dragon to the hitpoints. 
This approach of decoupling the business logic from the structure leads to code that keeps on working even when there are
dramatic changes to the domain structures

## Updating multiple parts simultaneously

Imagine we have a data structure and we need to update two parts at the same time. In the tictactoe example we need
to change the state of the current square and the value of next state. 

We can do this quite easily by having a lens to 'part1' and a second one to 'part 2', then using the method `updateTwoValues` or 
`transformTwoValues`. The result is a new main with both modifications applied.

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

