# Boozement

A personal hobby project to learn coding.

This code can be used to track alcohol consumption.

# Architecture

Node & Express server on the backend.

React Hooks & Redux (with Redux Toolkit additions) on the clientside. 

PostgreSQL database (because of fulltext search support).

Cypress for integration testing. 

## PostgreSQL in Docker

To run local PostgreSQL inside Docker, run the following

    docker run -d \
        --name postgres \
        -e POSTGRES_HOST_AUTH_METHOD=trust \
        -p 5432:5432 \
        postgres

Run db-init script from db directory thereafter.

Additionally, add following lines to `/etc/hosts`

    127.0.0.1 boozement-postgres

## Available Scripts

In the project directory, you can run:

### `npm run compile`

This compiles development build of the system (and something else, not fully optimized).

### `npm run dev`

This starts frontend in the development mode and backend server as well 
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

This build production version of the project. 
 - clientside bundle with react scripts
 - serverside bundle with custom webpack config
 
into `build` directory.

Because we support SSR and hydrating, serverside code refers to clientside resource as well. 
 
If this were a real production project, I would `eject` from react scripts and have single visible webpack config for all bundles. 

### `npm run test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run cypress:open`

Open Cypress UI to run graphical integration tests. I've been to lazy to scripts for headless running. 


## TODO

At some point I will test ejecting from react scripts, hence leaving original eject docs here.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
