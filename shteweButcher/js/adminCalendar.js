const daysTag = document.querySelector(".days"),
    updateshift = document.querySelector(".submit")
currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");
shift = document.querySelector(".window")
closeshift = document.querySelector("#close-shiftDetails")
var selected = '';
var selected_1 = '';
var day = '';
var month = '';
var year = '';
var updatedShiftDone = 0;
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


        var dateStr = '03/11/2023';
        var dayname = getDayName(dateStr, "en-US");
        console.log(dayname)
        alreadyAdded = document.getElementById("alreadyAdded")
        box1 = document.getElementById("box1")
        box2 = document.getElementById("box2")
        updateshiftButton = document.getElementById('update');
        updateshiftButton.style.visibility = 'visible';
        box1.style.visibility = 'visible';
        box2.style.visibility = 'visible';
        alreadyAdded.style.visibility = 'hidden'
        num2 = 2
        monthAndYear = document.getElementById("current-date").innerHTML;
        console.log(monthAndYear);
        splitArray = monthAndYear.split(" ");
        day = selected;
        month = splitArray[0];
        year = splitArray[1];
        // const body = { Day: day, Month: month, Year: year }
        const bodyx = { num: num2, Day: day, Month: month, Year: year };
        const fetchForCheckIfShiftDetermined = await fetch("http://localhost:4000/adminCalendar", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(bodyx),
        });
        const resultx = await fetchForCheckIfShiftDetermined.json();
        if (resultx !== 'still not determined') {
            elementmorn = document.getElementById("morn")
            elementmorn.innerHTML='';
            // array = resultx.split(" ");
            // eveningWorker = array[0]
            // morningWorker = array[1]
            // console.log(array[0] + " " + array[1])
  
            elementeven = document.getElementById("even")
            elementeven.innerHTML=''
            for (var i = 0; i < resultx[0].length; i++) {
                var p = document.createElement("p")
                p.id="shiftss"
                p.textContent = resultx[0][i]
                elementmorn.append(p)
            }
            for (var i = 0; i < resultx[1].length; i++) {
                var p = document.createElement("p")
                p.id="shiftss"
                p.textContent = resultx[1][i]
                elementeven.append(p)
            }
            // emp1 = document.getElementById('morn');
            // emp2 = document.getElementById('even');
            // emp1.textContent = "morning employee " + morningWorker;
            // emp2.textContent = "evening employee " + eveningWorker;
            alreadyAdded1 = document.getElementById("alreadyAdded")
            alreadyAdded1.style.visibility = 'visible';
            box1 = document.getElementById("box1")
            box2 = document.getElementById("box2")
            updateshiftButton = document.getElementById('update');
            updateshiftButton.style.visibility = 'hidden';
            box1.style.visibility = 'hidden';
            box2.style.visibility = 'hidden';


        }
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
        // console.log(daysTag)
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

        // console.log("selected is ", selected);
        monthAndYear = document.getElementById("current-date").innerHTML;
        selected_1 = selected;

        selected = "";
        num = '1';
        const body = { num };
        const fetchGetAllEmployes = await fetch("http://localhost:4000/adminCalendar", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await fetchGetAllEmployes.json();
        var element = document.getElementById("employes");
        var element2 = document.getElementById("employes2");
        if (element.options.length == 1 && element2.options.length == 1) {
            for (var j = 0; j < result.length; ++j) {
                var tag = document.createElement("option");
                var tag2 = document.createElement("option");
                tag2.textContent = result[j].firstname + " " + result[j].lastname;
                tag.value = result[j].username;
                tag2.value = result[j].username;
                tag.textContent = result[j].firstname + " " + result[j].lastname;

                element.append(tag);
                element2.append(tag2);
            }
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
    else if (month === 'April') {
        return '04';
    }
    else if (month === 'May') {
        return '05';
    }
    else if (month === 'June') {
        return '06';
    }
    else {
        console.log("getMonth function")
    }

}
updateshift.onclick = async () => {
    morningEmploye = document.getElementById("employes");
    eveningEmploye = document.getElementById("employes2");
    var valuemorning = morningEmploye.options[morningEmploye.selectedIndex].value;
    var valueevening = eveningEmploye.options[eveningEmploye.selectedIndex].value;
    console.log(valuemorning)
    console.log(valueevening)
    if (valuemorning === 'select') {
        alert('choose employee for morning shift')
    }
    else if (valueevening === 'select') {
        alert('choose employee for evening shift')
    }
    else if (valueevening === valuemorning) {
        alert("choose different employes for each shift")

    } else {
        console.log("selected is ", selected_1);
        monthAndYear = document.getElementById("current-date").innerHTML;
        console.log(monthAndYear);
        splitArray = monthAndYear.split(" ");
        day = selected_1;
        month = splitArray[0];
        year = splitArray[1];
        const body = { Day: day, Month: month, Year: year, MorningEmploye: valuemorning, EveningEmploye: valueevening }
        const fetchAddNewShift = await fetch("http://localhost:4000/adminCalendar", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await fetchAddNewShift.json();
        if (result == 'failed') {
            alert('this shift already determined');
        }
        else if (result == 'success') {
            emp1 = document.getElementById('morn');
            emp2 = document.getElementById('even');
            box1 = document.getElementById("box1")
            box2 = document.getElementById("box2")
            updateshiftButton = document.getElementById('update');
            updateshiftButton.style.visibility = 'hidden';
            box1.style.visibility = 'hidden';
            box2.style.visibility = 'hidden';
            alreadyAdded1 = document.getElementById("alreadyAdded")
            alreadyAdded1.style.visibility = 'visible';
            emp1.style.visibility = 'visible'
            emp2.style.visibility = 'visible'
        }

    }
}


function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}