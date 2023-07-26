const express = require('express')
const app = express()
const morgan = require('morgan')
const db = require('mongoose')
const {
    dbUrl,
    createUser,
    signin,
    getUser,
    getAllUser,
    updateUser,
    removeUser,
    addToCart,
    deleteFromCart
} = require('./db/mongodb')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const getIdFromJWT = require('./authentication/auth')
const {
    getAllProducts,
    addProduct,
    getProductById,
    deleteProductById,
    updateProductById
} = require('./db/cartdb')
const adminAccess = require('./authentication/isAdmin')
const e = require('express')
db.connect(dbUrl)
    .then(() => {
        console.log('data connected')
        app.listen(8080, () => console.log('server is up'))
    })


    const jwtKey =  process.env.JWT


function createToken(id) {
    return jwt.sign({
        id
    }, 'this is my secret token, dont stole it please')
}

app.set('view engine', 'ejs');
app.set('views', 'website');

//midle wear
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(cookie())
app.use(morgan('dev'))
app.use(express.static('public'))



app.use(getIdFromJWT, (req, res, next) => {
    const userId = req.userId;
    if (userId) {
        getUser(userId)
            .then((ret) => {
                if (ret) {
                    req.obj = ret
                    console.log('in app.js getidfromjwt middleware')
                    console.log(req.obj)
                } else {
                    req.obj = null
                }
                console.log(' getidfromjwt middleware exit with success')
                next()
            })
            .catch((error) => {
                console.error(error);
                req.obj = null;
                next()
            });
    } else {
        req.obj = null
        next()
    }
});


app.use(adminAccess)



app.get('/registration', (req, res) => {
    if (req.obj) {
        res.redirect('/');
    }
    res.render('registration', {
        dataObj: req.obj, active: 'registration'
    })
})


app.get('/signin', (req, res) => {
    const dataObj = req.obj;
    if (dataObj) {
        res.redirect('/');
    } else {
        res.render('signin', {
            dataObj, active : 'signin'
        });
    }
})




app.post('/user/create', (req, res) => {
    var data = req.body
    createUser(data)
        .then((ret) => {
            if (ret.created) {
                const token = createToken(ret.id)
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 5
                })
                res.send(JSON.stringify('ok'))
            } else {
                res.send(JSON.stringify(ret))
            }
        })

})


app.delete('/user/delete/:id', (req, res,next) => {
    const id = req.params.id
    const dataObj = req.obj
    const admin = req.admin
    console.log(id,'................................................')

    if (dataObj){

        if(admin){

            removeUser(id)
            .then(respond=>{
                res.redirect('/users')
            })

        }else{
            next()
        }

    } else{
        res.redirect('/signin')
    }

    
})





app.post('/user/signin', (req, res) => {
    var data = req.body
    console.log(data)
    signin(data)
        .then((ret) => {
            // console.log(ret)
            const retObj = JSON.parse(ret)
            // console.log(retObj)
            if (retObj.created) {
                const token = createToken(retObj.id)
                // console.log(token)
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 5
                })
                res.send(JSON.stringify('ok'))
            } else {
                res.send(ret)
            }

        })

})

app.get('/logout', (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/');
})

app.get('/profile', (req, res) => {
    const admin = req.admin;
    const dataObj = req.obj;
    if (dataObj) {
        res.render('profile', {
            dataObj,
            active: 'profile',
            admin
        });
    } else {
        res.redirect('/signin');
    }
})

app.get('/cart', async (req, res) => {
    const admin = req.admin;
    const dataObj = req.obj;
    const products = await getAllProducts()
    if (dataObj) {
        res.render('cart', {
            dataObj,
            active: 'cart',
            admin,
            products
        });
    } else {
        res.redirect('/signin');
    }
})





