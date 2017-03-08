# Path finder API [![Build Status](https://travis-ci.org/601-H17/pathfinder-api.svg?branch=master)](https://travis-ci.org/601-H17/pathfinder-api)

To install NodeJS, follow this [guide](https://nodejs.org/en)

### 1. In a terminal, you need to go in the project directory:
```bash
$ cd the_project/
```

### 2. When you're in, restore all the dependencies:
```bash
$ npm install
```
### 3. Build the project:
```bash
$ npm run build
```
*Note: You have to build everytime the project is updated.*

### 4. Start the server: 
```bash
$ npm start
```

### 5. Run unit tests:
```bash
$ npm test 
```

#### You can use [Postman](https://www.getpostman.com) too to call the API.
#### GET a path with 2 params ```(localA and localB)```: [localhost:8080/api/pathfinder](localhost:8080/api/pathfinder)
#### POST a new corridors map with map json ```({map : /* map infos */})```: [localhost:8080/api/pathfinder/corridor s](localhost:8080/api/pathfinder/corridors)

*Note: Babel est utilisé, car les "async/await" ne sont pas encore gérés par le compilateur. Normalement, à partir de Mai 2017, ils seront gérés et Babel pourra être retiré.*
