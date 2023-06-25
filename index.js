const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mc_delivery'
})

con.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DB Connected!")
    }
})
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))// support encoded bodies

//create new user account
app.post('/createUser', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    con.query('INSERT INTO users(email,password) VALUES(?,?)', [email, password], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

//login to application
app.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    con.query('SELECT * FROM users WHERE email=? AND password=?', [email, password], (err, result) => {
        if (err) {
            res.send(err)
        } else {
            if (result.length > 0) {
                res.send(result[0])
            } else {
                res.send("Email or password does not match!")
            }

        }
    })
})

//get breakfase or regular menu
app.get('/getAllCategories/:menu_type', (req, res) => {
    var menu_type = req.params.menu_type;
    con.query('SELECT * FROM menu_categories WHERE menu_type=? OR menu_type=?', [menu_type, 2], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

//get items on category
app.get('/getItems/:category_id', (req, res) => {
    var category_id = req.params.category_id;
    con.query('SELECT * FROM item WHERE category_id=?', [category_id], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

//get coupon's promotion percentage
app.get('/checkCoupon/:coupon_code', (req, res) => {
    var coupon_code = req.params.coupon_code;
    //get valid coupon
    con.query('SELECT coupon_amount_percent FROM coupon WHERE status=1 AND coupon_code=?', [coupon_code], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            if (result.length > 0)
                res.send(result[0])
            else
                res.send("Invalid coupon code!")
        }
    })
})

//add delivery address
app.get('/addAddress', (req, res) => {
    var user_id = req.body.user_id;
    var delivery_address = req.body.delivery_address;
    var unit = req.body.unit;
    var postal_code = req.body.postal_code;
    var contact_number = req.body.contact_number;

    con.query('INSERT INTO user_address(user_id, delivery_address, postal_code, contact_number, unit) VALUES (?,?,?,?,?)', [user_id, delivery_address, postal_code, contact_number, unit], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

app.listen(3001, (err) => {
    if (err) {
        console.log("error in running port 3001")
    } else {
        console.log("running on port 3001")
    }

})