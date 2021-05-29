var express = require("express");
var router = express.Router();

const list_controller = require("../controllers/listController");

/* GET users listing. */
router.get("/", list_controller.get_lists);
router.get("/:id", list_controller.get_list);
router.get("/:id/cards", list_controller.get_list_cards);

router.post("/create", list_controller.create_list);
router.post("/:id/update", list_controller.update_list);
router.post("/:id/delete", list_controller.delete_list);

module.exports = router;
