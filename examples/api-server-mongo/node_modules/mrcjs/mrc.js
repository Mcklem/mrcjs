'use strict';

var fs = require("fs"),
    path = require('path'),
	glob = require( 'glob' );

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
api.model_modules = {};
api.controller_modules = {};
api.controllers = {};
api.route_modules = {};
api.settings = {};

var feedback = {};
feedback.model_modules = {};
feedback.middleware_modules = {};
feedback.controller_modules = {};
feedback.route_modules = {};

var initialize = function(dir, express){
    __root = dir;
    app = express;
    modelsPath = path.join(__root, 'api', 'models');
    routesPath = path.join(__root, 'api', 'routes');
    controllersPath = path.join(__root, 'api', 'controllers');
	middlewaresPath =  path.join(__root, 'api', 'middlewares');
    settingsPath =  path.join(__root, 'api', 'settings.json');
    loadSettings();
}

var loadSettings = function(){ 
    api.settings = require(settingsPath);
    if(api.settings.logReportPath==undefined) api.settings.logReportPath = "./api-report.log";
}

var loadModelModules = function(){ 
    
    glob.sync( modelsPath + '/**/*.js' ).forEach( function( file ) {
        var fileName = path.basename(file, path.extname(file));
        feedback.model_modules[fileName] = {};
        feedback.model_modules[fileName].loaded = false;
        try
        {       
            var module = require(path.resolve(file));
            api.model_modules[fileName] = module;
            feedback.model_modules[fileName].loaded = true;
            //console.log("Model module loaded: " + fileName);
        }
        catch(err) {
            feedback.model_modules[fileName].error = err.stack;
        }
	});
}

var loadControllerModules = function(){
    glob.sync( controllersPath + '/**/*.js' ).forEach( function( file ) {  
        var fileName = path.basename(file, path.extname(file));
        feedback.controller_modules[fileName] = {};
        feedback.controller_modules[fileName].loaded = false;
        try
        {
            //console.log("Controller module found: " + fileName);
            if(api.settings.api_modules[fileName]===undefined){
                feedback.controller_modules[fileName].error = "Not found " + fileName + " in settings file";
                return;
            }
            else if(api.settings.api_modules[fileName].enabled==false){ 
                feedback.controller_modules[fileName].error =  "Controller module " + fileName + " is disabled";
                return; 
            }
            var module = require(path.resolve(file));
            api.controller_modules[fileName] = module;
            appendModule(api.controllers, module);
            //console.log("Controller module loaded: " + fileName);
            feedback.controller_modules[fileName].loaded = true;
        }
        catch(err) {
            feedback.controller_modules[fileName].error = err.stack;
        }
	});
}

var loadRouteModules = function(){
    glob.sync( routesPath + '/**/*.js' ).forEach( function( file ) {
        var fileName = path.basename(file, path.extname(file));
        feedback.route_modules[fileName] = {};
        feedback.route_modules[fileName].loaded = false;
        try
        {
            //console.log("Route module found: " + fileName);
            if(api.settings.api_modules[fileName]===undefined){
                feedback.route_modules[fileName].error = "Not found " + fileName + " in settings file";
                return;
            }
            else if(api.settings.api_modules[fileName].enabled==false){ 
                feedback.route_modules[fileName].message = "Route module " + fileName + " is disabled";
                return;
            }
            var module = require(path.resolve(file));
            api.route_modules[fileName] = module;
            module(app, api.controller_modules[fileName]);
            feedback.route_modules[fileName].loaded = true;
            //console.log("Route module loaded: " + fileName);
        }
        catch(err) {
            feedback.route_modules[fileName].error = err.stack;
        }
	});
    
    //SAVE ROUTE FEEDBACKS
    feedback.routes = [];
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        feedback.routes.push(r.route.path);
      }
    });
}

var loadMiddlewareModules = function(){  
    //Require middleware Modules
	glob.sync( middlewaresPath + '/**/*.js' ).forEach( function( file ) {
        var fileName = path.basename(file, path.extname(file));
        feedback.middleware_modules[fileName] = {};
        feedback.middleware_modules[fileName].loaded = false;
        try
        {
            var module = require(path.resolve(file));
            api.middleware_modules[fileName] = module;
            appendModule(api.middlewares, module);
            //console.log("Middleware module loaded: " + fileName);
            feedback.middleware_modules[fileName].loaded = true;
            //Apply config
            for(var middlewareId in api.settings.middlewares){
                
                var middleware = api.settings.middlewares[middlewareId];
                if(module[middlewareId]===undefined){
                    continue;
                }
                
                feedback.middleware_modules[fileName][middlewareId] = {};
                feedback.middleware_modules[fileName][middlewareId].routes = [];
                for(var index in middleware.routes){
                    var route = middleware.routes[index];
                    app.use(route, api.middlewares[middlewareId]);
                    feedback.middleware_modules[fileName][middlewareId].routes.push(route);
                }
                
            }
        }
        catch(err) {
            feedback.middleware_modules[fileName].error = err.stack;
        }
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

var logReport = function(){
    if(api.settings.logReport){      
        try{
            var report = JSON.stringify(feedback, null, 2);
            fs.writeFile(api.settings.logReportPath, report, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
        }
        catch(err) {
            console.log(err.stack);
        }
    }
}

exports.initialize = function(dir, express){
    initialize(dir, express);
    loadModelModules();
	loadMiddlewareModules();
    loadControllerModules();
    loadRouteModules();
    logReport();
}
