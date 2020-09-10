const clock = document.getElementById('clock');

function updateTime () {
    const now = moment();
    const humanReadable = now.format('hh:mm:ss A');
    clock.textContent = humanReadable;
}

setInterval(updateTime, 1000); //Update every second

updateTime();