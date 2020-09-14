function getId (event) {
    const userId = event.path[1].childNodes[1].defaultValue;
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
        success: function(user) {
            if (user.myHours.hours.length > 0) {
                user.myHours.hours.forEach(hr => {
                    let timeDate = hr.hourId.manualDate.split('T')[0];
                    $('#student_details').html(
                        '<div><p><b>Date: ' + timeDate + '</b></p>' 
                        + '<p>Hours: ' + hr.hourId.hours + '</p>'
                        + '<p>Minutes: ' + hr.hourId.minutes + '</p>'
                        + '<p>Task Description: ' + hr.hourId.taskDescription + '</p><hr></div>');
                });
            } else {
                $('#student_details').html('<p>Sorry! No data to display for this user</p>')
            }
        }, error: function(err) {
            console.log(err);
        }
    });
    //console.log(event.path[1].childNodes[1].defaultValue)
};


// $(function () {

//     $('.view-user-details').on('submit', function(event){
//         event.preventDefault();
//         event.stopPropagation();
//         let myToken = $('#myToken').val();
//         let userId = $('#student').val();
//         let myUrl = "/admin/users/" + userId;

//         $.ajax({
//             url: myUrl,
//             type: 'POST',
//             contentType: "application/json",
//             data: JSON.stringify({
//                 userId: userId,
//                 _csrf: myToken
//             }),
//             success: function(user) {
//                 if (user.myHours.hours.length > 0) {
//                     user.myHours.hours.forEach(hr => {
//                         $('#student_details').html(
//                             '<p>Date: ' + hr.hourId.manualDate + '</p>' 
//                             + '<p>Hours: ' + hr.hourId.hours + '</p>'
//                             + '<p>Minutes: ' + hr.hourId.minutes + '</p>'
//                             + '<p>Name: ' + user.name + '</p>'
//                             + '<p>Task Description: ' + hr.hourId.minutes + '</p>');
//                     });
//                 } else {
//                     $('#student_details').html('<p>No data to display</p>')
//                 }
//             }, error: function(err) {
//                 console.log(err);
//             }
//         });
//     });
// });