// waiterTableOrders.js
import { LightningElement, api, wire, track } from 'lwc';
import getTableOrders from '@salesforce/apex/CartOrderController.getTableOrders';

export default class WaiterTableOrders extends LightningElement {
    @api tableId;
    @track orders;
    @track total = 0;

    // waiterTableOrders.js (add columns)
@track columns = [
    { label: 'Item', fieldName:'Menu_Item_Name' },
    { label: 'Quantity', fieldName: 'Quantity__c' },
    { label: 'Price', fieldName: 'Price__c' },
    { label: 'Status', fieldName: 'Status__c' }
];


    @wire(getTableOrders, { tableId: '$tableId' })
    wiredOrders({ data, error }) {
        if (data) {
            this.orders = data;
            this.total = data.reduce((sum, item) => sum + (item.Quantity__c * item.Price__c), 0);
        }
    }
}
