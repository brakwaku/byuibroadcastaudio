
$(function () {

    $('#student').on('click', function(e){
        e.preventDefault();
        let myUrl = $('#student').val();
        let myToken = $('#myToken');

        $.ajax({
            type: 'POST',
            url: myUrl,
            csrfToken: myToken,
            success: function(data) {
                console.log('success', data);
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