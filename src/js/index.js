
const sendEvent  = document.getElementById('sendEvent')
let name = "azad";
let comeOrNot = true



sendEvent.addEventListener('click',function(e){

    let  eventName = document.getElementById('eventName').value;
    let  eventDesc = document.getElementById('eventDesc').value;
    let eventDate = document.getElementById('eventDate').value;
    let eventDate1 = document.getElementById('eventDate1').value;
    
    const newEvent = {
        name: eventName,
        description: eventDesc,
        dates: [
            eventDate,
            eventDate1
        ],
        author: 'Azad'
    }
   
    
     fetch('http://localhost:3000/api/events',{
        method: 'POST',
        body:JSON.stringify(newEvent),
        headers:{
            "Content-Type": "application/json"
        }

        
    })
  
    showMember()

    e.preventDefault();
})
 



// Button add date
const addEventDate = document.querySelector(".addEventDate")

addEventDate.addEventListener("click", e => {
    const inputDate = document.createElement("input")
    inputDate.type = "date"
    inputDate.className = "eventDate"
    document.querySelector(".input").insertBefore(inputDate, addEventDate)
})

// Generate event list

 


fetch("http://localhost:3000/api/events")
    .then(resp => resp.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {

            const event = document.createElement("article")

            const eventTitle = document.createElement("h2")
            eventTitle.innerText = data[i].name
            
            const eventDesc = document.createElement("p")
            eventDesc.innerText = data[i].description

            const table = document.createElement("table")

            const trDate = document.createElement("tr")
            const thDateBlank = document.createElement("th")
            trDate.appendChild(thDateBlank)
            
            for (let date = 0; date < data[i].dates.length; date++) {
                const thDate = document.createElement("th")
                thDate.innerText = data[i].dates[date].date
                trDate.appendChild(thDate)
                table.appendChild(trDate)
            }

            for (let member = 0; member < data[i].dates[0].attendees.length; member++) {
                const trMember = document.createElement("tr")
                const tdMemberName = document.createElement("td")
                tdMemberName.innerText = data[i].dates[0].attendees[member].name
                trMember.appendChild(tdMemberName)
                
                for (let date = 0; date < data[i].dates.length; date++) {
                    const tdMemberDispo = document.createElement("td")
                    if (data[i].dates[date].attendees[member].available === true) {
                        tdMemberDispo.innerText = "V"
                        tdMemberDispo.className = "v"
                    }
                    else if (data[i].dates[date].attendees[member].available === false) {
                        tdMemberDispo.innerText = "X"
                        tdMemberDispo.className = "x"
                    }
                    else {
                        tdMemberDispo.innerText = "?"
                        tdMemberDispo.className = "null"  
                    }
                    trMember.appendChild(tdMemberDispo)
                }
                table.appendChild(trMember)
            }
    
            const trNumbOfPart = document.createElement("tr")
            const tdNumbOfPart = document.createElement("td")
            tdNumbOfPart.innerText = data[i].dates[0].attendees.length + " participants"
            trNumbOfPart.appendChild(tdNumbOfPart)
            
            for (let index = 0; index < data[i].dates.length; index++) { 
                let numberOfV = 0         
                const tdNumberOfV = document.createElement("td")
                trNumbOfPart.appendChild(tdNumberOfV)
                for (let idk = 0; idk < data[i].dates[index].attendees.length; idk++) {
                    if (data[i].dates[index].attendees[idk].available === true) {
                        numberOfV++
                    }
                } 
                tdNumberOfV.innerText = numberOfV
                console.log(numberOfV);
            }

            const addMember = document.createElement("button")
            addMember.innerText = "+"
            tdNumbOfPart.appendChild(addMember)

            table.appendChild(trNumbOfPart)

            event.appendChild(eventTitle)
            event.appendChild(eventDesc)
            event.appendChild(table)
            document.querySelector(".eventList").appendChild(event)
        }
    })
  

const btn = document.getElementById('btn')
btn.addEventListener('click',()=>{
    fetch("http://localhost:3000/api/events/d0941934ed10/",{
        method:"Delete"
    })
})



 
//  function showMember() { 
//     fetch('http://localhost:3000/api/events')
//     .then(resp=>resp.json())
//     .then((data)=>{
//         for (let i = 0; i < data.length; i++) {
//             for (let member = 0; member < data[i].dates[0].attendees.length; member++) {
//                 console.log(data[i].dates[0].attendees[member].name)

//                 const html = `
//                 <table border="11>
//                 <tr><td>${data[i].dates[0].attendees[member].name} </td><tr>
//                 </table>

//                 `
                  
                  
//               }
//         }
      
//     })

//  }

