const express = require("express")
const PostController = require("../controllers/PostController")
const { authentication } = require("../midlewares/authentication")
const router = express.Router()

router.post("/",authentication, PostController.create)
router.get("/",PostController.getAll)
router.get("/id/:id",PostController.getById)
router.get("/title/:title",PostController.getOneByName)
router.delete("/id/:id",PostController.delete)

module.exports = router