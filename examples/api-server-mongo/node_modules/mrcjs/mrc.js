'use strict';

var fs = require("fs"),
    path = require('path');

var modelsPath,//MODELS PATH
routesPath,//ROUTES PATH
controllersPath,//CONTROLLERS PATH
middlewaresPath,
customModulesPath,
settingsPath,//SETTINGS PATH
__root,//ROOT PATH
app;//EXPRESS INSTANCE REFERENCE

var api = {};
api.middleware_modules = {};
api.middlewares = {};
api.models = {};
api.controller_modules = {};
api.controllers = {};
api.route_modules = {};

var initialize = function(dir, express){
    __root = dir;
    app = express;
    modelsPath = path.join(__root, 'api', 'models');
    routesPath = path.join(__root, 'api', 'routes');
    controllersPath = path.join(__root, 'api', 'controllers');
	middlewaresPath =  path.join(__root, 'api', 'middlewares');
    settingsPath =  path.join(__root, 'api', 'settings.json');
    api.settings = require(settingsPath); 
}

//Generic data loader, gets all files in all directories
var loadData = function(dirPath, onFileFound, OnDirectoryFound, OnFileNotFound){
    fs.readdirSync(dirPath).forEach(function(file) {
        var filePath = path.join(dirPath, file);
		if(fs.existsSync(filePath)){
			if(!fs.lstatSync(filePath).isDirectory()){
				onFileFound(filePath, file);
			}
			else OnDirectoryFound(filePath);
		}
		else OnFileNotFound(filePath);
    });
};

var loadModels = function(){
    loadData(modelsPath,function(filePath, file){
        var model = require(filePath);
        api.models[path.basename(filePath, path.extname(filePath))] = model;
        console.log("Loaded model: " + file);
    },
    function(filePath){
        loadModels(filePath);
    },
    function(filePath){
        console.error("Unable to load " + file + ", file not found: " + filePath);
    });
};

var loadControllersAndRouteModules = function(app){
	
	for(var module in api.settings.api_modules){
		
		var element = api.settings.api_modules[module];
		
		console.log("Found api module: " + module + ", enabled: " +  element.enabled);
        
		if(!element.enabled) continue;

  		let controllerPath = path.join(controllersPath, module);
  		let routePath = path.join(routesPath, module);

		try {
            var controller = require(controllerPath);
            controller.api = api;
            api.controller_modules[path.basename(controllerPath, path.extname(controllerPath))] = controller;
            appendModule(api.controllers, controller);
            
			var route = require(routePath);
            api.route_modules[path.basename(routePath, path.extname(routePath))] = route;
            
            //pass argument to route method
		    route(app, controller);
		}
		catch (e) {
			if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
				console.error("Can't load " + module + "\n" + e);
			else
				throw e;
		}
	}
};

var loadMiddlewareModules = function(app){
	requireMiddlewares();
	for(var middlewareId in api.settings.middlewares){
		
		var element = api.settings.middlewares[middlewareId];
			
		for(var index in element.routes){
			var route = element.routes[index];
			app.use(route, api.middlewares[middlewareId]);
            console.log("Using middleware: " +  middlewareId + " for route " + route);
		}
	}
};

var requireMiddlewares = function(){
    loadData(middlewaresPath,function(filePath, file){
        var middleware = require(filePath);
        api.middleware_modules[path.basename(filePath, path.extname(filePath))] = middleware;
        appendModule(api.middlewares, middleware);
        console.log("Loaded middleware module: " + file);
    },
    function(filePath){
        requireMiddlewares(filePath);
    },
    function(filePath){
        console.error("Unable to middleware module " + file + ", file not found: " + filePath);
    });
};

//Append function from module to list
var appendModule = function(dict, module){
    for(var func in module){
        dict[func] = module[func];
    }
}
/*
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}*/

exports.initialize = function(dir, express){
    initialize(dir, express);
    loadModels();
	//Load JS and then read json to apply each exported function to each defined path
	loadMiddlewareModules(app);
    loadControllersAndRouteModules(app);
}
