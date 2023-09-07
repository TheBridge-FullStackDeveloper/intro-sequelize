const express = require("express")
const { typeError } = require("./midlewares/errors")
const app = express()
const PORT = 3000
const cors = require("cors")
//middlware
app.use(express.json())
app.use(cors())
//rutas prefijo
app.use("/users",require("./routes/users"))
app.use("/posts",require("./routes/posts"))

//middlware errores
app.use(typeError)

app.listen(PORT,()=>console.log(`Servidor levantado en el puerto ${PORT}`))

module.exports = app;