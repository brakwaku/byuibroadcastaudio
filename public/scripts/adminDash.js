
$(function () {

    $("#student-list").click(function(e) {
        let user = $(this).attr("href");
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: user,
            success: function(data) {
                console.log('success', data);
            }
        })
    })
    
})