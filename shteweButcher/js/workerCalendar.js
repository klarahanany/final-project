const daysTag = document.querySelector(".days"),

    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");
shift = document.querySelector(".window")
closeshift = document.querySelector("#close-shiftDetails")
var selected = '';
var day = '';
var month = '';
var year = '';
// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    dayClicked();
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li id="day" class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
            && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li id="day" class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li id="day" class="inactive"">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
day = document.querySelector(".day")
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }

        renderCalendar(); // calling renderCalendar function
        dayClicked();
    });
});
function dayClicked() {
    var amount__list = document.querySelectorAll('.days li');
    amount__list.forEach((item, index) => {
        item.addEventListener('click', (event) => {
            selected = event.currentTarget.innerHTML;
        });

    })
}
dayClicked();
var selectedItem = '';
daysTag.onclick = async () => {
    var x = 0;
    var y = 0;


    if (selected !== "") {
        var items = daysTag.getElementsByTagName("li");
        for (var i = 0; i < items.length; ++i) {
            if (items[i].textContent == 1) {
                if (y == 0) {
                    y = 1;
                    x = 1;
                }
                else {

                    x = 0;
                }
            }
            if (items[i].textContent === selectedItem) {
                if (x === 1) {
                    items[i].style = "color:black;";
                    items[i].style.fontWeight = "normal";
                }
            }
        }
        x = 0;
        y = 0;
        console.log(daysTag)
        shift.classList.add('active');
        var items = daysTag.getElementsByTagName("li");
        for (var i = 0; i < items.length; ++i) {
            if (items[i].textContent == 1) {
                if (y == 0) {
                    y = 1;
                    x = 1;
                }
                else {

                    x = 0;
                }
            }
            if (items[i].textContent === selected) {

                if (x === 1) {
                    selectedItem = items[i].textContent;
                    items[i].style = "color:red;";
                    items[i].style.fontWeight = "bold";
                }
            }
        }
        console.log("selected is ", selected);
        monthAndYear = document.getElementById("current-date").innerHTML;
        console.log(monthAndYear);
        splitArray = monthAndYear.split(" ");
        day = selected;
        month = splitArray[0];
        year = splitArray[1];
        selected = "";
        const body = { Day: day, Month: month, Year: year }
        const shiftWorker = await fetch("http://localhost:4000/calendar", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await shiftWorker.json();

        if (result !== " Still Not Determined") {
            console.log("1");
            const shift = '';

            document.getElementById('shiftKind').textContent = "יש לך משמרת" + result.shifttype;
        }
        else {
            console.log("2");
            document.getElementById('shiftKind').textContent = "עדיין לא נקבע";
        }
    }
    else {
        shift.classList.remove('active');
    }
    selected = "";
}
closeshift.onclick = () => {
    shift.classList.remove('active');
}
function getMonth(month) {
    if (month === 'March') {
        return '03';
    }
    else if (month === 'February') {
        return '02';
    }
    else if (month === 'April') {
        return '04';
    }
    else if (month === 'May') {
        return '05';
    }
    else if (month === 'January') {
        return '01';
    }
    else if (month === 'June') {
        return '06';
    }
    else if (month === 'July') {
        return '07';
    }
    else if (month === 'August') {
        return '08';
    }
    else if (month === 'September') {
        return '09';
    }
    else if (month === 'October') {
        return '10';
    }
    else if (month === 'November') {
        return '11';
    }
    else if (month === 'December') {
        return '12';
    }
    else {
        console.log("getMonth function")
    }

}
async function send() {
    const element1 = document.getElementById("selectChange");
    const element2 = document.getElementById("ask")
    
    console.log(element2.value)
    if (element2.value == '') {
        alert("תמלא סיבה")
    }
    else {
         const datexy = year + "-"+getMonth(month)+"-"+day;
        const body = { shifttype: element1.value, reason: element2.value ,date :datexy}
        const changeDemand = await fetch("http://localhost:4000/changeDemand", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await changeDemand.json();
        if(result=='success'){
            alert("הבקשה נשלחה")
        }
    }
}
// async function shift(){
//     console.log("etba33");
// }


