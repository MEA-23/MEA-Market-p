
const edditButton = document.getElementsByClassName('edditbuttonforclintAdmin')[0];
const nameContainer = document.getElementById('name');
const desc = document.getElementById('desc');
const price = document.getElementById('price');
const amount = document.getElementById('items');
const Category = document.getElementById('Category');
const image = document.getElementById('img');
const id = edditButton.id
console.log(id)


 edditButton.addEventListener('click', edditEnaple);



function edditEnaple(){
    nameContainer.setAttribute('contenteditable', true)
    desc.setAttribute('contenteditable', true)
    price.setAttribute('contenteditable', true)
    amount.setAttribute('contenteditable', true)
    Category.setAttribute('contenteditable', true)
    image.setAttribute('contenteditable', true)
    edditButton.innerHTML = 'Save'
    edditButton.removeEventListener('click', edditEnaple);
    edditButton.addEventListener('click', edditSave);
}

function edditSave(){

    nameContainer.setAttribute('contenteditable', false)
    desc.setAttribute('contenteditable', false)
    price.setAttribute('contenteditable', false)
    amount.setAttribute('contenteditable', false)
    Category.setAttribute('contenteditable', false)
    image.setAttribute('contenteditable', false)
    edditButton.innerHTML = 'Eddit'
    edditButton.removeEventListener('click', edditSave);
    edditButton.addEventListener('click', edditEnaple);



    let update = {
        product_name: nameContainer.innerHTML,
        product_description: desc.innerHTML,
        product_price: price.innerHTML,
        product_quantity: amount.innerHTML,
        product_category: Category.innerHTML,
        product_image: image.innerHTML
    }

    console.log(update)
    fetch('/product/update/'+id,{
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
    })
    .then(respond =>{
        console.log(respond)
        if(respond.status === 200){
            window.location.reload()
        }
    }
    )
    .catch(error =>{
        console.log(error)
    }
    )
}
