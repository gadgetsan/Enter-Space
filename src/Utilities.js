var DEBUG = false;
var PROFILING = 50;

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function dot(v1, v2){
    return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
}

function distance(p1, p2){
    return Math.sqrt((p2[0]-p1[0])*(p2[0]-p1[0])+(p2[1]-p1[1])*(p2[1]-p1[1])+(p2[2]-p1[2])*(p2[2]-p1[2]));
}

function mult(v, s){
    return [v[0]*s, v[1]*s, v[2]*s];
}

function add(v1, v2){
    return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
}

function distancePointToSegment(p, s1, s2){
    var v = [s2[0]-s1[0], s2[1]-s1[1], s2[2]-s1[2]];
    var w = [p[0]-s1[0], p[1]-s1[1], p[2]-s1[2]];

    c1 = dot(w, v);
    if(c1<=0){
        return distance(p, s1);
    }

    var c2 = dot(v,v)
    if(c2<=c1){
        return distance(p, s2)
    }

    var b = c1/c2;
    var Pb = add(s1, mult(v, b));
    return distance(p, Pb);

}

var Profiler = function(){
    var self = this;
    var startTime = new Date().getTime();
    this.lastTime = startTime
    self.display = function(text){
        if(!PROFILING){return;}
        var time = new Date().getTime();
        if((time - self.lastTime) > PROFILING){
            console.log((time - self.lastTime) + "ms - " + text);
        }
        self.lastTime = time;
    }

}
