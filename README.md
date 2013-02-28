<!--- Strip out this top section when starting a new project -->
# Front-end Project Template

## Starting a new project

1. `$ git clone --depth 1 -o template git@github.com:TheGlobalMail/frontend-project-template.git new-project`
   This will clone the template into `./new-project` without history and the remote is named `templated` (isntead of `origin`)
2. *Optional.* Immediately checkout master to a template branch (`$ git checkout -b _template template/master`)... this will serve as a middleman for integrating changes back-and-forth between the project and the template. Switch back to master.
3. Update `name` in `component.json` and `package.json`. Update this `README.md` stripping out this info, updating the title, etc. Update `<title/>` in `app/index.html`.
4. Commit the name changes
5. Create a new repo on GitHub/whatever for the project and do `$ git remote add origin git@somerepo.git`
6. Now you can `$ git push origin master -u` to push the project and set master to push/fetch from the project repo
7. Running `git remote -v` should give you something like this:
    ```
    origin  git@github.com:TheGlobalMail/RockArt.git (fetch)
    origin  git@github.com:TheGlobalMail/RockArt.git (push)
    template  git@github.com:TheGlobalMail/frontend-project-template.git (fetch)
    template  git@github.com:TheGlobalMail/frontend-project-template.git (push)
    ```
8. Make awesome shiz...

<!-- Update below with project details -->
# {Project Name}

{A short description about the project.}

* **Staging URL:** [http://cool-project.herokuapp.com/](http://cool-project.herokuapp.com/)
* **Production URL:** [http://cool-project.theglobalmail.org/](http://cool-project.theglobalmail.org/)

## Installing

1. Clone the repo
2. Run `npm install`
3. Run `./bower-install` (this script will ensure bootstrap is nested in tgm-bootstrap)

## Development server and building

The build system is made on Grunt v0.4+

* `grunt` will build the whole project into a `./dist` folder
* `grunt server` will start a dev server (default port 9000) with livereload, etc. LESS is compiled automatically.

The `dist/` folder isn't ignored by Git, so be careful not run it on a development branch and then accidentally commit it.

## Deploying

For staging, use a free Heroku instance so we don't have to worry about caching. For production, push directly to the CDN. Deployment is done on a throw-away branch.

1. `$ git checkout -b deploy`
2. `grunt`
3. *Optional* `$ rm dist/components` (Probably isn't used in a built version of the app)
4. `$ git add dist/`
5. `$ git commit -m "Build" dist/`
6. `$ ./cdn-deploy.js [staging|production] {RACKSPACE_API_KEY}`
7. *Staging only* `$ git push heroku deploy:master --force`
8. `$ git checkout master`
9. `$ git branch -D deploy`

## Adding libraries, frameworks, dependencies

Most libraries are available through Bower, check using `bower search`. When doing `bower install` remember to add the `--save` flag so the component gets added to `component.json`. Components are installed into `app/components` which is ignored by Git.