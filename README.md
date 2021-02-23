# What is this project?

This project is a number of projects bundled together in a mono repo
* [@focuson/lens: Easy - perhaps even beautiful - code for editing deep immutable objects](modules/lens/README.md)
     * [An example showing how much simpler lens code is than the normal copy code](examples/lens/dragon)
* [@focuson/state: State management for projects (including React) using the lens in the above project](modules/state/README.md)
     * [@focuson/example_state_cpq - the Redux 'counter' example](examples/state/counter)
     * [@focuson/example_state_cpq - A 'configure price quote' example](examples/state/cpq)
     * [@focuson/example_state_cart - The Redux 'shopping cart' example](examples/state/shopping-cart)
     * [@focuson/example_state_tictactoe - The React tictactoe example](examples/state/shopping-cart)

The code on demand is still work in progress.
* [@focuson/codeondemand: Code on Demand for Restful servers that are resiliant to change (this is more R&D than the others)](modules/codeondemand/README.md)
     * [@focuson/example_state_tictactoe - The React tictactoe example](examples/state/shopping-cart)
     * [@focuson/examples_codeondemand_cpq - A 'configure price quote' example](examples/state/cpq)

# Getting started

These show how to use the lenses for state management in React.

* [Getting started with a simple counter example](https://github.com/phil-rice/ts-lens-react/tree/master/tutorial/counter)
* [A more complicated example](https://github.com/phil-rice/ts-lens-react/blob/master/tutorial/tictactoe)

# Working with the project

You can optionally use [the laoban tool](https://www.npmjs.com/package/laoban) to help manage the monorepo. There are currently 16 projects in the 
repo and it is difficult to manage them without some automation. Laoban provides that automation

# Compiling

This project uses yarn workspaces. Normally the sequence of commands to build / run everything is

```shell
# from the root directory
yarn             # this gets all the dependencies
laoban tsc       # this executes tsc in all the projects
laoban test      # This executes the tests in all the projects that have tests in them
laoban status    # This shows the status of tsc and the tests
laoban start     # This executes 'yarn start' in all the react projects
```

# Editing in an IDE

Unfortunately IDEs don't seem to work well with mono repos. When using an IDE such as IntelliJ it can be helpful to run the scripts in the `scripts` directory

* ideify.sh   -  This changes imports such as @focuson/lens to relative addresses, which allows the ide access to the code
* prepare.sh  -  This changes the imports back again. You should do this before running anything (such as tests/the actual code in react) 

# Publishing

Setting up to publish
```shell
npm install -g npm-cli-login
npm-cli-login -u Username -p Password -e test@example.com -r https://your-private-registry-link
```

And the publish itself
```shell
# From the root directory...
# Change the version number in 'template/version.txt`
laoban update         # updates all projects with the version number
scripts/prepare.sh    # Removes the effects of scripts/ideify.sh
yarn                  # Makes sure that everything is up to date

laoban clean && laoban tsc && laoban test && laoban status  
# Check that the status for tsc and tests is 'true' in all projects

laoban publish && laoban status  
#Check the status of the publish
```


