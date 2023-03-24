var string ;
window.onload = async function () {
    // body = { value: element1.value, num: '3' }
    const fillAllData = await fetch("http://localhost:4000/fillAllDataworker", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        // body: JSON.stringify(body),
    });
    const result = await fillAllData.json();
    string = result[1]
    const firstnamex = document.getElementById("firstname")
    firstnamex.value = result[0][0].firstname
    const lastnamex = document.getElementById("lastname")
    lastnamex.value = result[0][0].lastname
    const usernamex = document.getElementById("username")
    usernamex.textContent = result[0][0].username
    const emailx = document.getElementById("email")
    emailx.value = result[0][0].email
    const phonex = document.getElementById("phone")
    phonex.value = result[0][0].phone
    const img = document.getElementById("personalImg")
    if (result[0][0].img == string) {
        const recentImageDataUrl = localStorage.getItem(result[0][0].img)
        img.src=recentImageDataUrl;
        // document.querySelector("#personalImg").setAttribute("src", recentImageDataUrl);
    }
    else {
        img.src = result[0][0].img;
    }

    const day1 = document.getElementById("day1")
    if (result[0][0].sunday == 'DAYOFF') {
        day1.value = 'חופש'
    }
    else if (result[0][0].sunday == 'MORNING') {
        day1.value = 'בוקר'
    }
    else if (result[0][0].sunday == 'EVENING') {
        day1.value = 'ערב'
    }
    const day2 = document.getElementById("day2")
    if (result[0][0].monday == 'DAYOFF') {
        day2.value = 'חופש'
    }
    else if (result[0][0].monday == 'MORNING') {
        day2.value = 'בוקר'
    }
    else if (result[0][0].monday == 'EVENING') {
        day2.value = 'ערב'
    }
    const day3 = document.getElementById("day3")
    if (result[0][0].tuesday == 'DAYOFF') {
        day3.value = 'חופש'
    }
    else if (result[0][0].tuesday == 'MORNING') {
        day3.value = 'בוקר'
    }
    else if (result[0][0].tuesday == 'EVENING') {
        day3.value = 'ערב'
    }
    const day4 = document.getElementById("day4")
    if (result[0][0].wednesday == 'DAYOFF') {
        day4.value = 'חופש'
    }
    else if (result[0][0].wednesday == 'MORNING') {
        day4.value = 'בוקר'
    }
    else if (result[0][0].wednesday == 'EVENING') {
        day4.value = 'ערב'
    }
    const day5 = document.getElementById("day5")
    if (result[0][0].thursday == 'DAYOFF') {
        day5.value = 'חופש'
    }
    else if (result[0][0].thursday == 'MORNING') {
        day5.value = 'בוקר'
    }
    else if (result[0][0].thursday == 'EVENING') {
        day5.value = 'ערב'
    }
    const day6 = document.getElementById("day6")
    if (result[0][0].friday == 'DAYOFF') {
        day6.value = 'חופש'
    }
    else if (result[0][0].friday == 'MORNING') {
        day6.value = 'בוקר'
    }
    else if (result[0][0].friday == 'EVENING') {
        day6.value = 'ערב'
    }


}
async function update() {
    console.log("gh")
    const element1 = document.getElementById('firstname');
    const element2 = document.getElementById('lastname');
    // const element3 = document.getElementById('username');
    const element4 = document.getElementById('email');
    const element5 = document.getElementById('password');
    const element6 = document.getElementById('phone');
    const element7 = document.getElementById('day1');
    const element8 = document.getElementById('day2');
    const element9 = document.getElementById('day3');
    const element10 = document.getElementById('day4');
    const element11 = document.getElementById('day5');
    const element12 = document.getElementById('day6');

    body = {
        firstname: element1.value, lastname: element2.value, email: element4.value,
        password: element5.value, phone: element6.value, sunday: element7.value, monday: element8.value,
        tuesday: element9.value, wednesday: element10.value, thursday: element11.value, friday: element12.value
    }
    const updatedata = await fetch("http://localhost:4000/updatedata", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result = await updatedata.json();
}

document.querySelector("#photo").addEventListener("change", function () {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        localStorage.setItem(string, reader.result);
    });
    reader.readAsDataURL(this.files[0])
});

async function photoAdded() {
    const recentImageDataUrl = localStorage.getItem(string)
    if (recentImageDataUrl) {
        console.log("ggghjk")
        document.querySelector("#personalImg").setAttribute("src", recentImageDataUrl);
    }
    const element = document.querySelector("#personalImg")
    console.log()
    // const body = { src:  element.src}
    const body = { src: string }
    const uploadPhoto = await fetch("http://localhost:4000/uploadPhoto", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result = await uploadPhoto.json();
}