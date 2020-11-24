Examining how to get React to do 'code on demand'

The idea is that parts of the json can have a `_render` field. This contains
information on how to render that part of the json.


``` {
        _render: {_self: "<prefix>/game/render/shaForComponent"},
        gameData: 'Some game data properties could go here',
            board: {
                _render: {_self: "<prefix>/board/render/shaForComponent", square: "<prefix>/square/render/shaForComponent"},
                squares: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        }
```
The  rendering code will then be loaded (SHA checked!) and then used.

# Extended Language of our media type 

* `_render` should have a `_self` containing the code for rendering a class. Can have other properites for dependent components

The rest of the json (pun intended) can be anything including such things as HAL json or RESTfulJson (application/vnd.restful+json)

# Why is this good
Read https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven

What we are doing here is focusing on the media type and the Rest 'code on demand' idea. 
The client knows nothing about the data representation / schema, and doesn't need to.

## Data representation changing by time
The one constant in IT is change. Json formats will change across time. The design principles in the link above tell us how to deal with those changes:
* We focus on the media type
* We can use code on demand to render up the data

### Example

At time t=0 we have the representation of a person:
``` { "name": "phil", address: "some address" }```
Later we decide to implement addresses properly as a child object
``` { "name": "phil", address: { "line1": "some address", "line2": "more about the address"} }```
And as time progresses we want to allow multiple addresses
```` { "name": "phil", addresses: [{ "line1": "some address", "line2": "more about the address"}] }``

Our api that serves up addresses could have dozens of clients. It is desirable that they are not coupled to the data representation. 
We can deal with this by
``` { "name": "phil", address: "some address" , "_render": "someUrlOfTheComponentToRender"}```
The client doesn't 'decide' how to render the address: it asks the server 'how should I render it', and is thus decoupled from the data representation

# Geographic variations

Sometimes we need to do things differently in different geographies. The data needs to be different, the business processes different, and we don't want to change the client

## Example: Login to a bank application

In many parts of the world we can use username and password, but some places are different. For example in  Belgium we need to use a card reader as part of the login process. 
The data, the instructions and what to do are different

By using code on demand the server can give the different data, and the client can render it using the appropriate code

## Example: Addresses

* An address in the UK might have counties and postcodes 
* In Switzerland cantons are important and postcodes are 4 digit numbers
* In America we have zip codes
* In China the order of all the data is 'biggest first.'. e.g.: Country, Province, City, region, street, house number

We can ship a localised 'display address' or 'edit address component' easily with this approach

# White labeling

Depending on such things as the domain, or who the customer is logged in as, we might be white labeling our application to look very different. CSS can go
a long way, but the power of having different components is very high.

# Experiments

If we want to try out a new widget on 1% of the customers, and have a hundred different experiments at once, it would be nice not to have keep
updating and deploying the application. Code on demand means that the client remains the same, and the server just delivers a different component for that part of the screen


## Impact on developers
I think very little as long as they are familiar with HATEOAS. The same components need to be written. 

As before they should be decoupled from each other.

The mental model is different.
 * While we still want to 'bundle up' all the dependencies, much of the actual application code will be shipped on demand.
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

## Why is it safe to use `Function`
It is only safe to use function if you know exactly what is being evaled and are confident there has been no code injection.

In this case we are using https://en.wikipedia.org/wiki/Content-addressable_storage. 
* The strings that are being evaled have been pulled from a url that includes their sha. 
* The sha is checked against the string
* This means we know that the string has not been messed with
* We `Function` it

