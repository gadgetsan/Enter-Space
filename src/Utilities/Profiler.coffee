class Profiler
    constructor: (@MaxTime)->
        @StartTime = new Date().getTime()
        @LastTime = @StartTime
    display: (text)->
        time = new Date().getTime()
        if((time - @LastTime)> @MaxTime)
            console.log((time - @LastTime) + "ms - " + text)
        @LastTime = time
