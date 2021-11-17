const sendEvent  = document.getElementById('sendEvent')


sendEvent.addEventListener('click',function(e){
    let  eventName = document.getElementById('eventName').value;
    let  eventDesc = document.getElementById('eventDesc').value;
    let eventDate = document.getElementById('eventDate').value;
    
    const newEvent = {
        name: eventName,
        description: eventDesc,
        dates: [
            eventDate
        ],
        author: 'Azad'
    }
    e.preventDefault();
    
    fetch('http://localhost:3000/api/events',{
        method: 'POST',
        body:JSON.stringify(newEvent),
        headers:{
            "Content-Type": "application/json"
        }

        
    }).then(resp=>resp.json())
    .then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    })
})


