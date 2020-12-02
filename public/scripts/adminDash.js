//const { default: swal } = require("sweetalert");

/***************************************************
 * Reminder to submit time for the year
 ****************************************************/
window.onload = function () {
    const myToken = $('#myToken').val();
    const yearTotal = $('#yr-total').val();
    const weekOfYear = moment().week();
    const loggedInId = $('#loggedin-userId').val();
    //console.log(weekOfYear);

    if ((weekOfYear >= 50) && yearTotal > 0) {
        $('#submit-year-reminder-container').css({ "height": "55px", "padding-top": "7px" });
        $('#submit-year-reminder').css({ "visibility": "visible", "display": "visible" });
        $('#submit-year-reminder').html('<div style="font-weight: bold; justify-self: center;">'
            + 'Please click the "Complete Year" button if today is the last work day of the year and all users have submited their hours</div>'
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



/************************************************************************************************************************************************************/

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

/************************************************************************************************************************************************************/



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
            let tWMin = 0; //initialize variable for total week minutes
            let tYMin = 0; //initialize variable for total year minutes
            let weekHrs = 0;

            // Assign variable to week array
            let theUserWeeksArray = user.weeklyHours.weekHours;

            // Assign variable to year array
            let theUserYearsArray = user.yearlyHours.yearHours;

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

            let overAllUserYearlyHrs = 0;
            if (theUserYearsArray.length > 0) {
                user.yearlyHours.yearHours.forEach(ylyH => {
                    tYMin += ylyH.yearHourId.totalMinutes;
                })
                overAllUserYearlyHrs = tYMin / 60; //Convert total minutes to hours
            }

            // Sort week and year array by '_id' and assign to new variable
            let theUserWeeksArraySorted = theUserWeeksArray.sort(compareValues('_id', 'desc'))
            let theUserYearsArraySorted = theUserYearsArray.sort(compareValues('_id', 'desc'))

            if ((user.myHours.hours.length || theUserWeeksArraySorted.length || theUserYearsArraySorted.length) > 0) {
                console.log('Hours: ' + user.myHours.hours.length + ' Weeks: ' + theUserWeeksArraySorted.length + ' Years: ' + theUserYearsArraySorted.length)

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
                $('#student-year-history').html(''); // First clear what is in the div
                $('#student-year-history').html('<i class="fas fa-backward"></i> HISTORY <h6 style="display: inline; margin-left: 10px; color: green;">' + overAllUserYearlyHrs.toFixed(2) + ' hrs</h6>');

                $('#student_weeks').html(''); // First clear what is in the div
                theUserYearsArraySorted.forEach(yHr => {
                    let yearEnd = new Date(yHr.yearHourId.yearEnd);
                    let year_Id = yHr.yearHourId._id;
                    $('#student_weeks').append(
                        '<div class="admin-user-details">'
                        + '<span>Ending <b>' + yearEnd.toDateString() + '</b></span>'
                        + '<div class="admin-user-details-sub"><span>' + ((yHr.yearHourId.totalMinutes) / 60).toFixed(2) + ' Hrs | '
                        + 'Year: ' + yHr.yearHourId.yearNumber + '</span></div><hr class="hori-line">'
                        + '<form>'
                        + '<input type="hidden" value="' + year_Id + '" name="weekId">'
                        + '<input type="hidden" name="_csrf" value="' + myToken + '" id="nyToken">'
                        // + '<button class="btn btn-success" type="button" onclick="getWeek(event)">More</button>'
                        + '<button class="btn btn-success" type="button" onclick="getYear(\'' + year_Id + '\')">More</button>'
                        + '</form>'
                        + '</div><hr>');
                });
                $('#studentWeekHour').html('Student Total<br>' + weekHrs.toFixed(2) + ' Hrs'); //Show combined total number of hours for the week
                //console.log('Both Arrays are not empty');
                //window.location.href = "#over-all-user-hours";

            } else {
                $('#student-year-history').html(''); // First clear what is in the div
                $('#student-year-history').html('<i class="fas fa-calendar"></i> USER WEEKS');

                $('#week-in-focus').html(''); // First clear what is in there
                $('#week-in-focus').html('<i class="fas fa-user-clock"></i> USER HOURS');

                $('#' + theUid).html(''); // First clear what is in the div
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#student_weeks').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#over-all-user-hours').html(''); // Clear what is in the div
                $('#studentWeekHour').html(weekHrs.toFixed(2) + ' Hrs');
                console.log('Down Hours: ' + user.myHours.hours.length + ' Weeks: ' + theUserWeeksArraySorted.length + ' Years: ' + theUserYearsArraySorted.length)

            }


            $('#user-in-focus').html('');
            $('#user-in-focus').html('' + user.firstName + '');


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
                $('#student-year-history').html(''); // First clear what is in there
                $('#student-year-history').html('<i class="fas fa-calendar"></i> USER WEEKS');

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
                $('#student-year-history').html(''); // First clear what is in the div
                $('#student-year-history').html('<i class="fas fa-calendar"></i> USER WEEKS');

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
 * Function to get year details and display theyears on the dashboard
 **********************************************************************/
function getYear(event) {
    //const weekId = event.path[1].childNodes[0].defaultValue;
    const yearId = event;
    let newToken = $('#nav-token').val();
    let theUrl = "/admin/year/" + yearId;
    //console.log('Token: ' + newToken);

    $.ajax({
        url: theUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            yearId: yearId,
            _csrf: newToken
        }),
        success: function (year) {
            // Sort week array by '_id' and assign to new variable
            let theYearWeeksArraySorted = year.weekArray.weeks.sort(compareValues('_id', 'desc'))

            /*********************************************************************
            * Fill the User Hours part of the page with hours in the year object
            **********************************************************************/
            $('#week-in-focus').html(''); // First clear what is in there
            $('#week-in-focus').html('' + (new Date(year.yearEnd)).toDateString() + '');

            $('#student_details').html(''); // First clear what is in the div
            theYearWeeksArraySorted.forEach((wk, index, arr) => {
                console.log('Week: ' + wk.yearTimeId.weekEnd);
                let theOldIndex = 'oldLastWeek' + index;
                let oldWeekEnd = new Date(wk.yearTimeId.weekEnd);
                let oldWeek_Id = wk.yearTimeId._id;
                let manDate = new Date(wk.yearTimeId.dateEntered);
                $('#student_details').append(
                    '<div class="admin-user-details past-week-details">'
                    + '<span><b>' + oldWeekEnd.toDateString() + '</b></span>'
                    + '<div class="admin-user-details-sub"><span>' + (wk.yearTimeId.totalMinutes / 60).toFixed(2) + ' Hr(s) | '
                    + 'Week ' + wk.yearTimeId.weekNumber + '</span></div><hr class="hori-line">'
                    + '<form>'
                    + '<input type="hidden" value="' + oldWeek_Id + '" name="weekId">'
                    + '<input type="hidden" name="_csrf" value="' + newToken + '" id="nyToken">'
                    + '<button id="' + theOldIndex + '" class="btn btn-success" type="button" onclick="getOldWeek(\'' + oldWeek_Id + '\')">More</button>'
                    + '</form>'
                    + '</div><hr>');
            });
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};


/**********************************************************************
 * Function to get week from past year details and display the hours on the dashboard
 **********************************************************************/
function getOldWeek(event) {
    const weekId = event;
    let newToken = $('#nav-token').val();
    let theUrl = "/admin/week/" + weekId;
    //console.log('Token: ' + newToken);

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
            $('#student-year-history').html(''); // First clear what is in there
            $('#student-year-history').html('' + (new Date(week.weekEnd)).toDateString() + '');

            $('#student_weeks').html(''); // First clear what is in the div
            week.timeArray.times.forEach(hrs => {
                //console.log(hrs)
                let manDate = new Date(hrs.weekTimeId.manualDate);
                $('#student_weeks').append(
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

    // Then show popup to get user confirmation
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
        // If user confirms action
        function (isConfirm) {
            if (isConfirm) {
                // Make an ajax request to the server to create the week object
                $.ajax({
                    url: "/admin/complete-year",
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        userId: userId,
                        _csrf: myToken
                    }),
                    success: function (data) {
                        // Variable to check if users have all submitted hours
                        let checker = 0;

                        // Loop through and add all user hours array lengths
                        data.forEach(iUser => {
                            checker += iUser.myHours.hours.length;
                        });

                        if (checker > 0) {
                            // Show this if not all users have submitted their hours
                            swal("Unsuccessful", "Not all users have submitted their hours.", "error");
                        } else {
                            // Show this if the year object has been created
                            swal("Completed!", "Year successfully completed.", "success");
                            location.reload();
                        }

                    },
                    error: function (data) {
                        // Show this if there is an error
                        swal("NOT Completed!", "Something blew up. Sorry", "error");
                    }
                });
            } else {
                // Show this if the user withdraws
                swal("Cancelled", "The action was not completed.", "error");
            }
        });
    return false
}