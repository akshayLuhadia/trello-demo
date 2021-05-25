const List = require("../models/list");
const Card = require("../models/card");
const async = require("async");

exports.get_lists = function (req, res, next) {
  List.find({}).exec(function (err, lists) {
    if (err) return next(err);
    res.send(lists);
  });
};

exports.get_list = function (req, res, next) {
  async.parallel(
    {
      list: function (callback) {
        List.findById(req.params.id).exec(callback);
      },
      cards: function (callback) {
        Card.find({ list: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.list) {
        res.send({ ...results.list._doc, cards: results.cards });
      }
    }
  );
};

exports.get_list_cards = function (req, res, next) {
  Card.find({ list: req.params.id }).exec(function (err, cards) {
    if (err) return next(res);
    res.send(cards);
  });
};

exports.delete_list = function (req, res, next) {
  List.findByIdAndRemove(req.body.id, function (err) {
    if (err) return next(err);
    res.send(true);
  });
};

exports.update_list = function (req, res, next) {
  const { body } = req;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Error",
    });
  }
  const list = new List({ ...body, _id: req.params.id });

  List.findByIdAndUpdate(req.params.id, list, {}, function (err, updatedList) {
    if (err) return next(err);
    res.send(updatedList);
  });
};

exports.create_list = function (req, res, next) {
  const { body } = req;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Error",
    });
  }
  const list = new List({
    title: body.title,
    user: body.user,
  });
  list.save(function (err) {
    if (err) return next(err);
    res.send(list);
  });
};
