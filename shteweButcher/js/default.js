mobiscroll.setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

var calendar;
var popup;
var range;
var oldShift;
var tempShift;
var deleteShift;
var formatDate = mobiscroll.util.datetime.formatDate;
var notes = document.getElementById('employee-shifts-notes');
var deleteButton = document.getElementById('employee-shifts-delete');

var staff = [{
    id: 1,
    name: 'Ryan',
    color: '#e20000',
    title: 'Cloud System Engineer',
    img: 'https://img.mobiscroll.com/demos/m1.png'
}, {
    id: 2,
    name: 'Kate',
    color: '#60e81a',
    title: 'Help Desk Specialist',
    img: 'https://img.mobiscroll.com/demos/f1.png'
}, {
    id: 3,
    name: 'John',
    color: '#3ba7ff',
    title: 'Application Developer',
    img: 'https://img.mobiscroll.com/demos/m2.png'
}, {
    id: 4,
    name: 'Mark',
    color: '#e25dd2',
    title: 'Network Administrator',
    img: 'https://img.mobiscroll.com/demos/m3.png'
}, {
    id: 5,
    name: 'Sharon',
    color: '#f1e920',
    title: 'Data Quality Manager',
    img: 'https://img.mobiscroll.com/demos/f2.png'
}, {
    id: 6,
    name: 'Emma',
    color: '#1ac38d',
    title: 'Product Tactics Agent',
    img: 'https://img.mobiscroll.com/demos/f3.png'
}];

var shifts = [{
    start: '2023-03-09T07:00',
    end: '2023-03-09T13:00',
    title: '07:00 - 13:00',
    resource: 2,
    slot: 1
}, {
    start: '2023-03-09T07:00',
    end: '2023-03-09T13:00',
    title: '07:00 - 13:00',
    resource: 3,
    slot: 1
}, {
    start: '2023-03-09T07:00',
    end: '2023-03-09T13:00',
    title: '07:00 - 13:00',
    resource: 6,
    slot: 1
}, {
    start: '2023-03-09T12:00',
    end: '2023-03-09T18:00',
    title: '12:00 - 18:00',
    resource: 4,
    slot: 2
}, {
    start: '2023-03-09T12:00',
    end: '2023-03-09T18:00',
    title: '12:00 - 18:00',
    resource: 5,
    slot: 2
}, {
    start: '2023-03-10T07:00',
    end: '2023-03-10T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-10T07:00',
    end: '2023-03-10T13:00',
    title: '07:00 - 13:00',
    resource: 2,
    slot: 1
}, {
    start: '2023-03-10T07:00',
    end: '2023-03-10T13:00',
    title: '07:00 - 13:00',
    resource: 6,
    slot: 1
}, {
    start: '2023-03-10T12:00',
    end: '2023-03-10T18:00',
    title: '12:00 - 18:00',
    resource: 3,
    slot: 2
}, {
    start: '2023-03-10T12:00',
    end: '2023-03-10T18:00',
    title: '12:00 - 18:00',
    resource: 5,
    slot: 2
}, {
    start: '2023-03-11T07:00',
    end: '2023-03-11T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-11T07:00',
    end: '2023-03-11T13:00',
    title: '07:00 - 13:00',
    resource: 3,
    slot: 1
}, {
    start: '2023-03-11T07:00',
    end: '2023-03-11T13:00',
    title: '07:00 - 13:00',
    resource: 4,
    slot: 1
}, {
    start: '2023-03-11T12:00',
    end: '2023-03-11T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-11T12:00',
    end: '2023-03-11T18:00',
    title: '12:00 - 18:00',
    resource: 6,
    slot: 2
}, {
    start: '2023-03-12T07:00',
    end: '2023-03-12T13:00',
    title: '07:00 - 13:00',
    resource: 5,
    slot: 1
}, {
    start: '2023-03-12T07:00',
    end: '2023-03-12T13:00',
    title: '07:00 - 13:00',
    resource: 6,
    slot: 1
}, {
    start: '2023-03-12T12:00',
    end: '2023-03-12T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-12T12:00',
    end: '2023-03-12T18:00',
    title: '12:00 - 18:00',
    resource: 4,
    slot: 2
}, {
    start: '2023-03-13T07:00',
    end: '2023-03-13T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-13T07:00',
    end: '2023-03-13T13:00',
    title: '07:00 - 13:00',
    resource: 5,
    slot: 1
}, {
    start: '2023-03-13T12:00',
    end: '2023-03-13T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-13T12:00',
    end: '2023-03-13T18:00',
    title: '12:00 - 18:00',
    resource: 3,
    slot: 2
}, {
    start: '2023-03-13T12:00',
    end: '2023-03-13T18:00',
    title: '12:00 - 18:00',
    resource: 6,
    slot: 2
}];

var slots = [{
    id: 1,
    name: 'Morning',
}, {
    id: 2,
    name: 'Afternoon',
}];

var invalid = [{
    start: '2023-03-12T00:00',
    end: '2023-03-12T23:59',
    resource: 4,
    slot: 1
}, {
    start: '2023-03-10T00:00',
    end: '2023-03-10T23:59',
    resource: 2,
    slot: 2
}];

