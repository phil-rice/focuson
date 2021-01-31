# What is this project?

While react is a great project, react state management leaves much to be desired. Most comparisons of frameworks such as angular and react will 
list the issue that state management in react is difficult.

Redux is one of the obvious candidates for state management, but it is difficult to use and full of boilerplate code. The
pieces in redux are not easy to change or reuse. This project you are looking at now arose out of a refactoring of redux projects. 
By utilising  a functional programming technique known as optics, and more specifically lens, much of the complexity of redux vanishes. 

One of things I don't like about redux is that actions can do 'anything'. It is very hard to combine actions together. Lens change that 
model: we have the idea that a lens is focused on a bit of the state. With this state management, components display a subset of the json 
(just like in redux), and components can normally change just that bit of the json (unlike redux where there is no such protection).

# When should I use this project

This project isn't suitable for everything. It works best when the rendering and editing of a bit piece of state is split across
multiple components. If there are many components that change many parts of state simultaneously then perhaps redux is better suited. If 
instead your display is split up with a 'editor component' that displays part of the state and lets you change that part of the state, then 
this project

# Presentation

[This presentation details how the react lens works](https://docs.google.com/presentation/d/e/2PACX-1vRvIfvQHiMw10X9bAek_hK1eE6WDqP8V4X85fJ8gT4RaQU9mPh9yu9j0bRpLnfKEptqwpLqowGy43vK/pub?start=false&loop=false&delayms=3000)

# Getting started

* [Getting started with a simple counter example](tutorial/counter)
* [A more complicated example](tutorial/tictactoe)

# Examples
There are a number of examples in the `examples` folder.

# Downloading

These are npm packages. They can be accessed by 
* `npm install @phil-rice/lens` This is the core `state management using optics` package. 
* `npm install @phil-rice/codeondemand` This is an R&D project 'how do we handle change/experimentation/etc' in code.

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

The `codeondemand` project just uses the lens. You can get all the goodness of lens for state management without using it

### examples/codeondemand
A few examples of how to do this code on demand

