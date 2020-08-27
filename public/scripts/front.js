const watch = document.getElementById('watch');

function updateTime () {
    const now = moment().format('MMM Do YYYY, h:mm A');
    watch.textContent = now;
}

setInterval(updateTime, 1000);

updateTime();