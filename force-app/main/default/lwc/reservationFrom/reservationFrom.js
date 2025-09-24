import { LightningElement, track } from 'lwc';
import getAvailableTables from '@salesforce/apex/TableController.getAvailableTables';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ReservationFrom extends  NavigationMixin(LightningElement) {
    @track availableTables = [];
    @track selectedTable = '';

    connectedCallback(){
        this.fetchTables();
    }

    fetchTables(){
         getAvailableTables()
         .then(data => {
            this.availableTables = data.map(table => {
                console.log('table', table);
                return {
                    label :table.Name,
                    value : table.Id
                };
            });
         })
         .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Error fetching tables',
                variant: 'error'
            }));
         });

    }
    handleTableChange(event){
        this.selectedTable = event.detail.value;
    }
  handleSuccess(event){
       const reservationId = event.detail.id;

       // show success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Reservation created successfully',
                variant: 'success'
            })
        );
        
        
        // Navigate to MenuLwcWrapper with reservationId
       this[NavigationMixin.Navigate]({
    type: 'standard__component',
    attributes: {
        componentName: 'c__menuLwcWrapper'
    },
    state: {
        c__reservationId: reservationId
    }
});

  }
}