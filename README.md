# Path finder API

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

### 5. Run integration tests:
```bash
$ npm test ./test/apiTests.js
$ npm test ./test/pathfinderTests.js
```

#### You can use [Postman](https://www.getpostman.com) too to call the API.
#### GET a path with 2 params (localA and localB): [localhost:8080/api/pathfinder](localhost:8080/api/pathfinder)
#### POST a new corridors map with map json ({map : /* map infos */}): [localhost:8080/api/pathfinder/corridor s](localhost:8080/api/pathfinder/corridors)

### **Cas à gérer.**
#### 1. Pathfind d'une aile vers l'autre
#### 2. Pathfind plus complexe, exemple : startFloor = 1 / endFloor = 3 , mais il n'y a aucun escalier qui se rend à l'étage. Un escalier se rend du premier au        deuxième étage et un autre du deuxième au troisième étage. 
