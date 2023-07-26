
const paaInput = document.querySelector('#validationCustom08')

const userInput = document.querySelector('#validationCustomUsername')

paaInput.addEventListener('keyup',()=> paaInput.setCustomValidity(""))
userInput.addEventListener('keyup',()=> userInput.setCustomValidity(""))


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
           signin() 
           .then(res => { 
            
            console.log(res)
            console.log(typeof(res))
            if (res.user == false){
                userInput.setCustomValidity("Invalid field.")
              // invalidfeedbackemail.innerHTML = res
             
            }
            else if (res.password == false){
                console.log('passs')
              paaInput.setCustomValidity("Invalid field.")
              // invalidfeedbackusername.innerHTML = res
             
            }
            else {
              userInput.setCustomValidity("")
              paaInput.setCustomValidity("")
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


async function signin(){

    var user = validationCustomUsername.value
    var password = validationCustom08.value

    return new Promise((resolve,reject)=>{
      fetch('/user/signin',{
        method :"POST",
        headers:{
            "Content-type":"application/json"
        },
        body : JSON.stringify({
                                user ,
                                password,
                               })
    }) . then(res=> res.json())
    .then(res =>  {console.log(res)
    resolve(res)})

    .catch(err =>{reject(err)})

    })

  }