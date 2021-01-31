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
    * any 'dependencies', 'devDependancies' and 'keywords' will be added
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
`laoban install` used to 'updateConfigFilesFromTemplates/npm install/tsc/npm test etc'.. basically it setups the system and checks it is working
`laoban projects` lists the projects
`laoban update -a` updates the package.json with the version in the template directory, and copies the template files into the project
`laoban pack -a` almost publishes the files. It actually just makes a zip file with 'what would have been published'
`laoban publish -a` actually publishes the files
`laoban tsc -a` compiles the files
`laoban test -a` runs npm test on all the files
`laoban status -a`  is awesome: it tells you the success/failure of the last 'main commands'. This gives you the status of all of your projects at a glance

