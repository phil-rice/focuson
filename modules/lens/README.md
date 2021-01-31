This is a simple implementation of lens.

# Articles about lens 
* https://medium.com/javascript-inside/an-introduction-into-lenses-in-javascript-e494948d1ea5

# A presentation (in a different language)
https://docs.google.com/presentation/d/1bahDdJQS3bP9HxDJTJ2YjRT30FRUL4n9mfvcUSm3X8g/edit#slide=id.p

# Example
(The types Msg can be found in 'LensDemo.ts)
```
let json: Msg = {
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

If we are using immutable objects and we want to have a method 'setCupSize' it might look like this

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
And it gets worse: the more nexted the worse, and if there are arrays involved... it can get error prone and messy

Let's compare this code to
```
let msgToMadeOfLens = Lens.build<Msg>().then('order').then('cup').then('madeOf')
let setCupMadeOf = msgToMadeOfLens.set
```

# Lens context

There are many uses cases (like a gui) where there is a 'main json message' and different components
are responsible for different parts.

The lens context holds
* Domain... something to simplify message signatures (at the cost of the types signature... but use type aliases to hide this)
* Main... the main json
* Lens... a lens to the bit of json we are interested
* a method called whenever the main has been changed. This is used in guis (for example) to rerender the screen
There are helper methods to make more contexts

