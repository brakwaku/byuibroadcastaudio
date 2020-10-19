/*********
 * Clock on user dashboard
 */
const clock = document.getElementById('clock');

function updateTime() {
    const now = moment();
    const humanReadable = now.format('hh:mm:ss A');
    clock.textContent = humanReadable;
}

setInterval(updateTime, 1000); //Update every second

updateTime();


/***************************************************
 * Reminder to submit time for the week
 ****************************************************/
window.onload = function () {
    let dayOfTheWeek = new Date();
    if (dayOfTheWeek.getDay() === 5 || dayOfTheWeek === 6) {
        $('#submit-reminder').css('visibility', 'visible')
        $('#submit-reminder').html('Remember to submit your hours for the week')
    }

    $('#submit-reminder').on('click', function () {
        $('#submit-reminder').css('visibility', 'hidden')
    });
}


/***************************************************
 * Submitting time
 ****************************************************/
$('#theUserBtn').on('click', function (event) {
    //First prevent it from doing what it normally does (submit)
    event.preventDefault();
    let myToken = $('#thisToken').val();

    //Then show popup to get user confirmation
    swal({
        title: "Confirm?",
        text: "This action can't be undone. If you are not done working this week, please submit your time later. Thank you!",
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
                    url: "/askas/calculateWeek",
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        _csrf: myToken
                    }),
                    success: function (data) {
                        //console.log(data);
                        if (data === 'Saab') {
                            //Show this if there are no user hours currently recorded
                            swal("Sorry!", "You dont have any recorded time to submit.", "success");
                        } else {
                            //Show this if the week object has been created
                            swal("Submited!", "Your time has been submited.", "success");
                            location.reload();
                        }
                    },
                    error: function (data) {
                        //Show this if there is an error
                        swal("NOT Submited!", "Something blew up.", "error");
                    }
                });
            } else {
                //Show this if the user withdraws
                swal("Cancelled", "Your time was not submitted.", "error");
            }
        });
    return false

});


/***************************************
 * User editing time entered already
 ****************************************/
function getTimeId(event) {
    const timeId = event;
    // const timeId = event.path[1].childNodes[1].defaultValue;
    let myToken = $('#myToken').val();
    let myUrl = "/askas/edit-time/" + timeId;

    $.ajax({
        url: myUrl,
        type: 'GET',
        contentType: "application/json",
        data: JSON.stringify({
            timeId: timeId,
            _csrf: myToken
        }),
        success: function (time) {
            let manDate = new Date(time.manualDate);
            let startTime = time.startTime;
            let endTime = time.endTime;
            let description = time.taskDescription;
            let comments = time.comments;

            function getFormattedDate(someDate) {
                let year = someDate.getFullYear();
                let month = (1 + someDate.getMonth()).toString().padStart(2, '0');
                let day = someDate.getDate().toString().padStart(2, '0');

                return month + '/' + day + '/' + year;
            }

            $('.week-col').html('<i class="fas fa-edit"></i> EDIT TIME');
            
            $('.edit-time-con').html(
                '<form action="/askas/update-time" method="POST">'
                + '<label for="date">Date</label>'
                + '<input name="manDate" type="text" class="form-control" id="manDate" value="' + getFormattedDate(manDate) + '" ><br>'
                + '<label for="startTime">Start time (00:00 AM)</label>'
                + '<input name="startTime" type="time" class="form-control" id="startTime" value="' + startTime + '" ><br>'
                + '<label for="endTime">End time (00:00 PM)</label>'
                + '<input name="endTime" type="time" class="form-control" id="endTime" value="' + endTime + '" ><br>'
                + '<label for="taskDescription">Task Description</label>'
                + '<textarea name="taskDescription" class="form-control" id="taskDescription" cols="15" rows="3" value="' + description + '" >' + description + '</textarea><br>'
                + '<label for="comments">Comments</label>'
                + '<textarea name="comments" class="form-control" id="comments" cols="15" rows="5" value="' + comments + '">' + comments + '</textarea><br>'
                + '<input type="hidden" name="_csrf" value="' + myToken + '">'
                + '<input type="hidden" name="timeId" value="' + timeId + '">'
                + '<button class="btn btn-success " type="submit">Update</button>'
                + '</form><br>');

            console.log('Comment: ' + description);
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};

function userDashGetWeek(weekId) {
    let newToken = $('#my_Token').val();
    let theUrl = "/askas/week/" + weekId;

    $.ajax({
        url: theUrl,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            weekId: weekId,
            _csrf: newToken
        }),
        success: function (week) {
            /*********************************************************************
            * Fill the Hours Worked part of the page with hours in the week object
            **********************************************************************/
            $('.student-next-con-mid').html(''); // First clear what is in the div
            week.timeArray.times.forEach(hrs => {

                let manDate = new Date(hrs.weekTimeId.manualDate);
                $('.student-next-con-mid').append(
                    '<div class="hour-list-div"><p><b>' + manDate.toDateString() + '</b><br>'
                    + '<span><i class="fas fa-history"></i> <i>Hours:</i> ' + hrs.weekTimeId.hours + '</span>'
                    + '<i class="fas fa-history min-admin"></i> <i>Minutes:</i> ' + hrs.weekTimeId.minutes + '<br>'
                    + '<i class="fas fa-clipboard"></i> <i>Task Description:</i> ' + hrs.weekTimeId.taskDescription + '<br>'
                    + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hrs.weekTimeId.comments + '</p></div>');
            });
        }, error: function (err) {
            console.log(err);
        }
    });
};