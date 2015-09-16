var SYSTEM = {
  Components: [],
  AddComponent:function(component){
    this.Components.push(component);
  },
  tick: function(delta){
    //on va juste faire le tick sur tout les composents
    this.Components.forEach(function(component) {
      component.tick(delta);
      //ensuite on affiche l'inventaire
      //component.DisplayInventory();
    });
  }
}