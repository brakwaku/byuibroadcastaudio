
$(function () {

    $('form').on('submit', function(event){
        event.preventDefault();
        event.stopPropagation();
        let myToken = $('#myToken').val();
        let userId = $('#student').val();
        let myUrl = "/admin/users/" + userId;

        $.ajax({
            url: myUrl,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                userId: userId,
                _csrf: myToken
            }),
            success: function(user) {
                if (user.myHours.hours.length > 0) {
                    user.myHours.hours.forEach(hr => {
                        $('#student_details').html(
                            '<p>Student Date: ' + hr.hourId.manualDate + '</p>' 
                            + '<p>Hours: ' + hr.hourId.hours + '</p>'
                            + '<p>Minutes: ' + hr.hourId.minutes + '</p>');
                    });
                }
            }, error: function(err) {
                console.log(err);
            }
        });
    });


    // $("#student-list").click(function(e) {
    //     let user = $(this).attr("href");
    //     e.preventDefault();
    //     $.ajax({
    //         type: 'GET',
    //         url: user,
    //         success: function(data) {
    //             console.log('success', data);
    //         }
    //     })
    // })
    
})