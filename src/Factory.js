var FACTORY = {

  Base: function(){
    var self = this;
    this.DisplayInventory= function(){
      if(self.inventory == null){
        console.log("NO INVENTORY");
      }else{
        console.log(self.inventory);
      }
    };
    this.tick = function(delta){}
  },

  Retriever: function(location){
    FACTORY.Base.call(this);
    var range = 10;
    var self = this;

    this.frequency = 1;   //frequence en Hz
    this.inventory = []; //l'inventaire du retriever
    this.strength = 5;
    this.number = Math.floor((Math.random() * 10000) + 1);

    var timeSinceLastCycle = 0; // le temps (en ms) écoulé depuis le dernier cycle
    this.inventory[deposit.type] = 0;

    this.tick = function(delta){
      timeSinceLastCycle += delta;
      if(timeSinceLastCycle - self.frequency > 0 && deposit.size >= self.strength){
        timeSinceLastCycle = timeSinceLastCycle % self.frequency;
        self.inventory[deposit.type] += deposit.density * self.strength;
        deposit.size -= self.strength;
        //console.log("I now have " + self.inventory[deposit.type] + "u of item " + deposit.type + " and the size of the deposit is still " + deposit.size);
        //console.log("RETRIEVER #" + self.number + " +" + (deposit.density * self.strength) + " of " + deposit.type);
      }

    };
  },

  //TODO: Implementer des filtres
  Pipe: function(src, dst, type){
    FACTORY.Base.call(this);
    var self = this;

    this.frequency = 1; // la fréquence en Hz
    this.strength = 10; //le nombre d'items qui seront transportés à la fois

    this.number = Math.floor((Math.random() * 10000) + 1);
    var timeSinceLastCycle = 0; // le temps (en ms) écoulé depuis le dernier cycle

    this.tick = function(delta){
      timeSinceLastCycle += delta;
      if(timeSinceLastCycle - self.frequency > 0 && ((type == -1) || (src.inventory[type] != 'undefined' && src.inventory[type] > 0) )){
        timeSinceLastCycle = timeSinceLastCycle % self.frequency;
        var qtToTransfer = this.strength;
        var actualType = type;
        if(type == -1){
          //on va trouver le premier type que l'on peut transférer
          for (var i=0; i<ALLELEMENTS.length; i++) {
            if(src.inventory[i] != undefined && src.inventory[i] > 0){
              actualType = i;
              break;
            }
          }
          if(actualType == -1){return};
        }
        if(src.inventory[actualType] < self.strength){
          qtToTransfer = src.inventory[actualType];
        }
        src.inventory[actualType] -= qtToTransfer;
        if(dst.inventory[actualType] == null){
          dst.inventory[actualType] = 0;
        }
        dst.inventory[actualType] += qtToTransfer;
        //console.log("I now have " + self.inventory[deposit.type] + "u of item " + deposit.type + " and the size of the deposit is still " + deposit.size);
        //console.log("PIPE #" + self.number + " Deposited " + qtToTransfer + "u of " + actualType);
      }

    };

  },

  Container: function(){
    FACTORY.Base.call(this);
    var self = this;
    this.inventory = []; //l'inventaire du retriever
  },

  Refinery: function(){
    FACTORY.Base.call(this);
    var self = this;

    this.frequency = 1;   //frequence en Hz
    this.inventory = []; //l'inventaire du retriever
    this.strength = 2;
    this.number = Math.floor((Math.random() * 10000) + 1);

    this.efficiency = 1;

    var timeSinceLastCycle = 0; // le temps (en ms) écoulé depuis le dernier cycle

    this.tick = function(delta){
      timeSinceLastCycle += delta;
      if(timeSinceLastCycle - self.frequency > 0){
        for (var i=0; i<ORES.length; i++) {
          if(self.inventory[i] != undefined && self.inventory[i] > 0){
            //console.log(i + ": " + self.inventory[i]);
            var ammount = self.strength;
            if(self.inventory[i] < self.strength){ammount = self.inventory[i]};
            self.inventory[i] -= ammount;
            refinedElementIndex = ORES.length+(i)*2;
            var generatedQt = 4;
            for(var j=0; j<generatedQt; j++){
              index = refinedElementIndex + j;
              if(self.inventory[index] == undefined){
                self.inventory[index] = 0;
              }
              self.inventory[index] += (generatedQt - j) * ammount * self.efficiency
            }
            //console.dir(self.inventory);
            break;
          }
        }
      }
      timeSinceLastCycle = timeSinceLastCycle % self.frequency;
    };

  }


};
