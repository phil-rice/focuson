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

# Running this
```
scripts/build.sh 
npm start
```

# Extended Language of our media type 

* `_render` should have a `_self` containing the code for rendering a class. Can have other properites for dependent components

The rest of the json (pun intended) is hal json

# Why is this good
Read https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven

What we are doing here is focusing on the media type and the Rest 'code on demand' idea. 
The client knows nothing about the data representation / schema, and doesn't need to.

When the data representation changes the server knows how to render the new data representation and tells the client.

This means that things like A/B are canary releases are almost trivial. It means that the client is not coupled in
anyway except through the media type to the server.

Effectively the client becomes just a 'mediatype processor'

## Impact on developers
I think very little as long as they are familiar with HATEOAS. The same components need to be written. 
As before they should be decoupled from each other.

The mental model is different.
 * While we still want to 'bundle up' all the dependencies, the actual application code
will be shipped on demand.
* The idea of actually use Rest is different: most people think of rest as 'json with http using a schema and at known carefully thought about urls' 

# Build.sh
Remember that the idea is that the rendering components are served from the server. This is the front end...

So the build is a 'bodge' that allows us to explore this idea. 
Among other things it makes the shas for the domain files, to allow safe execution, and it  


## Copying the files
* The files are copied to 'public/created' so that we can simulate the server. Note the url has the sha256 in it

## Access to the shas
* The gamejson needs to know what urls to use to render the components. This is provided in src/created/shas

# FAQ

## Why are the created files in the git repo
So that I can demonstrate them to people using the github gui

## Why is it safe to use eval
It is only safe to use eval if you know exactly what is being evaled and are confident there has been no code injection.

In this case we are using https://en.wikipedia.org/wiki/Content-addressable_storage. 
* The stringsthat are being evaled have been pulled from a url that includes their sha. 
* The sha is checked against the string
* This means we know that the string has not been messed with
* We eval it



# General Musings

## How should Rest & RestChild work

We are constrained quite a lot by Rest. 

There is an antipattern that the reducers are not composible in the sense that they have to get 
the data from 'all the state' not 'the state of the parent'

Suppose we do the following
* reactRest is passed using context
** This gives the injection of behavior, including the cache and 'behavior' for the `RestX` components
* Into rest and restChild etc we pass
** json: the subset of the json for us
** knownUrls... this is the hard bit. 

I don't know how to keep the known urls 'upto date'... Context doesn't help (it's one value global state)
One option is not to aggregate them: we just use them in the current context. It's not ideal but OK for now

RestChild is still awkward. We want it to be cascadable. To be cascadable ...we have the getter issue. 

Well ... let's try it. 

App:

<Rest json="" />

Game: 
The props to game will be the json for game. The context will have a reactRest

<RestChild json={json} path='_embedded.board'/>

Board:

so the props will just be the json

 







