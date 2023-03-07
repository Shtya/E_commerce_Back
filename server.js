const path              = require("path")
const express           = require("express")
const dotenv = require("dotenv")

dotenv.config({path:".env"})
const morgan = require('morgan')

const compression       = require("compression")
const cors              = require("cors")

const {globalError}     = require("./util/GlobalError")
const mounte            = require("./routes/index")
const { webhookCheckout } = require("./controller/C_order")
const connectiondb      = require("./config/db")

connectiondb()





const app = express()
app.use(cors())
app.options("*", cors())
app.enable("trust proxy")


app.post('/webhook', express.raw({type: 'application/json'}),webhookCheckout );


app.use(express.json())
app.use(express.urlencoded({ extended: false , limit:"10kb" }))
app.use(express.static(path.join(__dirname, "uploads")))

app.use(cors())
app.use(compression())
app.use(morgan("dev"))
mounte(app)

app.use(cors())

// ) Catch Error
app.all("*", (req, res, next) => {
  next(new Error (`can't find this route : ${req.originalUrl}`))
})
app.use(globalError)


let port = process.env.PORT || 6000
app.listen(port , _=> console.log(`Server is running on ${port}`))
