class Utils{
    static getClassName(object: Object){        
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((object).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }
    
    static colorToNumber(color: Uint8Array){
        var num = color[0] + 255*color[1] + 255*255*color[2];
        return num;
    }
    
    static numberToColor(value: number){
        var color0 = value%255;
        var color1 = (value-color0)%(255*255);
        var color2 = (value-color1-color0)%(255*255*255);
        return [color0/255.0, color1/255.0, color2/255.0]
    }
}