/*************************************************************
 * Function to get user details and display on the dashboard
 *************************************************************/
function getId(event) {
    const userId = event;
    // const userId = event.path[1].childNodes[1].defaultValue;
    let myToken = $('#myToken').val();
    let myUrl = "/admin/users/" + userId;

    $.ajax({
        url: myUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            userId: userId,
            _csrf: myToken
        }),
        success: function (user) {
            let tMin = 0; //initialize variable for total minutes
            let weekHrs = 0;
            let weekMins = 0;
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(wH => {
                    tMin += wH.hourId.totalMinutes;
                })
                weekMins = tMin % 60; //Calculate number of minutes after hours
                weekHrs = tMin / 60; //Convert total minutes to hours
            }

            if (user.myHours.hours.length > 0) {
                $('#student_details').html(''); // First clear what is in the div
                user.myHours.hours.forEach(hr => {
                    let manDate = new Date(hr.hourId.manualDate);
                    $('#student_details').append(
                        '<div class="admin-user-details"><p><b>' + manDate.toDateString() + '</b><br>'
                        + '<span><i class="fas fa-history"></i> <i>Hours:</i> ' + hr.hourId.hours + '</span>'
                        + '<i class="fas fa-history min-admin"></i> <i>Minutes:</i> ' + hr.hourId.minutes + '<br>'
                        + '<i class="fas fa-clipboard"></i> <i>Task Description:</i> ' + hr.hourId.taskDescription + '<br>'
                        + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</p></div><hr>');
                });
                $('#student_weeks').html(''); // First clear what is in the div
                user.weeklyHours.weekHours.forEach(wHr => {
                    let weekEnd = new Date(wHr.weekHourId.weekEnd);
                    let week_Id = wHr.weekHourId._id;
                    $('#student_weeks').append(
                        '<div class="admin-user-details">'
                        + '<p>Week ending <b>' + weekEnd.toDateString() + '</b><br>'
                        + '<i>Total Hours worked:</i> ' + ((wHr.weekHourId.totalMinutes) / 60).toFixed(2) + '<br>'
                        + '<i>Week of the year:</i> ' + wHr.weekHourId.weekNumber + '</p>'
                        // + '<form>'
                        // + '<input type="hidden" value="<%= weekHourId._id %>" name="weekId">'
                        // + '<input type="hidden" name="_csrf" value="<%= csrfToken %>" id="nyToken">'
                        // + '<button class="btn btn-success" type="button" onclick="getWeek('${week_Id}')">More</button>'
                        // + '</form>'
                        + '</div><hr>');
                });
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
                console.log('Array Length: ' + user.myHours.hours.length);
            } else {
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            }
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};


/**********************************************************************
 * Function to get week details and display the hours on the dashboard
 **********************************************************************/
function getWeek(event) {
    const weekId = event;
    console.log(event);
    let myToken = $('#nyToken').val();
    // let myToken = req.csrfToken();
    let myUrl = "/admin/week/" + weekId;

    $.ajax({
        url: myUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            weekId: weekId,
            _csrf: myToken
        }),
        success: function (week) {
            // let tMin = 0; //initialize variable for total minutes
            // let weekHrs = 0;
            // let weekMins = 0;
            // if (week.myHours.hours.length > 0) {
            //     week.myHours.hours.forEach(wH => {
            //         tMin += wH.hourId.totalMinutes;
            //     })
            //     weekMins = tMin % 60; //Calculate number of minutes after hours
            //     weekHrs = tMin / 60; //Convert total minutes to hours
            // }

            // if (week.myHours.hours.length > 0) {
            //     $('#student_details').html(''); // First clear what is in the div
            //     week.myHours.hours.forEach(hr => {
            //         let manDate = new Date(hr.hourId.manualDate);
            //         $('#student_details').append(
            //             '<div class="admin-user-details"><p><b>' + manDate.toDateString() + '</b><br>'
            //             + '<span><i class="fas fa-history"></i> <i>Hours:</i> ' + hr.hourId.hours + '</span>'
            //             + '<i class="fas fa-history min-admin"></i> <i>Minutes:</i> ' + hr.hourId.minutes + '<br>'
            //             + '<i class="fas fa-clipboard"></i> <i>Task Description:</i> ' + hr.hourId.taskDescription + '<br>'
            //             + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</p></div><hr>');
            //     });
            //     $('#student_weeks').html(''); // First clear what is in the div
            //     week.weeklyHours.weekHours.forEach(wHr => {
            //         let weekEnd = new Date(wHr.weekHourId.weekEnd);
            //         $('#student_weeks').append(
            //             '<div class="admin-user-details">'
            //             + '<p>Week ending <b>' + weekEnd.toDateString() + '</b><br>'
            //             + '<i>Total Hours worked:</i> ' + ((wHr.weekHourId.totalMinutes) / 60).toFixed(2) + '<br>'
            //             + '<i>Week of the year:</i> ' + wHr.weekHourId.weekNumber + '</p>'
            //             + '<form>'
            //             + '<input type="hidden" value="<%= weekHourId._id %>" name="weekId">'
            //             + '<input type="hidden" name="_csrf" value="<%= csrfToken %>" id="myToken">'
            //             + '<button class="btn btn-success" type="button" onclick="getWeek(' + wHr.weekHourId._id + ')">More</button>'
            //             + '</form>'
            //             + '</div><hr>');
            //     });
            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            //     console.log(week.myHours.hours.length);
            // } else {
            //     $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            // }
            console.log('Week' + week)
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};
