fetch("http://localhost:3000/api/events")
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
    })