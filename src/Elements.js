var OreNamesGenerator = [
  ["Ri", "Ro", "Za", "Zo", "Nep", "Ma", "Zi", "Ro", "Ka", "Mi", "Khi"],
  ["klaz", "graz", "triz", "zic", "d", "lach", "fuz", "nok", "foc"]
  ]
var ORES = [];
ORESCount = 10;

var ElementNamesGenerator = [
  ["Flu", "Bi", "Ni", "Be", "Sel", "Fel", "Nu", "Mo", "Me", "He", "Io", "Za"],
  ["bec", "fer", "mec", "flo", "chi", "zo", "rekt", "zu"]
  ]
var ELEMENTS = [];
ELEMENTSCount = 20;

var COMPRESSEDELEMENTS = [];
var ENRICHEDELEMENTS = [];

ALLELEMENTS = [];

var WORLDELEMENTS = {
  GenerateNames: function(){
    //-----ORES-----
    for(var i=0; i < ORESCount; i++){
      part1Index = Math.floor(Math.random() * OreNamesGenerator[0].length);  
      part2Index = Math.floor(Math.random() * OreNamesGenerator[1].length); 
      var name = OreNamesGenerator[0][part1Index] + OreNamesGenerator[1][part2Index] + "ite";
      if(!ORES.contains(name)){
        ORES.push(name);
      }else{
        i--;
      }
    }
    
    //-----ELEMENTS-----
    for(var i=0; i < ELEMENTSCount; i++){
      part1Index = Math.floor(Math.random() * ElementNamesGenerator[0].length);  
      part2Index = Math.floor(Math.random() * ElementNamesGenerator[1].length); 
      var name = ElementNamesGenerator[0][part1Index] + ElementNamesGenerator[1][part2Index] + "ium";
      if(!ELEMENTS.contains(name)){
        ELEMENTS.push(name);
      }else{
        i--;
      }
    }
    ALLELEMENTS = ORES.concat(ELEMENTS);
    
    //-----COMPRESSED ELEMENTS-----
    for(var i=0; i < ELEMENTSCount; i++){
      COMPRESSEDELEMENTS.push("Compressed " + ELEMENTS[i]);
    }
    ALLELEMENTS = ALLELEMENTS.concat(COMPRESSEDELEMENTS);
    
    
    //-----ENRICHED ELEMENTS-----
    for(var i=0; i < ELEMENTSCount; i++){
      COMPRESSEDELEMENTS.push("Compressed " + ELEMENTS[i]);
    }
    ALLELEMENTS = ALLELEMENTS.concat(COMPRESSEDELEMENTS);
  }
};