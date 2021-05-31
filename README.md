# Math - Overview

This project's purpose is to show the process of some sort of virus outbreak in a given population and options chosen by the user. After simulating X days and finishing the whole process, the user can save the result to shared database for later use by other users.

## Game rules
First: all infected are alive and spread virus
Second: now we add days being infected to all sick people. The infections are realistic, that is, unless someone is guaranteed to die (Mortality = 1), he "rolls" for his life each day. This way, statistically, still x% people die 
while giving them a chance to recover.


## Simulations

#### Simulation2d
This kind of simulation is called '2d' but in reality it should be dubbed 'pure statistics simulation'. Here we have most options and choices about how the outbreak will play out. We have the option to see infected by day, the timeline and other relevant statistics given user input.

#### Simulation3d
Here we'll have a bit less options but much more pleasing display of outbreak. Three-diemensionally spread dots, each representing human with his own properties. As the time will progress the dots will change colors and connect to represent current state of things.


## Project structure

#### 1. Modules
Project is split into modules, one for each branch page context. This is done for two purpouses: to keep code cleaner and more logical, and to have them **lazy loaded**. Given the project's size and usage of **Three.js** and **Canvas2d**, it'd be straining for users' computers to load every big module at once. Of course, one could argue that projects is too small as of now to justify complicating it with modules, and sure, it could be done without them, but I plan to develop this app in the future, so right now, this is investment.

#### 2. Components
Each module is split into components, one for each purpose. This keeps it easy to navigate around.

#### 3. Shared
Each component will be using reusable parts of the code, shared components, directives, models and guards. Examples of such would be *button-three.component* or *input-range.component*, used to keep the styling of each module and component as similar as possible. Directives are mostly pure styling, like those used for buttons (*button-flat.directive.ts*).

#### 4. Services
Some of the components will be needing external help. "Front-end" server is built using *node.js and express*.

#### 5. External libraries used
- three.js
- express

## User experience and design

1. Project general design

2. Color schema
// TO BE ADDED

## Running locally

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 

Run `npm run startServer` for backend server. Note that you must first connect to your own mongo database at `backend/app.js` (keys.js)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## TO BE DONE
- remove sharedModule from app.module, custom buttons for welcome page
- 3d simulations finish
- 3d simulations save and load
- CLEANUP
