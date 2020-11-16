/***************************************************
 * Reminder to submit time for the year
 ****************************************************/
window.onload = function () {
    const myToken = $('#myToken').val();
    const yearTotal = $('#yr-total').val();
    const weekOfYear = moment().week();
    const loggedInId = $('#loggedin-userId').val();
    //console.log(weekOfYear);

    if ((weekOfYear >= 52) && yearTotal > 0) {
        $('#submit-year-reminder-container').css({"height": "55px", "padding-top": "7px"});
        $('#submit-year-reminder').css({ "visibility": "visible", "display": "visible" });
        $('#submit-year-reminder').html('<div style="font-weight: bold; justify-self: center;">'
            + 'Please click the "Complete Year" button if today is the last work day of the year</div>'
            + '<div style="justify-self: center"><form>'
            + '<input type="hidden" name="_csrf" value="' + myToken + '">'
            + '<button class="btn btn-danger sub-button" type="button" onclick="completeYear(\'' + loggedInId + '\')">Complete Year</button>'
            + '</form></div>');
    }

    $('#submit-year-reminder').on('click', function () {
        $('#submit-year-reminder-container').css("display", "none");
        // $('#submit-year-reminder').css({ "visibility": "hidden", "display": "none" });
    });
}


/*************************************************************
 * Function to get user details and display on the dashboard
 *************************************************************/
