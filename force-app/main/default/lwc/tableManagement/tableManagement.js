import { LightningElement, wire, track } from 'lwc';
import getTables from '@salesforce/apex/TableController.getTables';
import updateTableStatus from '@salesforce/apex/TableController.updateTableStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex'; // ✅ FIX 1: Import refreshApex

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
    wiredTablesResult; // ✅ FIX 2: Store wired result for refresh

    @wire(getTables)
    wiredTables(result) {
        this.wiredTablesResult = result; // ✅ FIX 3: Keep wired result
        if (result.data) {
            this.tables = result.data;
        } else if (result.error) {
            console.error('Error fetching tables:', result.error);
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
                // ✅ FIX 4: Refresh correct wired result
                return refreshApex(this.wiredTablesResult);
            })
            .catch(error => {
                let errorMsg = 'Unknown error';
                if (error?.body?.message) {
                    errorMsg = error.body.message;
                } else if (error?.message) {
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
