var express = require("express");
var router = express.Router();

const card_controller = require("../controllers/cardController");

/* GET users listing. */
router.get("/", card_controller.get_cards);
router.get("/:id", card_controller.get_card);

router.post("/create", card_controller.create_card);
router.post("/:id/update", card_controller.update_card);
router.post("/:id/delete", card_controller.delete_card);

module.exports = router;
