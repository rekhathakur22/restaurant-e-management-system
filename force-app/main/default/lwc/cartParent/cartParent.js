
import { LightningElement, wire, track } from 'lwc';
import getTableWithOrders from '@salesforce/apex/CartOrderController.getTableWithOrders';

export default class CartParent extends LightningElement {
        @track tables;
         @track selectedTableId;
          @wire(getTableWithOrders)
          wiredTables({ data, error }) {
           if (data) {
            this.tables = data;
           }
          }
           handleTableClick(event) {
               this.selectedTableId = event.currentTarget.dataset.id;
             }


}