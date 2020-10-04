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
                $('#studentWeekHour').html(weekHrs.toFixed(3) + ' Hrs');
                console.log(user.myHours.hours.length);
            } else {
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
                $('#studentWeekHour').html(weekHrs.toFixed(3) + ' Hrs');
            }
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};