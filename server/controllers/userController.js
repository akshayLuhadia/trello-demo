const User = require("../models/user");
const List = require("../models/list");
const async = require("async");

exports.user_list = function (req, res, next) {
  User.find().exec(function (err, list_users) {
    if (err) return next(err);
    res.send(list_users);
  });
};

exports.get_user = function (req, res, next) {
  async.parallel(
    {
      user: function (callback) {
        User.findById(req.params.id).exec(callback);
      },
      lists: function (callback) {
        List.find({ user: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.user) {
        const { user, lists } = results;
        res.send({...user._doc, lists});
      }
    }
  );
};
