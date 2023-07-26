
function selectAllShowButtons (){
    document.querySelectorAll('.showItemButton').forEach(button =>{
    button.addEventListener('click', (e) =>{
        var card = e.target.parentElement.parentElement.parentElement
        var id = card.id
    
        serverGetData(id)
        .then(respond =>{
            window.location.href = '/product/'+id
            console.log(respond)
        })
    })
    })
    }
    
    function serverGetData(id){
        return new Promise((resolve,reject) =>{
            fetch('/product/'+id,{
                method : 'GET'
            })
            .then(respond =>{
                resolve(respond)
            })
        }
        )
    }
    
    selectAllShowButtons()

