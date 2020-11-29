There are a lot of separate npm projects in here, and they should all be kept in sync.

npm has no inheritance story, so we have to find another way to manage 'all these projects are mostly the same'. This project 
uses templates.

There are three 'parts' in this. 
* The template directories
* The project directories
* The scripts 

# Template directories
* In this directory are child directories that hold templates.
* It holds files
    * package.json is 'not complete' parts of it will be changed by the project directory configuration
    * the other files are just copied (overwriting anything there)

# Project directories
* A project directory is one that has the file 'project.details.json' in it
* project.details.json has a field 'template' which tells us which is the template to use (it jolds the simple name of the template)
   * The details in this file will be used to change package json
   * any 'dependancies', 'devDependancies' and 'keywords' will be added
   * any other fields will be added (overwriting)
         * this is where we (for example) specify name and description
* The other files in the template will overwrite

# Scripts
*  inProjects.sh 
    * finds all the projects with the 'project.details.json' in them and executes a command in those directories
    * use inProjects.sh pwd to list the directories
* updatePackage.json.sh
    * Finds all the projects 
    * Appies th
        
    
# FAQ

## Why not make this as scaffolding
This is about maintenance not creation. It does do creation as well (which is helpful) but it is primarily about 
making sure that the dependancies can easily be maintained and kept in sync 

## Why doesn't package.json / npm have something like this by default
I wish I knew... surely every project needs it. Certainy there are a lot of stack overflow questions about it, and no answers that I could find    