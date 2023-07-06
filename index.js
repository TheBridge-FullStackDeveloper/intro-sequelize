const express = require("express")
const { typeError } = require("./midlewares/errors")
const app = express()
const PORT = 3000

//middlware
app.use(express.json())

//rutas prefijo
app.use("/users",require("./routes/users"))
app.use("/posts",require("./routes/posts"))

//middlware errores
app.use(typeError)

app.listen(PORT,()=>console.log(`Servidor levantado en el puerto ${PORT}`))