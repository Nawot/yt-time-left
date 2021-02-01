// var tc = document.getElementsByClassName("ytp-time-current")[0].textContent
// var td = document.getElementsByClassName("ytp-time-duration")[0].textContent

var timeDisplay = document.getElementsByClassName("ytp-time-display")[0]
timeLeft = document.getElementsByClassName("ytp-time-left")[0]

if(timeLeft == null)
{
    var elem = document.createElement("span");
    elem.className = "ytp-time-left"
    elem.textContent = " (0:00)"

    var timeLeft = timeDisplay.appendChild(elem);
}

var player = document.getElementById('movie_player').wrappedJSObject

let timerId = setInterval(() => setTimeLeft(), 1000/30);

function secondToStr(s)
{
    let min = parseInt(s/60)
    let sec = s%60
    if (sec/10 < 1){sec = "0" + sec}
    return min + ":" + sec
}

function setTimeLeft()
{
    timeLeft.textContent = " " + "(" + secondToStr(parseInt((parseInt(player.getDuration()) - parseInt(player.getCurrentTime())) / player.getPlaybackRate())) + ")"
}