function getUserId(event, uni) {
    const userId = event;
    const theUid = uni;

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
            //console.log('User: ' + user.weeklyHours.weekHours);
            let tMin = 0; //initialize variable for total minutes
            let tWMin = 0; //initialize variable for total minutes
            let weekHrs = 0;

            /******************************************************
             * Function as parameter to sort the week object array
             ******************************************************/
            function compareValues(key, order = 'asc') {
                return function innerSort(a, b) {
                    // if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    //     // property doesn't exist on either object
                    //     return 0;
                    // }

                    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
                    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

                    let comparison = 0;
                    if (varA > varB) {
                        comparison = 1;
                    } else if (varA < varB) {
                        comparison = -1;
                    }
                    return (
                        (order === 'desc') ? (comparison * -1) : comparison
                    );
                };
            } //End of CompareValues function

            // Assign variable to week array
            let theUserWeeksArray = user.weeklyHours.weekHours;


            //let overAllUserHrs = 0;
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(wH => {
                    tMin += wH.hourId.totalMinutes;
                })
                weekHrs = tMin / 60; //Convert total minutes to hours
            }

            if (theUserWeeksArray.length > 0) {
                user.weeklyHours.weekHours.forEach(wlyH => {
                    tWMin += wlyH.weekHourId.totalMinutes;
                })
                overAllUserHrs = tWMin / 60; //Convert total minutes to hours
            }

            // Sort week array by '_id' and assign to new variable
            let theUserWeeksArraySorted = theUserWeeksArray.sort(compareValues('_id', 'desc'))

            if (user.myHours.hours.length || theUserWeeksArraySorted.length > 0) {

                /***************************************
                * Fill the User Hours part of the page
                ****************************************/
                $('#week-in-focus').html(''); // First clear what is in there
                $('#week-in-focus').html('<i class="fas fa-user-clock"></i> USER HOURS');

                $('#student_details').html(''); // First clear what is in the div
                user.myHours.hours.forEach(hr => {
                    let manDate = new Date(hr.hourId.manualDate);

                    $('#student_details').append(
                        '<div class="admin-user-details">'
                        + '<span><b>' + manDate.toDateString() + '</b></span>'
                        + '<div class="admin-user-details-sub"><span>' + hr.hourId.startTime + ' - ' + hr.hourId.endTime + ' | '
                        + hr.hourId.hours + ' Hr(s) | ' + hr.hourId.minutes + ' Min(s)</span></div><hr class="hori-line">'
                        + '<div class="desc-com"><i class="fas fa-clipboard"></i> <i>Task:</i> ' + hr.hourId.taskDescription + '<br>'
                        + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</div></div><hr>');

                });

                /***************************************
                * Fill the right part of selected User
                ****************************************/
                //let thatCId = 0;
                $('#' + theUid).html(''); // First clear what is in the div
                $('#' + theUid).html('Past weeks: <b>' + ((tWMin) / 60).toFixed(2) + '</b><br>Pasts + week: <b>' + ((tWMin + tMin) / 60).toFixed(2) + '</b>');

                /***************************************
                * Fill the User Weeks part of the page
                ****************************************/
                $('#student_weeks').html(''); // First clear what is in the div
                theUserWeeksArraySorted.forEach(wHr => {
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
                        // + '<button class="btn btn-success" type="button" onclick="getWeek(event)">More</button>'
                        + '<button class="btn btn-success" type="button" onclick="getWeek(\'' + week_Id + '\')">More</button>'
                        + '</form>'
                        + '</div><hr>');
                });
                $('#studentWeekHour').html('Student Total<br>' + weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
                //console.log('Both Arrays are not empty');
                //window.location.href = "#over-all-user-hours";

            } else {
                $('#week-in-focus').html(''); // First clear what is in there
                $('#week-in-focus').html('<i class="fas fa-user-clock"></i> USER HOURS');
                $('#' + theUid).html(''); // First clear what is in the div
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#over-all-user-hours').html(''); // Clear what is in the div
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            }


            $('#user-in-focus').html('');
            $('#user-in-focus').html('' + user.firstName + '');

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


/*************************************************************
 * Function to get user previous weeks details and display on the dashboard
 *************************************************************/
function getWeeks(event, uni) {
    const userId = event;
    const theUid = uni;

    // const userId = event.path[1].childNodes[1].defaultValue;
    let myToken = $('#myToken2').val();
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
            //console.log('User: ' + user.weeklyHours.weekHours);
            let tMin = 0; //initialize variable for total minutes
            let tWMin = 0; //initialize variable for total minutes
            let weekHrs = 0;

            /******************************************************
             * Function as parameter to sort the week object array
             ******************************************************/
            function compareValues(key, order = 'asc') {
                return function innerSort(a, b) {
                    // if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    //     // property doesn't exist on either object
                    //     return 0;
                    // }

                    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
                    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

                    let comparison = 0;
                    if (varA > varB) {
                        comparison = 1;
                    } else if (varA < varB) {
                        comparison = -1;
                    }
                    return (
                        (order === 'desc') ? (comparison * -1) : comparison
                    );
                };
            } //End of CompareValues function

            // Assign variable to week array
            let theUserWeeksArray = user.weeklyHours.weekHours;


            //let overAllUserHrs = 0;
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(wH => {
                    tMin += wH.hourId.totalMinutes;
                })
                weekHrs = tMin / 60; //Convert total minutes to hours
            }

            if (theUserWeeksArray.length > 0) {
                user.weeklyHours.weekHours.forEach(wlyH => {
                    tWMin += wlyH.weekHourId.totalMinutes;
                })
                overAllUserHrs = tWMin / 60; //Convert total minutes to hours
            }

            // Sort week array by '_id' and assign to new variable
            let theUserWeeksArraySorted = theUserWeeksArray.sort(compareValues('_id', 'desc'))

            if (user.myHours.hours.length || theUserWeeksArraySorted.length > 0) {

                /***************************************
                * Fill the right part of selected User
                ****************************************/
                //let thatCId = 0;
                $('#' + theUid).html(''); // First clear what is in the div
                $('#' + theUid).html('Past weeks: <b>' + ((tWMin) / 60).toFixed(2) + '</b><br>Pasts + week: <b>' + ((tWMin + tMin) / 60).toFixed(2) + '</b>');

                /***************************************
                * Fill the User Weeks part of the page
                ****************************************/
                $('#student_weeks').html(''); // First clear what is in the div
                theUserWeeksArraySorted.forEach((wHr, index, arr) => {
                    let theIndex = 'lastWeek' + index;
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
                        // + '<button class="btn btn-success" type="button" onclick="getWeek(event)">More</button>'
                        + '<button id="' + theIndex + '" class="btn btn-success" type="button" onclick="getWeek(\'' + week_Id + '\')">More</button>'
                        + '</form>'
                        + '</div><hr>');
                });

                $('#studentWeekHour').html('Student Total<br>' + weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week

                /***************************************
                * Click just ended week's "More" button
                ****************************************/
                $('#lastWeek0').trigger("click");

            } else {
                $('#week-in-focus').html(''); // First clear what is in there
                $('#week-in-focus').html('<i class="fas fa-user-clock"></i> USER HOURS');
                $('#' + theUid).html(''); // First clear what is in the div
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#over-all-user-hours').html(''); // Clear what is in the div
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
            }


            $('#user-in-focus').html('');
            $('#user-in-focus').html('' + user.firstName + '');

        }, error: function (err) {
            console.log(err);
        }
    });
};


/**********************************************************************
 * Function to get week details and display the hours on the dashboard
 **********************************************************************/
function getWeek(event) {
    //const weekId = event.path[1].childNodes[0].defaultValue;
    const weekId = event;
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
            $('#week-in-focus').html(''); // First clear what is in there
            $('#week-in-focus').html('' + (new Date(week.weekEnd)).toDateString() + '');

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


/**********************************************************************
 * Function to delete user
 **********************************************************************/
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


/**********************************************************************
 * Function to submit year
 **********************************************************************/
function completeYear(loggedInId) {
    const myToken = $('#my_OldToken').val();
    const userId = loggedInId;

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
                    url: "/admin/complete-year",
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        userId: userId,
                        _csrf: myToken
                    }),
                    success: function (data) {
                        //Show this if the year object has been created
                        swal("Completed!", "Year successfully completed.", "success");
                        location.reload();

                    },
                    error: function (data) {
                        //Show this if there is an error
                        swal("NOT Completed!", "Something blew up. Sorry", "error");
                    }
                });
            } else {
                //Show this if the user withdraws
                swal("Cancelled", "The action was not completed.", "error");
            }
        });
    return false
}