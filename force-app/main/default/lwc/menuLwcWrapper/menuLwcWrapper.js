import { LightningElement ,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {wire} from 'lwc';



export default class MenuLwcWrapper extends LightningElement {
 @track reservationId;
 
  @wire(CurrentPageReference)
getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.reservationId = currentPageReference.state.c__reservationId;
        }
    }
}