# Presentation

[Read this to understand what is happening](https://docs.google.com/presentation/d/e/2PACX-1vRvIfvQHiMw10X9bAek_hK1eE6WDqP8V4X85fJ8gT4RaQU9mPh9yu9j0bRpLnfKEptqwpLqowGy43vK/pub?start=false&loop=false&delayms=3000)


# Developing locally

# Packages

## nonfunctionals
This provides higher order functions that wrap functions with 'one input, one output' with the
non functional features such as
* metrics
* caching
* profiling
* logging/debugging

Currently this is only used in other projects, not in the lens / codeondemand

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

<hr />
# Why Code on demand?

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
<hr />

 # Checking out and using the code
There are a lot of separate npm projects in here, and they should all be kept in sync.

npm has no inheritance story, so we have to find another way to manage 'all these projects are mostly the same'. This project 
uses 'laoban' a tool for managing multiple github repos. It can be located at https://github.com/phil-rice/laoban.

There are three 'parts' in this. 
* The template directories
* The project directories
* The scripts 

# Template directories
* In this directory are child directories that hold templates.
    * package.json is 'not complete': parts of it will be changed by the project directory configuration
    * the other files are just copied (overwriting anything there)

# Project directories
* A project directory is one that has the file 'project.details.json' in it
* project.details.json has a field 'template' which tells us which is the template to use (it jolds the simple name of the template)
   * The details in this file will be used to change package json
   * any 'dependancies', 'devDependancies' and 'keywords' will be added
   * The 'generation' covers what order it will be executed in compared to other projects
   * The links is used to add symbolic links (see `setupNpmLinks.sh`)
   * the publish is used to control whether the project is published to npmjs
   * any other fields will be added (overwriting)
         * this is where we (for example) specify name and description
* The other files in the template will overwrite

# Scripts
The scripts are currently being incorporated into Laoban. They are used to do some of the json manipulation when copying package.json from the template to the project

# laoban cheatsheet

* Install by (in separate directory) `git clone git@github.com:phil-rice/laoban.git`
* Add to command path using `npm link` (from the laoban directory)
* type `laoban --help` for instructions

Useful commands include
`laoban install` used to 'update/npm install/tsc/npm test etc'.. basically it setups the system and checks it is working
`laoban projects` lists the projects
`laoban update -a` updates the package.json with the version in the template directory, and copies the template files into the project 
`laoban pack -a` almost publishes the files. It actually just makes a zip file with 'what would have been published' 
`laoban publish -a` actually publishes the files
`laoban tsc -a` compiles the files
`laoban test -a` runs npm test on all the files
`laoban status -a`  is awesome: it tells you the success/failure of the last 'main commands'. This gives you the status of all of your projects at a glance

