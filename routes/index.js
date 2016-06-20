var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../private/users.js');
var Blog = require('../private/blog.js');

router.post('/user/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/user/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/user/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/user/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });

});

router.post('/blog/load_all', function(req, res) {
    Blog.find(function (err, posts) {
        if (err) {
          return res.status(500).json({
            err: 'Could not load blog posts'
          });
        }
        return res.status(200).json({
          status: 'Successfuly loaded all posts',
          posts: posts
        });
    });
});

router.post('/blog/create', function(req, res) {
    var newPost = new Blog({
      title:  req.body.title,
      author: req.body.author,
      body:   req.body.body,
      comments: [],
      hidden: false,
      meta: {
        votes: 0,
        favs:  0
      }
    });

    newPost.save(function (err, fluffy) {
      if (err) {
        return res.status(500).json({
          err: 'Could not create new post.'
        });
      }
      res.status(200).json({
        status: "Created and saved this new post"
      });
    });
});

router.get('/', function(req, res) {
  console.log(req.user);
    res.render('index', {user: req.user})
});

module.exports = router;