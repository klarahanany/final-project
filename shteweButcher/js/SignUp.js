const form = document.querySelector('form');

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    // var name = document.getElementById("name").value
    // var pass = document.getElementById("pass").value
    // var email = document.getElementById("email").value
    if (name.length == 0 || pass.length == 0 || email.length == 0) {
        console.log("Something went wrong")
    }
    // else {
    //     const body = { UserName: name, password: pass, Email: email }
    //     const fetchWorker = await fetch("http://localhost:4000/signup", {
    //         method: "POST",
    //         Credentials: "include",
    //         headers: { "Content-Type": "application/JSON" },
    //         body: JSON.stringify(body),
    //     });
        // const result = await fetchWorker.json();
        // if (result === "success") {
        //     console.log("did it work?")
        //     console.log(location.href);
        //     var url = 'http://localhost:4000/profile';
        //     location.href = url;
        // }


    // }
})
