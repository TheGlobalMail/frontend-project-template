# Front-end Project Template

## Starting a new project

1. `$ git clone --depth 1 -o template git@github.com:TheGlobalMail/frontend-project-template.git new-project`
   This will clone the template into `./new-project` without history and the remote is named `templated` (isntead of `origin`)
2. Immediately checkout master to a template branch (`$ git checkout -b template`)... this will serve as a middleman for integrating changes back-and-forth between the project and the template
3. Create a new repo on GitHub/whatever
4. `$ git remote add origin master -u` to push the base project and set master to push/fetch from the project repo
