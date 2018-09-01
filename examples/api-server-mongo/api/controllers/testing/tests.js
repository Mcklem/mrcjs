
exports.test_get = function(req, res) {
  console.log("get tested");
  res.send('get tested ' + req.params);
};

exports.test_post = function(req, res) {
  console.log("post tested");
  res.send('post tested ' + req.params);

};

exports.create_test = function(req, res) {
  var new_test = new Test(req.body);
  new_test.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
    console.log("created task " + task);
  });
};
