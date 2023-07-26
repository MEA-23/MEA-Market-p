const db = require('mongoose')
const Schema = db.Schema
const dbUrl = "mongodb://127.0.0.1:27017/MEA-Market"
const bcrypt = require('bcrypt')

// let  salt ;
// async function generateSalt(){
//     salt = await bcrypt.genSalt()
// }
// generateSalt()


const UsersSchema = new Schema({
    first_name : {required : true,
    type : String},
    second_name : {required : true,
    type : String},
    user_name : {required : true,
    type : String},
    user_email : {required : true,
    type : String},
    user_password : {required : true,
    type : String},
    city : {required : true,
    type : String},
    country : {required : true,
    type : String},
    zip_code : {required : true,
    type : Number},
    admin : {required : true,
      type : Number},
    cart : {required : true,
      type : Array},
})





// UsersSchema.pre('save', async function (next) {
//     console.log('in hash')
//    const salt = await bcrypt.genSalt()
//     this.user_password = await bcrypt.hash(this.user_password, salt)
//     next()
//   })

 


 
async function validatePassword(storedHash, userProvidedPassword) {
  try {
    // Compare the user-provided password with the stored hash
    const passwordMatch = await bcrypt.compare(userProvidedPassword, storedHash);

    if (passwordMatch) {
      console.log('Password is correct!'); // Password matches the stored hash
      return true;
    } else {
      console.log('Password is incorrect!'); // Password does not match the stored hash
      return false;
    }
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
}




//   UsersSchema.pre('findOne', async function (next) {
//     console.log('in hash find')
//     this.user_password = await bcrypt.hash(this.user_password, salt)
//     next()
//   })



const User = db.model('User', UsersSchema)








function signin(data){
    return new Promise((resolve,reject) =>{
        User.findOne({user_name : data.user})
        .then(respond => { 

if(respond){
    validatePassword(respond.user_password, data.password)
    .then(res =>{

        if(res){
          var id = respond._id.toString()
        console.log(id)
            resolve(JSON.stringify({created : true, id }))
        }
        else {
            resolve(JSON.stringify({password:false,
                                    user: true}))
        }
    })
}
else {
    resolve(JSON.stringify({password:false,
                              user: false}))
}  }) })
}





// async function hash(password){
//   return new Promise((resolve,reject) =>{
//     bcrypt.genSalt()
//     .then(salt =>{
//       bcrypt.hash(password, salt)
//       .then(hash =>{
//         resolve(hash)
//       })
//     })
//   }
//   )
// }



async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async function createUser(data) {
  try {
    // Check if the user_name already exists
    const existingUser = await User.findOne({ user_name: data.user.toLowerCase().trim() });
    if (existingUser) {
      console.log('user id in the data base');
      // User with the same user_name already exists
      return 'User id already existed';
    }

    const exist = await User.findOne({ user_email: data.email.toLowerCase().trim() });
    if (exist) {
      console.log('user email in the data base');
      // User with the same user_email already exists
      return 'User email already existed';
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    console.log('user created');
    // Create a new user
    const user = new User({
      first_name: data.fname.trim(),
      second_name: data.lasstName.trim(),
      user_name: data.user.toLowerCase().trim(),
      user_email: data.email.toLowerCase().trim(),
      user_password: hashedPassword,
      city: data.city.trim(),
      country: data.country.trim(),
      zip_code: data.zip.trim(),
      admin: 2,
      cart: [],
    });

    const savedUser = await user.save();
    console.log('Data added:', savedUser.toJSON());
    return { created: true, id: savedUser._id };
  } catch (error) {
    return Promise.reject(error);
  }
}








// async function createUser(data) {
//     return new Promise((resolve, reject) => {
//       // Check if the user_name already exists
//       User.findOne({ user_name: data.user.toLowerCase().trim() })
//         .then(existingUser => {
//           if (existingUser) {
//             console.log('user id in the data base')
//             // User with the same user_name already exists
//             resolve('User id already existed');
//           } else {
//             User.findOne({ user_email: data.email.toLowerCase().trim() })
//             .then(exist=>{

//                 if (exist){
//                     console.log('user emaid in the data base')
//                     // User with the same user_name already exists
//                     resolve('User email already existed');
//                 }
//                 else {
//                   hash(data.password)
//                   .then(hash =>{
//                     console.log('user created')
//                     // Create a new user
//                     const user = new User({
//                       first_name: data.fname.trim(),
//                       second_name: data.lasstName.trim(),
//                       user_name: data.user.toLowerCase().trim(),
//                       user_email : data.email.toLowerCase().trim(),
//                       user_password : hash,
//                       city: data.city.trim(),
//                       country: data.country.trim(),
//                       zip_code: data.zip.trim(),
//                       admin : 2,
//                       cart : []
//                     });
                  
//                     user.save()
//                       .then(savedUser => {
//                         console.log('Data added:', savedUser.toJSON());
//                         resolve({created : true, id : savedUser._id});
//                       })
//                       .catch(err => {
//                         reject(err);
//                       });
//                 }
//             })
//             .catch(err => {
//                 reject(err);
//               });
         
//           }
//         })
//         .catch(err => {
//           reject(err);
//         });
//     });
//   }





function getUser(id){
    return new Promise((resolve,reject) =>{
        User.findOne({_id : id})
        .then(respond => { 
            resolve(respond)
        })

    })
}


async function getAllUser(){

    return new Promise((resolve,reject) =>{
        User.find()
        .then(respond => { 
            resolve(respond)
        })

    })
}


async function removeUser(id){

  return new Promise((resolve,reject) =>{
    User.findByIdAndDelete(id)
    .then(res=>{
      console.log('user deleted')
      resolve(res)
    })
    .catch (err =>{
      console.log('user not deleted')
      reject(err)
    })
  })

}



async function updateUser(id, user){

  var me = await User.findOne({_id : id})

  return new Promise((resolve, reject) => {

    // Check if the user_name already exists
    User.findOne({ user_name: user.user_name.toLowerCase().trim() })
      .then(existingUser  => {
        if (existingUser &&  me.user_name != user.user_name) {
          console.log('user id in the data base')
          // User with the same user_name already exists
          resolve('User id already existed');
        } else {
          User.findOne({ user_email: user.user_email.toLowerCase().trim() })
          .then(exist=>{

              if (exist && me.user_email != user.user_email){
                  console.log('user emaid in the data base')
                  // User with the same user_name already exists
                  resolve('User email already existed');
              }
              else {
                  console.log('user updated')
                  // Create a new user
              User.findOne({_id : id})
              .then(user2 =>{
                user2.first_name = user.first_name
                user2.second_name = user.second_name
                user2.user_name = user.user_name
                user2.user_email = user.user_email
                user2.city = user.city
                user2.country = user.country
                user2.zip_code = user.zip_code
                user2.admin = user.admin
                user2.save()
                .then(savedUser => {
                  console.log('Data added:', savedUser.toJSON());
                  resolve({created : true, id : savedUser._id});
                })
                  });
        
              }
          })
          .catch(err => {
              reject(err);
            });
       
        }
      })
      .catch(err => {
        reject(err);
      });
  });}




 async function addToCart(id,product){  
  return new Promise((resolve,reject) =>{

    User.findOne({_id : id})
    .then(user =>{
      user.cart.push(product)
      user.save()
      .then(respond =>{
        console.log('product added to cart', product)
        resolve(respond)
      })
      .catch(err =>{
        reject(err)
      })
    })

  })
  }






  async function deleteFromCart(id,product){
    console.log(id)
    console.log(product)

    return new Promise((resolve,reject) =>{

      User.findOne({_id:id})
      .then( user =>{
        // console.log(user,'.......................')
    //  console.log(user.cart.indexOf(product))
        user.cart.splice(user.cart.indexOf(product),1)
        user.save()
        .then(res =>{
          resolve(res)
        })
      })
      .catch(err=>{
        reject(err)
      })


    })


  }



module.exports = {dbUrl,createUser,signin,getUser,getAllUser,updateUser,removeUser,addToCart,deleteFromCart}
