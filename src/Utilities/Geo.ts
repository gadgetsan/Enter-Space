/**
 * Geo
 */
class Geo {
    static degToRad(deg: number){
        return deg * Math.PI / 180
    }
    
    static radToDeg(rad: number){
        return rad * 180 / Math.PI;
    }
}