const express = require("express")
const UserController = require("../controllers/UserController")
const { authentication, isAdmin } = require("../midlewares/authentication")
const router = express.Router()

router.post("/",UserController.create)
router.get("/",authentication,UserController.getAll)
router.put("/id/:id",authentication,UserController.update)
router.delete("/id/:id",authentication, UserController.delete)
router.post("/login",UserController.login)
router.delete("/logout",authentication,UserController.logout)
router.get("/confirmed/:email", UserController.confirm)

module.exports = router;