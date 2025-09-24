import { LightningElement, api ,track, wire } from 'lwc';
import getMenuItem from '@salesforce/apex/MenuController.getMenuItem';
import addOrderItems from '@salesforce/apex/OrderController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MenuLwc extends LightningElement {
    @api reservationId;
    @track menuItems = [];
    @track cart = [];
    @track groupedMenu = [];

    @wire(getMenuItem)
    wiredMenu({ error, data }) {
        if (data) {
            // Map the data to add the `isUnavailable` property
            this.menuItems = data.map(item => ({
                ...item,
                isUnavailable: item.Availability__c === 'Unavailable'
            }));
            this.groupMenuByCategory();
        } else if (error) {
            console.error(error);
        }
    }

    groupMenuByCategory() {
        const groups = {};
        this.menuItems.forEach(item => {
            if (!groups[item.Category__c]) {
                groups[item.Category__c] = [];
            }
            groups[item.Category__c].push(item);
        });

        this.groupedMenu = Object.keys(groups).map(cat => ({
            category: cat,
            items: groups[cat]
        }));
    }

    get cartTotal() {
        return this.cart.reduce((sum, i) => sum + i.Price__c, 0);
    }

    handleAddToCart(event) {
        const itemId = event.target.dataset.id;
        const item = this.menuItems.find(i => i.Id === itemId);
        if (item) this.cart = [...this.cart, item];
    }

    handleRemoveFromCart(event) {
        const itemId = event.target.dataset.id;
        // Find the first instance to remove it.
        const itemIndex = this.cart.findIndex(i => i.Id === itemId);
        if (itemIndex > -1) {
            const newCart = [...this.cart];
            newCart.splice(itemIndex, 1);
            this.cart = newCart;
        }
    }

    handleSubmitOrder(){
         if (!this.reservationId || this.cart.length === 0) {
        // optional: toast for empty cart
        return;
    }
     const orderItems = this.cart.map(item => ({
        menuItemId: item.Id,
        quantity: item.quantity || 1, // default 1 if not tracked
        price: item.Price__c
    }));
        addOrderItems({ reservationId: this.reservationId, items: orderItems })
        .then(orderId => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Order submitted successfully',
                variant: 'success'
            }));
            this.cart = [];
            // Optionally navigate to order record page
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body?.message || 'Error creating order',
                variant: 'error'
            }));
        });
    }
}