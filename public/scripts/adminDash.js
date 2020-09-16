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
                    $('#student_details').append(
                        '<div class="admin-user-details"><p><b>' + hr.hourId.manualDate.split('T')[0] + '</b><br>' 
                        + '<i class="fas fa-history"></i> <i>Hours:</i> ' + hr.hourId.hours + '<br>'
                        + '<i class="fas fa-history"></i> <i>Minutes:</i> ' + hr.hourId.minutes + '<br>'
                        + '<i class="fas fa-clipboard"></i> <i>Task Description:</i> ' + hr.hourId.taskDescription + '<br>'
                        + '<i class="fas fa-comment"></i> <i>Comments:</i> ' + hr.hourId.comments + '</p></div><hr>');
                });
                console.log(user.myHours.hours.length);
            } else {
                $('#student_details').html('<div class="container"><h6>Sorry! No data to display for this user</h6></div>')
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