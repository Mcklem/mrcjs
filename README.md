# MRC.js

>A simple project to keep order in the caotic world of NodeJs web servers


MRCJS is a Node.js library that will let you to organize your web server easily following a MVC folder pattern, applied as route group sistems.

  - Create some models inside the /api/models folder.
  - Create some controllers inside the /api/controllers folder.
  - Create some routes inside the /api/routes folder.

# Lastest Features!

  - recursive models, controllers and routes finding, so you can create your own folder organization inside the MVC pattern.
  - Basic settings, enable or disable groups of routes (by relative file path)

Following two basic principles, to keep our server faster and easier to mantain

> Order and Simplicity


### Requeriments

Dillinger uses a number of open source projects to work properly:

* [node.js] - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Express] - Fast, unopinionated, minimalist web framework for Node.js


### Installation

MRCJS requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```
$ npm install mvcjs --save
```

Express install required
```
$ npm install express --save
```

Declare requires and initialize call

```
var express = require('express'),
  app = express(),
  mrc = require('mrcjs');
  
//Do app initializations e.g: app.use(bodyParser.urlencoded({ extended: true }));

mrc.initialize(__dirname, app);

//Start listening: app.listen(port);
```

### Development

Do you Want to contribute? 

Follow the project and create a pull request, all help is welcome.

### Todos

 - More setting file options to control our MVC pattern
 - Get user feedbacks

License
----

>**MIT**
>Free Software, All by everyone, all to everyone



