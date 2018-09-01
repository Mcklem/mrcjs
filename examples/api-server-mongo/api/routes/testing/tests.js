'use strict';
module.exports = function(app, controller) {

  // todoList Routes
  app.route('/test')
    .get(controller.test_get)
    .post(controller.test_post);

};
