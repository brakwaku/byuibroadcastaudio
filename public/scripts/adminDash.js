/*************************************************************
 * Function to get user details and display on the dashboard
 *************************************************************/
function getUserId(event) {
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
            //let overAllUserHrs = 0;
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
                    
                    manDate.setDate(manDate.getDate() + 1) //Only because it displays a day off
                    
                    $('#student_details').append(
                        '<div class="admin-user-details">'
                        + '<span><b>' + manDate.toDateString() + '</b></span>'
                        + '<div class="admin-user-details-sub"><span>' + hr.hourId.startTime + ' - ' + hr.hourId.endTime + ' | '
                        + hr.hourId.hours + ' Hr(s) | ' + hr.hourId.minutes + ' Min(s)</span></div><hr class="hori-line">'
                        + '<div class="desc-com"><i class="fas fa-clipboard"></i> <i>Task:</i> ' + hr.hourId.taskDescription + '<br>'
                        + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</div></div><hr>');
                    
                });

                /***************************************
                * Fill the User Weeks part of the page
                ****************************************/
                $('#student_weeks').html(''); // First clear what is in the div
                $('#over-all-user-hours').html(''); // First clear what is in the div
                $('#over-all-user-hours').html('Past weeks: <b>' + ((tWMin) / 60).toFixed(2) + '</b><br>Pasts + this week: <b>' + ((tWMin + tMin) / 60).toFixed(2) + '</b>');
                user.weeklyHours.weekHours.forEach(wHr => {
                    let weekEnd = new Date(wHr.weekHourId.weekEnd);
                    let week_Id = wHr.weekHourId._id;
                    $('#student_weeks').append(
                        '<div class="admin-user-details">'
                        + '<span>Ending <b>' + weekEnd.toDateString() + '</b></span>'
                        + '<div class="admin-user-details-sub"><span>' + ((wHr.weekHourId.totalMinutes) / 60).toFixed(2) + ' Hrs | '
                        + 'Week: ' + wHr.weekHourId.weekNumber + '</span></div><hr class="hori-line">'
                        + '<form>'
                        + '<input type="hidden" value="' + week_Id + '" name="weekId">'
                        + '<input type="hidden" name="_csrf" value="' + myToken + '" id="nyToken">'
                        + '<button class="btn btn-success" type="button" onclick="getWeek(event)">More</button>'
                        // + '<button class="btn btn-success" type="button" onclick="getWeek('+ week_Id +')">More</button>'
                        + '</form>'
                        + '</div><hr>');
                });
                $('#studentWeekHour').html('Student Total<br>' + weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
                //console.log('Both Arrays are not empty');
                //window.location.href = "#over-all-user-hours";

            } else {
                $('#over-all-user-hours').html(''); // First clear what is in the div
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#over-all-user-hours').html(''); // Clear what is in the div
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
    let newToken = $('#nyToken').val();
    let theUrl = "/admin/week/" + weekId;
    console.log('Token: ' + newToken);

    $.ajax({
        url: theUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            weekId: weekId,
            _csrf: newToken
        }),
        success: function (week) {
            //console.log(week.timeArray.times)
            /*********************************************************************
            * Fill the User Hours part of the page with hours in the week object
            **********************************************************************/
            $('#student_details').html(''); // First clear what is in the div
            week.timeArray.times.forEach(hrs => {
                //console.log(hrs)
                let manDate = new Date(hrs.weekTimeId.manualDate);
                $('#student_details').append(
                    '<div class="admin-user-details past-week-details">'
                    + '<span><b>' + manDate.toDateString() + '</b></span>'
                    + '<div class="admin-user-details-sub"><span>' + hrs.weekTimeId.startTime + ' - ' + hrs.weekTimeId.endTime + ' | '
                    + hrs.weekTimeId.hours + ' Hr(s) | ' + hrs.weekTimeId.minutes + ' Min(s)</span></div><hr class="hori-line">'
                    + '<div class="desc-com"><i class="fas fa-clipboard"></i> <i>Task:</i> ' + hrs.weekTimeId.taskDescription + '<br>'
                    + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hrs.weekTimeId.comments + '</div></div><hr>');
            });
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};

function deleteUser(theUserId) {
    let myToken = $('#my_OldToken').val();
    const userId = theUserId;

    //Then show popup to get user confirmation
    swal({
        title: "Confirm?",
        text: "This action can't be undone. Continue?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, submit!",
        cancelButtonText: "No, cancel!",
        closeOnConfirm: false,
        closeOnCancel: false
    }).then(
        //If user confirms action
        function (isConfirm) {
            if (isConfirm) {
                //Make an ajax request to the server to create the week object
                $.ajax({
                    url: "/admin/deleteUser/" + userId,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        userId: userId,
                        _csrf: myToken
                    }),
                    success: function (data) {
                        //Show this if the week object has been created
                        swal("Deleted!", "The user has been deleted.", "success");
                        location.reload();

                    },
                    error: function (data) {
                        //Show this if there is an error
                        swal("NOT Deleted!", "Something blew up. Sorry", "error");
                    }
                });
            } else {
                //Show this if the user withdraws
                swal("Cancelled", "The user was not deleted.", "error");
            }
        });
    return false
}