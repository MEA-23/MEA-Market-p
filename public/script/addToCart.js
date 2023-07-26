const buttons = document.querySelectorAll('.addToCartButton');

    //do nothing hahahhahahahah




    if (buttons.length != 0){

        buttons.forEach(button => {
            if (button.innerHTML === 'Added') {
                // do nothing 😒
            }
            else{
                button.addEventListener('click', addToCart);
            }
            }
           
        )
        
    }


buttons.forEach(button => {
    if (button.innerHTML === 'Added') {
        // do nothing 😒
    }
    else{
        button.addEventListener('click', addToCart);
    }
    }
   
)





function addToCart(e){
    var id = e.target.id
    var button = e.target
    console.log(id)
    fetch('/cart/add/'+id,{
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    })
    .then(respond =>{
        console.log(respond)
        if(respond.status === 200){
            button.innerHTML = 'Added'
            button.removeEventListener('click', addToCart);
        }
        else{
            alert('ann error acured, try again later')
        }
    }
    )
    .catch(err =>{
        console.log(err)
    }
    )
}