

# Developing locally

There are a lot of small packages 
* so that the users can 'pick and choose'
* to enforce that the code is as decoupled as possible.

In order to work locally I recommend using [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link)

There (will be) a bash script in this project `setupNpmLinks.sh` that sets up the links. Effectively each 
package is symlinked to the dependant packages

# Packages

## nonfunctionals
This provides higher order functions that wrap functions with 'one input, one output' with the
non functional features such as
* metrics
* caching
* profiling
* logging/debugging

## lens
See https://medium.com/@gcanti/introduction-to-optics-lenses-and-prisms-3230e73bfcfe

A lens allows us to 'focus in' on a small part of a big data structure. Without these lens we have
to write a lot of 'copy code' manually.

## reactlens
Using the lens we can handle state in react very simply. This library holds the (tiny) code that
lets react components use this approach

## codeondemand
One of the core constraints in REST (https://en.wikipedia.org/wiki/Representational_state_transfer) is code on demand.

Codeondemand allows us much more flexibility and power in our gui design. It basically removes the problem of 
time versioning APIs because as far as the server is concerned there is only one version: the 'now version' (unless the server has
some reason for multiple versions like 'A/B testing') The server delivers the code to the client that is correct for the
data that the client needs. 

### Cross time versioning / data representation changes
As we move through time often the server wants to change the data representation. For example it might want to add new fields (easy), change 
a field name (hard), 'pull' fields into a child object or a list of objects (extreme). This can be so painful (because of the tight coupling between 
multiple clients and the server) that the work slows down. One high street name company I worked with locked down these changes to 'every 9 months'
just because of the extreme pain of keeping this coupling.

This approach says 'use rest... use media types'. The client is coupled only to the media type (changes extremely slowly if at all), and the server
knows which code to deliver for the data it is delivering. This means (for example) multiple servers can each be delivering different versions 
(during deployment/experimentation/rollback) and the client just uses 'the right code for the data'

### Geographic specific versions
The server can deliver a geographic specific version of things:
* Login. In belgium there is a legal requirement of banks to use a card reader, in other countries username and password is adequate
* Address. In switzerland postcodes have 4 digits and the canton is an important part of the address. In america we use zip codes, and in china the order of display is inverted

### Branded components
When white labeling we might want to deliver different components, not just different css. For example one company has an advert server, a second one
doesn't want adverts at all. One company wants very simple components, and a different one has lots of images in it's drop downs.

### Experimentation
If the client is tightly coupled to the server (the usual situation is the client understands the json coming from APIs),
then it can be challenging to undertake experiments. The client needs to 'know' about the experiments and be modified to support them.

## codeondemandnav
This is a few components that are useful while developing. It allows the developer to set up a set of json representing common situations, and quickly
show what the screens will look like. 

### Example: coffee shop
Imagine CPQ (Configuration Pricing Quotation) for a cup of coffee, where there is a backend api delivering business logic. (Note
that while the business logic for coffee is simple, the business logic for 'ordering a hire car' is extremely complex, integrates into
 legacy systems/logistic systems and requires a backend).  The user might do the following path:
* Nothing selected
* Select drink type
* select milk typ
* select an extra shot
* add a coupon to reduce the cost
* order

This journey (with code on demand) can be represented as the json that came from the coffee selection API. The developer can use these
components to quickly author a 'show me what it looks like' to aid in their development

## examples
Several example projects are shown

### Example: tictactoe_lens
This is the classic react tutorial shown just using lens as state management

### Example: tictactoe_codeondamange
This shows the same tutorial with code on demand. 

### Example: car_cpq
This shows a simple cpq system with a car
