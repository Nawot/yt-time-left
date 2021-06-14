function init()
{
    var timeDisplay = document.getElementsByClassName('ytp-time-display')[0]
        timeLeft    = document.getElementsByClassName('ytp-time-left')[0]
        player      = document.getElementById('movie_player').wrappedJSObject
        time        = new Time({})

    if(timeLeft == null)
    {
        let elem = document.createElement('span')
        elem.className = 'ytp-time-left'
        elem.textContent = ' (0:00)'

        timeLeft = timeDisplay.appendChild(elem)
    }
}

function calculateTimeLeft()
{
    return (player.getDuration() - player.getCurrentTime()) / player.getPlaybackRate()
}

function setTimeLeft(sec)
{
    time.restart({seconds: sec})
    let hours   = (time.getHours()   < 10) ? '0' + time.getHours()   : time.getHours()
        minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes()
        seconds = (time.getSeconds() < 10) ? '0' + time.getSeconds() : time.getSeconds()
    if(time.getHours() < 1) {timeLeft.textContent = ` (${minutes}:${seconds})`}
    else {timeLeft.textContent = ` (${hours}:${minutes}:${seconds})`}
}

class Time
{
    constructor(params)
    {
        this.seconds      = params.hasOwnProperty('seconds') ? 
                            params.seconds : 0
        this.minutes      = params.hasOwnProperty('minutes') ? 
                            params.minutes : 0
        this.hours        = params.hasOwnProperty('hours') ? 
                            params.hours : 0

        this.timeConversion()
    }

    restart(params)
    {
        this.seconds      = params.hasOwnProperty('seconds') ? 
                            params.seconds : 0
        this.minutes      = params.hasOwnProperty('minutes') ? 
                            params.minutes : 0
        this.hours        = params.hasOwnProperty('hours') ? 
                            params.hours : 0

        this.timeConversion()
    }

    timeConversion()
    {
        this.seconds = ((this.seconds - this.seconds % 1) / 1)
        if(this.seconds > 60)
        {
            this.minutes = (this.seconds - this.seconds % 60) / 60
            this.seconds = this.seconds % 60
        }
        if(this.minutes > 60)
        {
            this.hours = (this.minutes - this.minutes % 60) / 60
            this.minutes = this.minutes % 60
        }
    }

    getSeconds() {return this.seconds}
    getMinutes() {return this.minutes}
    getHours()   {return this.hours}
}

function tick()
{
    setTimeLeft(calculateTimeLeft())
    window.requestAnimationFrame(tick)
}

init()
tick()
