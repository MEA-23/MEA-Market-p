

function selectAllButtons (){
document.querySelectorAll('.removeProductFromCart').forEach(button =>{
button.addEventListener('click', (e) =>{
    var card = e.target.parentElement.parentElement.parentElement
    var id = card.id

    serverDelete(id)
    .then(respond =>{
        console.log(respond)
        e.target.parentElement.parentElement.parentElement.remove()
    })
})
})
}


function serverDelete(id){
    return new Promise((resolve,reject) =>{
        fetch('/cart/delete/'+id,{
            method : 'DELETE'
        })
        .then(respond =>{
            resolve(respond)
        })
    }
    )
}

selectAllButtons()