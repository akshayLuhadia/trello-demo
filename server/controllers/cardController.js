const Card = require("../models/card");

exports.get_cards = function (req, res, next) {
  Card.find().exec(function (err, cards) {
    if (err) return next(err);
    res.send(cards);
  });
};

exports.get_card = function (req, res, next) {
  Card.findById(req.params.id)
    .populate("list")
    .exec(function (err, card) {
      if (err) return next(err);
      res.send(card);
    });
};

exports.delete_card = function (req, res, next) {
  Card.findByIdAndRemove(req.body.id, function (err) {
    if (err) return next(err);
    res.send(true);
  });
};

exports.update_card = function (req, res, next) {
  const { body } = req;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Error",
    });
  }
  const card = new Card({ ...body, _id: req.params.id });

  Card.findByIdAndUpdate(req.params.id, card, {}, function (err, updatedCard) {
    if (err) return next(err);
    res.send(updatedCard);
  });
};

exports.create_card = function (req, res, next) {
  const { body } = req;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Error",
    });
  }
  Card.find({ list: body.list })
    .sort("-position")
    .select("position")
    .exec(function (err, sortedCards) {
      if (err) next(err);
      let card = {
        title: body.title,
        list: body.list,
        position: 1,
      };
      if (sortedCards.length > 0) {
        const { position } = sortedCards[0];
        card = {
          ...card,
          position: position + 1,
        };
      }
      const cardPayload = new Card({ ...card });
      cardPayload.save(function (err) {
        if (err) return next(err);
        res.send(cardPayload);
      });
    });
};
