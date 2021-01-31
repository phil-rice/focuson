# Presentation

[Read this to understand what is happening](https://docs.google.com/presentation/d/e/2PACX-1vRvIfvQHiMw10X9bAek_hK1eE6WDqP8V4X85fJ8gT4RaQU9mPh9yu9j0bRpLnfKEptqwpLqowGy43vK/pub?start=false&loop=false&delayms=3000)

# There are two separate 'ideas' in this code base

* @phil-rice/lens: a mechanism that handles 'state' in react. It is a 'replacement for redux'. Much simpler and easier to use in most cases, but if you genuinely need CQRS (and you probably don't even if you think you do) then Redux may be better
* @phil-rice/codeondemand: A mechanism for allowing actual Rest (instead of 'RPC using json with swagger over http')   with react guis

# Getting started

* The redux counter example is implemented [here](tutorial/counter)
* The tictactoe example is implemented [here](tutorial/tictactoe)

# Examples
There are a number of examples in the `examples` folder.

# Downloading

These are npm packages. They can be accessed from
* @phil-rice/lens
     * This is the core `state management using optics` package. 
* @phil-rice/codeondemand
     * This is an R&D 'how do we handle change/experimentation/etc' in code

## lens
See https://medium.com/@gcanti/introduction-to-optics-lenses-and-prisms-3230e73bfcfe

A lens allows us to 'focus in' on a small part of a big data structure. Without these lens we have
to write a lot of 'copy code' manually.

## examples/lens/...
There are a few projects that demonstrate the use of the lens code. 
* The dragon example is particularly good for demonstrating how lens remove boilerplate code
* The counter example is a good example of how easy it is to reuse these components
    * As an exercise you could try taking the standard redux counter https://github.com/reduxjs/redux/tree/master/examples/counter/src and try and have two on them on the screen
    * Note that it was trivially easy in the lens example, because the power of lens is that they make this kind of reuse trivially easy
    * Try and do it with redux without rewriting totally the dispatcher/render code... bascially react supports reuse and redux doesn't.

## codeondemand
One of the core constraints in REST (https://en.wikipedia.org/wiki/Representational_state_transfer) is code on demand.

Codeondemand allows us much more flexibility and power in our gui design. It basically removes the problem of 
time versioning APIs because as far as the server is concerned there is only one version: the 'now version' (unless the server has
some reason for multiple versions like 'A/B testing') The server delivers the code to the client that is correct for the
data that the client needs. 

The code on demand just uses the lens. You can get all the goodness of lens for state management without using it

### examples/codeondemand
A few examples of how to do this code on demand

