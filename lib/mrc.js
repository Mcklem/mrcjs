'use strict';

var fs = require("fs"),
    path = require('path');

var modelsPath,//MODELS PATH
routesPath,//ROUTES PATH
controllersPath,//CONTROLLERS PATH
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
    settingsPath =  path.join(__root, 'api', 'settings.json');
    settings = require(settingsPath);
}

//Generic data loader, gets all files in all directories
var loadData = function(dirPath, onFileFound, OnDirectoryFound){
    fs.readdirSync(dirPath).forEach(function(file) {       
        var filePath = path.join(dirPath, file);
        if(!fs.lstatSync(filePath).isDirectory()){ 
            onFileFound(filePath, file);
        }
        else OnDirectoryFound(filePath);
    });
};

var loadModels = function(dirPath){   
    loadData(dirPath,function(filePath, file){
        require(filePath);
        console.log("Loaded model: " + file);
    },
    function(filePath){
        loadModels(filePath);
    });
};

//Check and get model existence
//Check and get route existence
//Check settings, if exists, if enabled is false, continue to next, else set route
var loadControllersAndRoutes = function(app){    
    settings.route_groups.forEach(function(element) {
        console.log("Found route group: " + element.name + " enabled " +  element.enabled);
        if(!element.enabled) return;
        var controller = require(path.join(controllersPath, element.name));
        var route = require(path.join(routesPath, element.name));
        route(app, controller);
    });
};

exports.initialize = function(dir, express){
    initialize(dir, express);
    loadModels(modelsPath);
    loadControllersAndRoutes(app);
}