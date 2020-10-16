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
            let tWMin = 0; //initialize variable for total minutes
            let weekHrs = 0;
            let overAllUserHrs = 0;
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(wH => {
                    tMin += wH.hourId.totalMinutes;
                })
                weekHrs = tMin / 60; //Convert total minutes to hours
            }

            if (user.weeklyHours.weekHours.length > 0) {
                user.weeklyHours.weekHours.forEach(wlyH => {
                    tWMin += wlyH.weekHourId.totalMinutes;
                })
                overAllUserHrs = tWMin / 60; //Convert total minutes to hours
            }

            if (user.myHours.hours.length || user.weeklyHours.weekHours.length > 0) {

                /***************************************
                * Fill the User Hours part of the page
                ****************************************/
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

                /***************************************
                * Fill the User Weeks part of the page
                ****************************************/
                $('#student_weeks').html(''); // First clear what is in the div
                $('#over-all-user-hours').html('<br><br>Past weeks: <b>' + ((tWMin) / 60).toFixed(2) + '</b><br>Past weeks + this week: <b>' + ((tWMin + tMin) / 60).toFixed(2) + '</b>'); // First clear what is in the div
                user.weeklyHours.weekHours.forEach(wHr => {
                    let weekEnd = new Date(wHr.weekHourId.weekEnd);
                    let week_Id = wHr.weekHourId._id;
                    $('#student_weeks').append(
                        '<div class="admin-user-details">'
                        + '<p>Week ending <b>' + weekEnd.toDateString() + '</b><br>'
                        + '<i>Total Hours worked:</i> ' + ((wHr.weekHourId.totalMinutes) / 60).toFixed(2) + '<br>'
                        + '<i>Week of the year:</i> ' + wHr.weekHourId.weekNumber + '</p>'
                        // + '<form>'
                        // + '<input type="hidden" value="' + week_Id + '" name="weekId">'
                        // + '<input type="hidden" name="_csrf" value="' + myToken +'" id="nyToken">'
                        // + '<button class="btn btn-success" type="button" onclick="getWeek(event)">More</button>'
                        // // + '<button class="btn btn-success" type="button" onclick="getWeek('+ week_Id +')">More</button>'
                        // + '</form>'
                        + '</div><hr>');
                });
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
                console.log('Both Arrays are not empty');

            } else {
                $('#over-all-user-hours').html(''); // First clear what is in the div
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            }

            // if (user.myHours.hours.length < 0 && user.weeklyHours.weekHours.length > 0) {
            //     // Hours length is less than on. (No hours recorded).

            //     /***************************************
            //     * Fill the User Hours part of the page
            //     ****************************************/
            //     $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>');

            //     /***************************************
            //     * Fill the User Weeks part of the page
            //     ****************************************/
            //     $('#student_weeks').html(''); // First clear what is in the div
            //     user.weeklyHours.weekHours.forEach(wHr => {
            //         let weekEnd = new Date(wHr.weekHourId.weekEnd);
            //         let week_Id = wHr.weekHourId._id;
            //         $('#student_weeks').append(
            //             '<div class="admin-user-details">'
            //             + '<p>Week ending <b>' + weekEnd.toDateString() + '</b><br>'
            //             + '<i>Total Hours worked:</i> ' + ((wHr.weekHourId.totalMinutes) / 60).toFixed(2) + '<br>'
            //             + '<i>Week of the year:</i> ' + wHr.weekHourId.weekNumber + '</p>'
            //             // + '<form>'
            //             // + '<input type="hidden" value="<%= weekHourId._id %>" name="weekId">'
            //             // + '<input type="hidden" name="_csrf" value="<%= csrfToken %>" id="nyToken">'
            //             // + '<button class="btn btn-success" type="button" onclick="getWeek('${week_Id}')">More</button>'
            //             // + '</form>'
            //             + '</div><hr>');
            //     });
            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
            //     console.log('Array Length for User Hours is empty');

            // } else {
            //     $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            // }

            // if (user.myHours.hours.length > 0 && user.weeklyHours.weekHours.length < 0) {
            //     // Weeks length is less than on. (No weeks created yet).

            //     /***************************************
            //     * Fill the User Hours part of the page
            //     ****************************************/
            //     $('#student_details').html(''); // First clear what is in the div
            //     user.myHours.hours.forEach(hr => {
            //         let manDate = new Date(hr.hourId.manualDate);
            //         $('#student_details').append(
            //             '<div class="admin-user-details"><p><b>' + manDate.toDateString() + '</b><br>'
            //             + '<span><i class="fas fa-history"></i> <i>Hours:</i> ' + hr.hourId.hours + '</span>'
            //             + '<i class="fas fa-history min-admin"></i> <i>Minutes:</i> ' + hr.hourId.minutes + '<br>'
            //             + '<i class="fas fa-clipboard"></i> <i>Task Description:</i> ' + hr.hourId.taskDescription + '<br>'
            //             + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</p></div><hr>');
            //     });

            //     /***************************************
            //      * Fill the User Weeks part of the page
            //      ****************************************/
            //     $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>');

            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
            //     console.log('Array Length for User Weeks is empty');

            // } else {
            //     $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
            //     $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            // }

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
    const weekId = event.path[1].childNodes[0].defaultValue;
    // console.log(event);
    // console.log('Week Id: ' + weekId);
    let newToken = $('#nyToken').val();
    let theUrl = "/admin/week/" + weekId;

    $.ajax({
        url: theUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            weekId: weekId,
            _csrf: newToken
        }),
        success: function (week) {
            console.log('Week' + week)
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};
