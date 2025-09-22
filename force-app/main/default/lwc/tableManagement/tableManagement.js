import { LightningElement, wire, track } from 'lwc';
import getTables from '@salesforce/apex/TableController.getTables';
import updateTableStatus from '@salesforce/apex/TableController.updateTableStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Mark as Occupied', name: 'mark_occupied' },
    { label: 'Mark as Available', name: 'mark_available' },
    { label: 'Mark as Reserved', name: 'mark_reserved' },
    { label: 'Mark as Cleaning', name: 'mark_cleaning' }
];

const columns = [
    { label: 'Table Number', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Table_Status__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions }
    }
];

export default class TableManagement extends LightningElement {
    @track tables;
    columns = columns;

    @wire(getTables)
    wiredTables({ error, data }) {
        if (data) {
            this.tables = data;
        } else if (error) {
            console.error('Error fetching tables:', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        let newStatus = '';
        if (actionName === 'mark_occupied') newStatus = 'Occupied';
        else if (actionName === 'mark_available') newStatus = 'Available';
        else if (actionName === 'mark_reserved') newStatus = 'Reserved';
        else if (actionName === 'mark_cleaning') newStatus = 'Cleaning';

        updateTableStatus({ tableId: row.Id, status: newStatus })
    .then(() => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: `Table ${row.Name} updated to ${newStatus}`,
                variant: 'success'
            })
        );
        return refreshApex(this.tables);
    })
    .catch(error => {
        // Safely extract the error message
        let errorMsg = 'Unknown error';
        if (error && error.body && error.body.message) {
            errorMsg = error.body.message;
        } else if (error && error.message) {
            errorMsg = error.message;
        }
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating table',
                message: errorMsg,
                variant: 'error'
            })
        );
    });

    }
}
