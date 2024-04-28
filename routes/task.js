var express = require('express');
var router = express.Router();
var Task = require('../models/task');

router.get('/createTask', function(req, res) {
    var newTask = new Task();
    newTask.save()
    .then(data => {
      res.redirect('/task/' + data._id);
    })
    .catch(err => {
      res.render('error');
    });
});


router.get('/task/:id', async function(req, res) {
    try {
      if (req.params.id) {
        const data = await Task.findOne({ _id: req.params.id });
        if (data) {
          res.render('task', {content: data.content, roomId: data.id});
        } else {
          res.render('error');
        }
      } else {
        res.render('error');
      }
    } catch (err) {
      res.render('error');
    }
});

module.exports = router;
  