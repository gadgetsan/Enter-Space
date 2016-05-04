/**
 * UpdateRequestSubscriber
 * 
 * Un Interface permettant aux objets de recevoir les demande de mise-à-jour
 */
interface UpdateRequestSubscriber extends Subscriber{
    update(dt: number);
}