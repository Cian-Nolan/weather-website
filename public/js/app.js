
const weatherForm = document.querySelector('form')
const message1 = document.querySelector('#message-1')
const message2 = document.querySelector('#message-2')
const search = document.querySelector('input')

weatherForm.addEventListener('submit', (event)=>{
    event.preventDefault() // stops reloading

    message1.textContent = 'Loading...'
    message2.textContent = ''
    message2.classList.remove('alert','alert-danger')

    // Check if user input is valid
    var regex = /^[a-zA-Z0-9\s\,\-]*$/i

    if(!regex.test(search.value)){
        message1.textContent = ''
        message2.textContent = "Please enter a valid search. A valid search only contains characters in the range a-z, 0-9, ',' and '-' "
        message2.classList.add('alert','alert-danger')
        return
    }

    fetch('/weather?address='+ search.value).then((res) =>{
        res.json().then((data) => {
            if(data.error){
                console.log(data.error)
                message1.textContent = ''
                message2.textContent = data.error
                message2.classList.add('alert','alert-danger')
            }
            else{
                message1.textContent = ''
                message2.textContent = data.forecast
                message2.classList.add('alert','alert-success')
            }
        })
    })
})