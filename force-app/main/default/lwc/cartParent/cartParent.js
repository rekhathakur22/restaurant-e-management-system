import { LightningElement, wire, track } from 'lwc';
import getTableWithOrders from '@salesforce/apex/CartOrderController.getTableWithOrders';

export default class CartParent extends LightningElement {
    @track tables;
    @track selectedTableId;

    @wire(getTableWithOrders)
    wiredTables({ data, error }) {
        if (data) {
            this.tables = data;
            console.log('Tables fetched: ', JSON.stringify(this.tables));
        } else if (error) {
            console.error('Error fetching tables: ', error);
        }
    }

    handleTableClick(event) {
        this.selectedTableId = event.currentTarget.dataset.id;
        console.log('Selected Table Id: ', this.selectedTableId);
    }
}
