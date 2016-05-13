/**
 * PlayerMovedSubscriber
 * 
 * Un interface permettant à un objet de repondre aux evenements de PlayerMOved
 */
interface PlayerMovedSubscriber extends Subscriber {    
    playerMoved(player: Player);
}