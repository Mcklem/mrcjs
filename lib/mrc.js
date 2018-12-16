'use strict';

var fs = require("fs"),
    path = require('path');

var modelsPath,//MODELS PATH
routesPath,//ROUTES PATH
controllersPath,//CONTROLLERS PATH
middlewaresPath,
settingsPath,//SETTINGS PATH
settings,//SETTINGS JSON
__root,//ROOT PATH
app;//EXPRESS INSTANCE REFERENCE


var initialize = function(dir, express){

    __root = dir;
    app = express;
    modelsPath = path.join(__root, 'api', 'models');
    routesPath = path.join(__root, 'api', 'routes');
    controllersPath = path.join(__root, 'api', 'controllers');
	middlewaresPath =  path.join(__root, 'api', 'middlewares');
    settingsPath =  path.join(__root, 'api', 'settings.json');
    settings = require(settingsPath);
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

var loadModels = function(dirPath){
    loadData(dirPath,function(filePath, file){
        require(filePath);
        console.log("Loaded model: " + file);
    },
    function(filePath){
        loadModels(filePath);
    },
    function(filePath){
        console.error("Unable to load " + file + ", file not found: " + filePath);
    });
};

var loadControllersAndRoutes = function(app){
	
	for(var module in settings.api_modules){
		
		var element = settings.api_modules[module];
		
		console.log("Found route group: " + module + ", enabled: " +  element.enabled);
		if(!element.enabled) return;


  		let controllerPath = path.join(controllersPath, module);
  		let routePath = path.join(routesPath, module);

		try {
		var controller = require(controllerPath);
			var route = require(routePath);
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

exports.initialize = function(dir, express){
    initialize(dir, express);
    loadModels(modelsPath);
    loadControllersAndRoutes(app);
	//loadMiddlewares(middlewaresPath);
}
