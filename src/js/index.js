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

        // Delete button
        const del = document.createElement("button")
        del.innerText = "delete"
        event.appendChild(del)

        // Edit button
        const edit = document.createElement("button")
        edit.innerText = "edit"
        event.appendChild(edit)

            // event title / descirption
            const eventTitle = document.createElement("h2")
            eventTitle.innerText = data[i].name
            
            const eventDesc = document.createElement("p")
            eventDesc.innerText = data[i].description

            // Event table
            const table = document.createElement("table")

            const trDate = document.createElement("tr")
            const thDateBlank = document.createElement("th")
            trDate.appendChild(thDateBlank)
            
            // event date
            for (let date = 0; date < data[i].dates.length; date++) {
                const thDate = document.createElement("th")
                thDate.innerText = data[i].dates[date].date
                trDate.appendChild(thDate)
                table.appendChild(trDate)
            }

            // event attendees name
            for (let member = 0; member < data[i].dates[0].attendees.length; member++) {
                const trMember = document.createElement("tr")
                const tdMemberName = document.createElement("td")
                tdMemberName.innerText = data[i].dates[0].attendees[member].name
                trMember.appendChild(tdMemberName)
                
                // event attendees available
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
    
            // number of participant
            const trNumbOfPart = document.createElement("tr")
            const tdNumbOfPart = document.createElement("td")
            tdNumbOfPart.innerText = data[i].dates[0].attendees.length + " participants"
            trNumbOfPart.appendChild(tdNumbOfPart)
            
            // number of participant per date
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
            }

            // add participant
            const addMember = document.createElement("button")
            addMember.innerText = "+"
            addMember.addEventListener("click", e => {
                const newTr = document.createElement("tr")
                const newTd = document.createElement("td")
                const name = document.createElement("input")
                name.placeholder = "name"
                name.className = "name"

                // 
                const pushButton = document.createElement("button")
                pushButton.innerText = "Add"
                pushButton.id = data[i].id
                pushButton.addEventListener("click", e => {
                    const id = e.target.id
                    const numberOfChild = e.target.parentElement.parentElement.childElementCount
                    const date = []
                    for (let index = 1; index < numberOfChild ; index++) {
                        date.push(
                            { 
                                "date": data[0].dates[index-1].date,
                                "available": new Boolean(e.target.parentElement.parentElement.children[index].value) 
                            }
                        )
                    }

                    const info = {
                        "name": e.target.nextSibling.value,
                        "dates" : date
                    }
                    console.log(info);

                    fetch("http://localhost:3000/api/events/"+id+"/attend", {
                        method: 'POST',
                        body:JSON.stringify(info),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })

                }) 
                newTd.appendChild(pushButton)
                // 

                newTd.appendChild(name)
                newTr.appendChild(newTd)
                // edit available
                for (let index = 0; index < data[i].dates.length; index++) {        
                    const td = document.createElement("td")
                    const button = document.createElement("button")
                    button.innerText = "?"
                    button.addEventListener("click", e => {
                        if (button.textContent === "?") {
                            button.innerText = "V"
                            td.value = "true"
                        }
                        else if (button.textContent === "V") {
                            button.innerText = "X"
                            td.value = "false"
                        }
                        else {
                            button.innerText = "?"
                            td.value = "null"
                        }
                    })
                    td.appendChild(button)
                    newTr.appendChild(td)
                }
                table.insertBefore(newTr, trNumbOfPart)
            })
            tdNumbOfPart.appendChild(addMember)

            table.appendChild(trNumbOfPart)

            event.appendChild(eventTitle)
            event.appendChild(eventDesc)
            event.appendChild(table)
            document.querySelector(".eventList").appendChild(event)
        }
    })