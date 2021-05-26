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
Here we'll have a bit less options but much more pleasing display of outbreak to the eye. Three-diemensionally spread dots, each representing human with his own properties. As the time will progress the dots will change colors and connect to represent current state of things.



## Project structure

#### 1. Modules
Project is split into modules, one for each branch of math. This is done for two purpouses: to keep code cleaner and more logical, and to have them **lazy loaded**. Given the project's size and usage of **Three.js** and **Canvas2d**, it'd be straining for users' computers to load every big module at once.

#### 2. Components
Each module is split into components, one for each concept. This keeps it easy to navigate around. Additionaly, every concept, in addition to explaining itself when viewing website, should have README attatched basically repeating what this component does and why.

#### 3. Shared
Each component will be using reusable parts of the code, shared components, directives, models and guards. Examples of such would be *explanation.component* or *button-normal.component*, used to keep the styling of each module and component as similar as possible. Directives are mostly pure styling, like those used for buttons (*button-flat.directive.ts*).

#### 4. Services
Some of the components will be needing external help. As such, they will be communicating to our *Python/Flask API* via *HTTP protocols*. "Front-end" server is built using *node.js and express*.

#### 5. External libraries used
- three.js
- express

## User experience and design

1. Project general design

2. Color schema
#272727
#636363
#F3F3F3
#FF0090
#00FFEE

## Running locally

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