app.delete('/cart/delete/:id', (req, res) => {
    if (req.obj){
    const id = req.params.id
    // console.log(id)
    deleteFromCart(req.obj._id,id)
    .then(r =>{
        res.send(JSON.stringify('ok'))
    })
}
else{
    res.redirect('/signin')
}
})




app.put('/cart/add/:id', (req, res) => {
    const product_id = req.params.id
    const user_id = req.obj._id.toString()
    addToCart(user_id, product_id)
    .then(respond =>{
        res.status(200).send(JSON.stringify('ok'))
    }
    )
})









app.get('/users', async (req, res, next) => {
    const admin = req.admin;
    const dataObj = req.obj;
    if (dataObj) {
        if (admin) {
            getAllUser()
                .then(users => {
                    // console.log(users, '...................................')
                    res.render('users', {
                        dataObj,
                        active: 'users',
                        admin,
                        users
                    });
                })
        } else {
            next()
        }
    } else {
        res.redirect('/signin');
    }
})


app.put('/users/update/:id', async (req, res, next) => {
    const id = req.params.id
    const user = req.body
    if (req.obj) {
        if (req.admin) {
            // console.log(id)
            const answer = await updateUser(id, user)
            console.log('updated')
            res.send(JSON.stringify(answer))
        } else {
            console.log('not updated')
            next()
        }
    } else {
        res.redirect('/signin')
    }
})



app.get('/users/:id', async (req, res, next) => {

    const admin = req.admin;
    const dataObj = req.obj;
    if (dataObj) {
        if (admin) {
            const id = req.params.id
            const user = await getUser(id)
            if (user) {
                res.render('user', {
                    dataObj: req.obj,
                    active: 'users',
                    admin: req.admin,
                    user
                })
            } else {
                next()
            }
        } else {
            next()
        }
    } else {
        res.redirect('/signin');
    }
})

app.get('/product/create', (req, res, next) => {
    const admin = req.admin;
    const dataObj = req.obj;
    if (dataObj) {
        if (admin) {
            res.render('addProduct', {
                dataObj,
                active: 'create',
                admin
            });
        } else {
            next()
        }
    } else {
        res.redirect('/signin');
    }
})


app.post('/product/create', async (req, res, next) => {
    const admin = req.admin;
    const dataObj = req.obj;
    if (dataObj) {
        if (admin) {
            const done = await addProduct(req.body, dataObj)
            console.log(done)
            res.send(JSON.stringify(done))
            // res.render('addProduct', {dataObj , active : 'users',admin});
        } else {
            next()
        }
    } else {
        res.redirect('/signin');
    }
})




app.get('/product/:id', async (req, res, next) => {
    const id = req.params.id
    const product = await getProductById(id)
    if (product) {
        res.render('product', {
            dataObj: req.obj,
            active: 'product',
            admin: req.admin,
            product
        })
    } else {
        next()
    }
})



app.put('/product/update/:id', async (req, res, next) => {
    const id = req.params.id
    const product = req.body
    if (req.obj) {
        if (req.admin) {
            console.log(id)
            console.log(product)
            const answer = await updateProductById(id, product)
            console.log('updated')
            res.send(JSON.stringify(answer))
        } else {
            console.log('not updated')
            next()
        }
    } else {
        res.redirect('/signin')
    }
})





app.delete('/product/delete/:id', async (req, res, next) => {
    const id = req.params.id
    if (req.obj) {
        if (req.admin) {
            const answer = await deleteProductById(id)
            console.log('deleted')
            res.send(JSON.stringify(answer))
        } else {
            console.log('not deleted')
            next()
        }
    } else {
        res.redirect('/signin')
    }
})




app.get('/', async (req, res) => {
    const admin = req.admin;
    const dataObj = req.obj;
    const products = await getAllProducts()
    // console.log(products)
    res.render('home', {
        dataObj,
        active: 'home',
        products,
        admin
    });
})



app.use((req, res) => {
    res.render('404', {
        dataObj: req.obj,
        active: '404',
        admin: req.admin
    })
})