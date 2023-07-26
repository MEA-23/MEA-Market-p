const validationCustom01 = document.querySelector('#validationCustom01')
const validationCustom02 = document.querySelector('#validationCustom02')
const validationCustomUsername = document.querySelector('#validationCustomUsername')
const validationCustom03 = document.querySelector('#validationCustom03')
const validationCustom04 = document.querySelector('#validationCustom04')
const validationCustom05 = document.querySelector('#validationCustom05')
const invalidCheck = document.querySelector('#invalidCheck')
const validationCustom07 = document.querySelector('#validationCustom07')
const validationCustom08 = document.querySelector('#validationCustom08')
const invalidfeedbackemail = document.querySelector('#invalid-feedback-email')
const invalidfeedbackusername = document.querySelector('#invalid-feedback-username')

validationCustom07.addEventListener('keyup',()=> validationCustom07.setCustomValidity(""))
validationCustomUsername.addEventListener('keyup',()=> validationCustomUsername.setCustomValidity(""))



async function validation () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        else{
           createUser() 
           .then(res => { 
            if (res == 'User email already existed'){
              validationCustom07.setCustomValidity("Invalid field.")
              // invalidfeedbackemail.innerHTML = res
             
            }
            else if (res == 'User id already existed'){
              validationCustomUsername.setCustomValidity("Invalid field.")
              // invalidfeedbackusername.innerHTML = res
             
            }
            else {
              validationCustom07.setCustomValidity("")
              validationCustomUsername.setCustomValidity("")
              console.log(res)
              location.assign('/')
   
            }
           })
          
            // validationCustom07.setCustomValidity("Invalid field.")
           
        }
        event.preventDefault()
        form.classList.add('was-validated')
      }, false)
    })
  }

  validation()

  async function createUser(){


    var firstName = validationCustom01.value
    var lasstName = validationCustom02.value
    var userName = validationCustomUsername.value
    var password = validationCustom08.value
    var email = validationCustom07.value
    var userCity = validationCustom03.value
    var userCountry = validationCustom04.value
    var zipCode = validationCustom05.value

    return new Promise((resolve,reject)=>{
      fetch('/user/create',{
        method :"POST",
        headers:{
            "Content-type":"application/json"
        },
        body : JSON.stringify({fname : firstName,
                                lasstName: lasstName,
                                user : userName,
                                password,
                                email,
                                city: userCity,
                                country: userCountry,
                                zip :zipCode})
    }) . then(res=> res.json())
    .then(res =>  {console.log(res)
    resolve(res)})

    .catch(err =>{reject(err)})

    })

  }



//   console.log(validationCustom01.value)
//   console.log(validationCustom02.value)
//   console.log(validationCustomUsername.value)
//   console.log(validationCustom03.value)
//   console.log(validationCustom04.value)
//   console.log(validationCustom05.value)