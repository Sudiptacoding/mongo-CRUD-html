var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 4000
// 
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const productSchima = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const productModel = mongoose.model('products', productSchima);

const DBcunnect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/product');
        console.log('DB Cunnect Successfully');
    } catch (error) {
        console.log(error)
    }
}


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post('/product', async (req, res) => {
    try {
        const Product = req.body;
        const newProduct = new productModel({
            name: Product.name,
            price: Product.price,
            quantity: Product.quantity
        })
        await newProduct.save();
        res.redirect('/')
    } catch (error) {
        res.status(404).send(error);
    }
})

app.get('/product', async (req, res) => {
    try {
        const product = await productModel.find({});
        if (product) {
            res.status(200).send(product)
        } else {
            res.status(404).send({ message: 'Product not found' })
        }
    } catch (error) {
        res.status(502).send(error.message)
    }
})

app.delete('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const delet = await productModel.findByIdAndDelete({ _id: id })
        res.send(delet);
    } catch (error) {
        res.status(502).send(error.message)
    }

})

app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const findsingleProduct = await productModel.findOne({ _id: id })
        if (findsingleProduct) {
            res.status(200).send(findsingleProduct)
        } else {
            res.status(404).send("Single product not found")
        }
    } catch (error) {
        res.status(502).send(error.message);
    }
})

app.patch('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updetDeta = req.body;
        const upded =  await productModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: updetDeta.name,
                price: updetDeta.price,
                quantity: updetDeta.quantity
            }
        })
        res.send(upded)
    } catch (error) {
        res.status(502).send(error.message);
    }
})






app.listen(port, async () => {
    await DBcunnect();
    console.log(`localhost runn https://${port}`)
})