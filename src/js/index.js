// Button add date
const addEventDate = document.querySelector(".addEventDate")

addEventDate.addEventListener("click", e => {
    let inputDate = document.createElement("input")
    inputDate.type = "date"
    inputDate.className = "eventDate"
    document.querySelector(".input").insertBefore(inputDate, addEventDate)
})