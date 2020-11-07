Examining how to get React to do 'code on demand'

The idea is that something like HAL Json will include a link to the rendering code


``` {
        _links: {_self: {href: "<prefix>/game"}},
        _render: {_self: "<prefix>/game/render/shaForComponent"},
        gameData: 'Some game data properties could go here',
        _embedded: {
            board: {
                _links: {_self: {href: "<prefix>/board/shaForComponent"}},
                _render: {_self: "<prefix>/board/render/shaForComponent", square: "<prefix>/square/render/shaForComponent"},
                squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        }
```
The  rendering code will then be loaded (SHA checked!) and then used.

# Language

* `_render` should have a `_self` containing the code for rendering a class. Can have other properites for dependent components

The rest is hal json

# Why is this good
Read https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven

What we are doing here is focusing on the media type and the Rest 'code on demand' idea. 
The client knows nothing about the data representation / schema, and doesn't need to

When the data representation changes the server knows how to render the new data representation and tells the client.

This means that things like A/B are canary releases are almost trivial. It means that the client is not coupled in
anyway except through the media type to the server.

## Impact on developers
I think very little as long as they are familiar with HATEOAS. The same components need to be written. 
As before they should be decoupled from each other

# Comments
It is just a one file app index.html. No server is needed

## Why no server
This is a training playground: I want to understand the lifecycle of the react components.
Without a server I'm forced to do everything and not use any magic

## What does it do
We add a _render to hal json. This is the url of the component that will render the json

## Why no promises in classmap
laziness... The problem is around 'can I use the string safely. Async can be added when we move to having a server'

## What does the bash script do
Combines the files in src into one index.html

