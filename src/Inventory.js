var InventoriesManager = function(){
    var self = this;

    self.inventories = [];


    this.Add = function(inventory){
        self.inventories[inventory.identifier] = inventory;
    }

    this.MoveItem = function(sourceInv, destInv, sourceIndex, destIndex){
        if(self.inventories[destInv].addItem(self.inventories[sourceInv].items[sourceIndex].type, self.inventories[sourceInv].items[sourceIndex].quantity, destIndex)){
            self.inventories[sourceInv].removeItem(sourceIndex);
        }
    }

    return this;
}



var Inventory = function(size, id){
    var self = this;
    this.size = size;
    this.items = [];
    self.identifier = id;
    $('#'+ self.identifier).height((Math.floor(size/8)*34));
    for(var i=0;i<this.size;i++){
        $('#'+ self.identifier).append("<li class='receivable'><div id='"+ self.identifier + "-" + i + "'></div></li>")
    }
    this.addItem = function(type, quantity, index){
        if(!(index < self.size)){
            console.log("cet inventaire comprend "+ self.size + " items");
            return false;
        }else if($('#'+ self.identifier + '-' + index).children().length == 0){
            console.log('#'+ self.identifier + '-' + index);
            $('#'+ self.identifier + '-' + index).append("<div class='moveable' id='"+ self.identifier + "-item-"+ index +"'><img class='item' src='imgs/"+ type +".png'/><span class='quantity'>" + quantity + "</div>")
            this.items[index] = {
                type: type,
                quantity: quantity
            };
            console.log(this.items);
            return true;
        }else if(this.items[index].type == type){
            this.items[index].quantity += quantity;
            $('#'+ self.identifier + '-' + index).empty();
            $('#'+ self.identifier + '-' + index).append("<div class='moveable' id='"+ self.identifier + "-item-"+ index +"'><img class='item' src='imgs/"+ type +".png'/><span class='quantity'>" + this.items[index].quantity + "</div>")
            return true;
        }else{
            console.log("il y a deja un item dans cet emplacement")
            return false;
        }
    }

    this.removeItem = function(index){
        self.items[index] = undefined;
        $('#'+ self.identifier + '-' + index).empty();
    }
    this.moveLeft = function(){
        $('#'+ self.identifier).css('margin-left','-290px');
    }
    this.moveRight = function(){
        $('#'+ self.identifier).css('margin-left','12px');
    }
    this.moveCenter = function(){
        $('#'+ self.identifier).css('margin-left','-136px');
    }
    return this;
}



function itemMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

interact(".moveable").draggable({
    inertia: true,
    onmove:itemMoveListener
})

interact(".receivable").dropzone({
    accept: ".moveable",
    overlap: 0.25,
    ondrop: function(event){
        var newIndex = event.target.children[0].id.split("-")[1];
        var oldIndex = event.relatedTarget.closest("div").id.split("-")[2];
        var newInv = event.target.children[0].id.split("-")[0];
        var oldInv = event.relatedTarget.closest("div").id.split("-")[0];
        invManager.MoveItem(oldInv, newInv, oldIndex, newIndex);
    }
})
