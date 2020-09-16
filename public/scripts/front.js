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


/***
 * User editing time entered already
 */
function getTimeId(event) {
    const timeId = event.path[1].childNodes[1].defaultValue;
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
            console.log('ManDate: ' + time.manualDate);
            console.log('ManDate 2: ' + manDate);
            //alert(((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
            $('.edit-time-con').html(
                '<form action="/askas/update-time method="POST"">'
                + '<label for="date">Date</label>'
                + '<input name="manDate" type="text" class="form-control" id="manDate" value="' + getFormattedDate(manDate) + '" ><br>'
                + '<label for="startTime">Start time (00:00 AM)</label>'
                + '<input name="startTime" type="time" class="form-control" id="startTime" value="' + startTime + '" ><br>'
                + '<label for="endTime">End time (00:00 PM)</label>'
                + '<input name="endTime" type="time" class="form-control" id="endTime" value="' + endTime + '" ><br>'
                + '<label for="taskDescription">Task Description</label>'
                + '<textarea name="taskDescription" class="form-control" id="taskDescription" cols="15" rows="3" value="' + description + '" ></textarea><br>'
                + '<label for="comments">Comments</label>'
                + '<textarea name="comments" class="form-control" id="comments" cols="15" rows="5" value="' + comments + '"></textarea><br>'
                + '<input type="hidden" name="_csrf" value="' + myToken + '">'
                + '<input type="hidden" name="timeId" value="' + timeId + '">'
                + '<button class="btn btn-success " type="submit">Update</button>'
                +'</form>');
        }, error: function (err) {
            console.log(err);
        }
    });
    //console.log(time.manualDate);
    // console.log(event.path[1].childNodes[0].nextElementSibling.defaultValue)
    console.log(event.path[1].childNodes[1].defaultValue)
    //console.log(event.path[1].childNodes[1])
};