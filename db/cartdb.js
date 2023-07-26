const db = require('mongoose')
const Schema = db.Schema

const ProductSchema = new Schema({
    added_by: {
        required: true,
        type: String
    },
    added_by_username:{
        required: true,
        type: String
    },
    product_name: {
        required: true,
        type: String
    },
    product_price: {
        required: true,
        type: Number
    },
    product_image: {
        required: true,
        type: String
    },
    product_description: {
        required: true,
        type: String
    },
    product_category: {
        required: true,
        type: String
    },
    product_quantity: {
        required: true,
        type: Number
    }})


const Product = db.model('Product', ProductSchema)

async function addProduct(product,author) {
    try {
        const newProduct = new Product({
            added_by: author._id,
            added_by_username: author.user_name,
            product_name: product.product_name,
            product_price: product.product_price,
            product_image: product.product_image,
            product_description: product.product_description,
            product_category: product.product_category,
            product_quantity: product.product_quantity
        })
        await newProduct.save()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


async function getAllProducts() {
    try {
        const products = await Product.find()
        if(!products) return null
        else if(products.length === 0) return null
        return products
    } catch (error) {
        console.log(error)
        return null
    }
}

async function getProductById(id) {
    try {
        const products = await Product.findOne({_id:id})
        return products
    } catch (error) {
        console.log(error)
        return null
    }

}

async function deleteProductById(id) {
    try {
        const products = await Product.deleteOne({_id:id})
        return products
    } catch (error) {
        console.log(error)
        return null
    }

}


async function updateProductById(id,product) {
    try {
        const products = await Product.findOne({_id:id})
        products.product_name = product.product_name
        products.product_price = product.product_price
        products.product_description = product.product_description
        products.product_category = product.product_category
        products.product_quantity = product.product_quantity
        products.product_image = product.product_image
        await products.save()
        return products
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {getAllProducts,addProduct,getProductById,deleteProductById,updateProductById}