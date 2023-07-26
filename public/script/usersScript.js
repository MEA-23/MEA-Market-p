
const edditButton = document.getElementsByClassName('edditbuttonforclintAdmin')[0];
const delleteButton = document.getElementsByClassName('deletebuttonforclintAdmin')[0];
const resetButton = document.getElementsByClassName('resetbuttonforclintAdmin')[0];
const firstName= document.getElementById('firstName');
const secondName= document.getElementById('secondName');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const zip = document.getElementById('zip');
const city = document.getElementById('city');
const country = document.getElementById('country');
const id = edditButton.parentElement.id
const admin = document.getElementById('admin')
const makeAdminbuttonforclintAdmin = document.getElementsByClassName('makeAdminbuttonforclintAdmin')[0];
const removeAdminbuttonforclintAdmin = document.getElementsByClassName('removeAdminbuttonforclintAdmin')[0];
console.log(id)


    delleteButton.addEventListener("click", deleteUser)


 edditButton.addEventListener('click', edditEnaple);
 let adminSt;

 if(admin){
     adminSt = 0
     removeAdminbuttonforclintAdmin.addEventListener('click', removeAdmin);
 } else{
     adminSt = 2
        makeAdminbuttonforclintAdmin.addEventListener('click', makeAdmin);
 }


async function makeAdmin(){
    adminSt = 0
  await edditSave()
//   window.location.href = '/users'
}

async function removeAdmin(){
    adminSt = 2
    await edditSave()
    // window.location.href = '/users'
}



function edditEnaple(){
    firstName.setAttribute('contenteditable', true)
    secondName.setAttribute('contenteditable', true)
    userName.setAttribute('contenteditable', true)
    email.setAttribute('contenteditable', true)
    zip.setAttribute('contenteditable', true)
    city.setAttribute('contenteditable', true)
    country.setAttribute('contenteditable', true)

    edditButton.innerHTML = 'Save'
    edditButton.removeEventListener('click', edditEnaple);
    edditButton.addEventListener('click', edditSave);
}



function edditSave(){

    firstName.setAttribute('contenteditable', false)
    secondName.setAttribute('contenteditable', false)
    userName.setAttribute('contenteditable', false)
    email.setAttribute('contenteditable', false)
    zip.setAttribute('contenteditable', false)
    city.setAttribute('contenteditable', false)
    country.setAttribute('contenteditable', false)
    edditButton.innerHTML = 'Eddit'
    edditButton.removeEventListener('click', edditSave);
    edditButton.addEventListener('click', edditEnaple);




update = {
    first_name: firstName.innerHTML,
    second_name: secondName.innerHTML,
    user_name: userName.innerHTML,
    user_email: email.innerHTML,
    zip_code: zip.innerHTML,
    city: city.innerHTML,
    country: country.innerHTML,
    admin : adminSt



    }


    console.log(update)
    fetch('/users/update/'+id,{
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
    })
    .then(respond =>{
       window.location.reload()
    }
    )
    .catch(error =>{
        console.log(error)
    }
    )
}

async function deleteUser(){
    console.log(id)
fetch('/user/delete/'+id , {
    method:"DELETE",
    headers:{
        "Content-type" : "application/json"
    }})
    .then( res =>{
     console.log(res)
        window.location.href = '/users'
    }
    )


}
