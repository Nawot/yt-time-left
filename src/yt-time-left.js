async function init()
{
    defaultOptions =
    {
        pbr: true,
        sb: true
    }
    options     = {}
    timeDisplay = document.getElementsByClassName('ytp-time-display')[0]
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

    function loadOptions()
    {
        function onError(error)
        {
            console.log(`Error: ${error}`)
        }

        function onGot(items)
        {
            if(items.pbr !== undefined) {options.pbr = items.pbr}
            else {options.pbr = defaultOptions.pbr}

            if(items.sb !== undefined) {options.sb = items.sb}
            else {options.sb = defaultOptions.sb}
        }
        return browser.storage.local.get().then(onGot, onError)
    }
    await loadOptions()
    if(options.sb) {sb = new SB()}
}

function calculateTimeLeft()
{
    let timeLeft
    if(options.sb) {timeLeft = sb.getDuration() - player.getCurrentTime()}
    else {timeLeft = player.getDuration() - player.getCurrentTime()}
    if(options.pbr) {timeLeft /= player.getPlaybackRate()}
    return timeLeft
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

class SB
{
    constructor()
    {
        this._isCreated = false
        this.fakeConstructor()
    }

    async fakeConstructor()
    {
        let server = 'https://sponsor.ajay.app/api/skipSegments/'
        let videoID = player.getVideoData().video_id
        let url = `${server}?videoID=${videoID}`
        let response = await fetch(url)
        response = await response.json()
        this.segments = []
        this.duration = player.getDuration()
        for (let i = 0; i < response.length; i++)
        {
            let segment = {}
            segment.times = response[i].segment
            let timeSegment = response[i].segment[1] - response[i].segment[0]
            segment.timeSegment = timeSegment
            segment.isPassed = false
            this.segments.push(segment)
            this.duration -= timeSegment
        }
        this._isCreated = true
    }

    getDuration()
    {
        if(!this._isCreated) {return player.getDuration()}
        let duration = this.duration
        for (let i = 0; i < this.segments.length; i++)
        {
            let segment = this.segments[i]
            if (player.getCurrentTime() > segment.times[1] - 1)
            {
                if(!segment.isPassed)
                {
                    duration += segment.timeSegment
                    segment.isPassed = true
                }
            }
            else
            {
                if(segment.isPassed)
                {
                    duration -= segment.timeSegment
                    segment.isPassed = false
                }
            }
        }
        this.duration = duration
        return duration
    }
}

function tick(start)
{
    if(player.getPlayerState() == 1 || start === true)
    {
        setTimeLeft(calculateTimeLeft())
    }
    window.requestAnimationFrame(tick)  
}
async function main()
{
    await init()
    tick(true)
}

main()
