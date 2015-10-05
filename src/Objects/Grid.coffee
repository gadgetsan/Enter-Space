#Une Grille contiens est en fait un Object en 3 dimension qui peut avoir plusieurs
#Degrés de details dependant de la distance à la camera
class Grid extends GameObject
    constructor: () ->
        super()
        #on n'as pas le choix si on veut que ses enfants s'affichent
        @Renderable = new Renderable()

        @Children.push(new Cell())

    CameraMoved: (move, Camera) =>
        for child in @Children
            child.CameraMoved(move, Camera)