function createAddPopup(args) {
    // hide delete button inside add popup
    deleteButton.style.display = 'none';
    deleteShift = true;
    restoreShift = false;
    var slot = slots.find(function (s) { return s.id === tempShift.slot });

    // set popup header text and buttons for adding
    popup.setOptions({
        headerText: '<div>New shift</div><div class="employee-shifts-day">' +
            formatDate('DDDD', new Date(tempShift.start)) + ' ' + slot.name + ',' + formatDate('DD MMMM YYYY', new Date(tempShift.start)) + '</div>',
        buttons: [
            'cancel',
            {
                text: 'Add',
                keyCode: 'enter',
                handler: function () {
                    calendar.updateEvent(tempShift);

                    deleteShift = false;
                    popup.close();
                },
                cssClass: 'mbsc-popup-button-primary'
            }
        ]
    });
    // fill popup with a new event data
    range.setOptions({ minTime: tempShift.slot == 1 ? '07:00' : '12:00', maxTime: tempShift.slot == 1 ? '13:00' : '18:00' });
    range.setVal([tempShift.start, tempShift.end]);

    popup.open();
}

function createEditPopup(args) {
    var ev = args.event;
    var resource = staff.find(function (r) { return r.id === ev.resource });
    var slot = slots.find(function (s) { return s.id === ev.slot });
    var headerText = '<div>Edit ' + resource.name + '\'s hours</div><div class="employee-shifts-day">' +
        formatDate('DDDD', new Date(ev.start)) + ' ' + slot.name + ',' + formatDate('DD MMMM YYYY', new Date(ev.start)) + '</div>';

    // show delete button inside edit popup
    deleteButton.style.display = 'block';

    deleteShift = false;
    restoreShift = true;

    // // set popup header text and buttons for editing
    popup.setOptions({
        headerText: headerText,
        buttons: [
            'cancel',
            {
                text: 'Save',
                keyCode: 'enter',
                handler: function () {
                    var date = range.getVal();

                    // update event with the new properties on save button click
                    calendar.updateEvent({
                        id: ev.id,
                        title: formatDate('HH:mm', date[0]) + ' - ' + formatDate('HH:mm', date[1] ? date[1] : date[0]),
                        notes: notes.value,
                        start: date[0],
                        end: date[1] ? date[1] : date[0],
                        resource: resource.id,
                        color: resource.color,
                        slot: slot.id,
                    });

                    restoreShift = false;
                    popup.close();
                },
                cssClass: 'mbsc-popup-button-primary'
            }
        ]
    });

    // fill popup with the selected event data
    mobiscroll.getInst(notes).value = ev.notes || '';
    range.setOptions({ minTime: ev.slot == 1 ? '07:00' : '12:00', maxTime: ev.slot == 1 ? '13:00' : '18:00' });
    range.setVal([ev.start, ev.end]);

    popup.open();
}

calendar = mobiscroll.eventcalendar('#demo-employee-shifts-calendar', {
    view: {
        timeline: {
            type: 'week',
            eventList: true,
            startDay: 1,
            endDay: 5
        }
    },
    data: shifts,
    dragToCreate: false,
    dragToResize: false,
    dragToMove: true,
    clickToCreate: true,
    resources: staff,
    invalid: invalid,
    slots: slots,
    extendDefaultEvent: function (ev) {
        var d = ev.start;
        var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ev.slot == 1 ? 7 : 12);
        var end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ev.slot == 1 ? 13 : 18);

        return {
            title: formatDate('HH:mm', start) + ' - ' + formatDate('HH:mm', end),
            start: start,
            end: end,
            resource: ev.resource
        };
    },
    onEventCreate: function (args, inst) {
        // store temporary event
        tempShift = args.event;
        setTimeout(function () {
            createAddPopup(args);
        }, 100);
    },
    onEventClick: function (args, inst) {
        oldShift = Object.assign({}, args.event);
        tempShift = args.event;

        if (!popup.isVisible()) {
            createEditPopup(args);
        }
    },
    renderResource: function (resource) {
        return '<div class="employee-shifts-cont">' +
            '<div class="employee-shifts-name">' + resource.name + '</div>' +
            '<div class="employee-shifts-title">' + resource.title + '</div>' +
            '<img class="employee-shifts-avatar" src="' + resource.img + '"/>' +
            '</div>';
    },
});

popup = mobiscroll.popup('#demo-employee-shifts-popup', {
    display: 'bottom',
    contentPadding: false,
    fullScreen: true,
    onClose: function () {
        if (deleteShift) {
            calendar.removeEvent(tempShift);
        } else if (restoreShift) {
            calendar.updateEvent(oldShift);
        }
    },
    responsive: {
        medium: {
            display: 'center',
            width: 400,
            fullScreen: false,
            touchUi: false,
            showOverlay: false
        }
    }
});

range = mobiscroll.datepicker('#demo-employee-shifts-date', {
    controls: ['time'],
    select: 'range',
    display: 'anchored',
    showRangeLabels: false,
    touchUi: false,
    startInput: '#employee-shifts-start',
    endInput: '#employee-shifts-end',
    stepMinute: 30,
    timeWheels: '|h:mm A|',
    onChange: function (args) {
        var date = args.value;

        // update shift's start/end date
        tempShift.start = date[0];
        tempShift.end = date[1] ? date[1] : date[0];
        tempShift.title = formatDate('HH:mm', date[0]) + ' - ' + formatDate('HH:mm', date[1] ? date[1] : date[0]);
    }
});

notes.addEventListener('change', function (ev) {
    // update current event's title
    tempShift.notes = ev.target.value;
});

deleteButton.addEventListener('click', function () {
    // delete current event on button click
    calendar.removeEvent(tempShift);

    // save a local reference to the deleted event
    var deletedShift = tempShift;

    popup.close();

    mobiscroll.snackbar({
        button: {
            action: function () {
                calendar.addEvent(deletedShift);
            },
            text: 'Undo'
        },
        duration: 10000,
        message: 'Shift deleted'
    });
});
