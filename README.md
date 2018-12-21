


# MRC.js

>A simple project to keep order in the caotic world of NodeJs web servers


MRCJS is a Node.js library that will let you to organize your web server easily following a MVC folder pattern, applied as route group sistems.

  - Create some models inside the /api/models folder.
  - Create some controllers inside the /api/controllers folder.
  - Create some routes inside the /api/routes folder.
  - Create some middlewares inside the /api/middlewares folder.
  
  All Models, Controllers and Routes will be imported automatically (middlewares too)
  
  Just a json file config is required.
  
   - Create  /api/settings.json
   
Each api_module in api_modules must match with the name of the module in models, controllers and routes.
   
   e.g:    (you can place any module, this is just a small example)
   
>/api/models/users.js

>/api/controllers/users.js

>/api/routes/users.js

>/api/models/login.js

>/api/controllers/login.js

>/api/routes/login.js

>/api/middlewares/application.js //request login and app middlewares

>/api/middlewares/security.js //token and others
   
   You can apply more than one route for a middleware,  the name of the middleware must be defined in the middleware module at "middlewares" folder
   
   Set property "enabled" of module "foo" to false before start the server to avoid loading of any controller or rute. (Models will be loaded to avoid dependency issues) 

  If "logReport" property is enabled, a full report of loaded modules will be created
  
  Property "logReportPath" is "./api-report.log" by default, you can override it at settings file

"settings.json" example bellow
  
	  {
		"middlewares":{
			"logRequest":{
				"description": "Display basic info about each request",
				"routes":["/"]
			},
			"tokenVerification":{
				"description": "Detects the header 'x-access-token' otherwise the access is not allowed",
				"routes":["/api"]
			}
		},
		"api_modules":{
			"users":{
				"description": "Manage users of the current application",
				"enabled": true
			},
			"login":{
				"description": "Login system, client verification",
				"enabled": true
			}
		},
	    "logReport": true
	}	

  ```
$ npm install mrcjs --save
```
  
# Lastest Features!

  (0.0.9&<0.0.9) 
  - Recursive models, controllers and routes finding, so you can create your own folder organization inside the MVC pattern.
  - Basic settings, enable or disable groups of routes (by relative file path.
  
  (1.0.0) 
  - Better human readable settings.json.
  - Middleware recursive module loading and document declaration.

(1.0.4) 
	- Better and faster module loading due "glob" library 	(https://www.npmjs.com/package/glob) (thank you)
	- Full report as json format will be generated, by default is disabled, but it can be enabled with "logReport" property at settings file

Following two basic principles, to keep our server faster and easier to mantain

> Order and Simplicity


### Requeriments

Just this libraries are required to work properly:

* [node.js] - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Express] - Fast, unopinionated, minimalist web framework for Node.js


### Installation

MRCJS requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```
$ npm install mrcjs --save
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

Do you want to contribute? 

Follow the project and create a pull request, all help is welcome.

### Todos

 - More setting file options to control our MRC + M pattern (Model, Routes, Controller + Middleware)
 - Get user feedbacks


License
----

>**MIT**
>Free Software, All by everyone, all to everyone



