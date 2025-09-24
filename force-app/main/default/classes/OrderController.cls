public with sharing class OrderController {
    public class OrderItemWrapper{
        @AuraEnabled public Id menuItemId{get; set;}
        @AuraEnabled public Integer quantity{get; set;}
        @AuraEnabled public Decimal price{get; set;}

    }

    @AuraEnabled
    public static Id createOrder(Id reservationId, List<OrderItemWrapper> items) {
         Order__c order = new Order__c(
            Reservation__c = reservationId,
            Order_Status__c = 'New'
         );

         insert order;

         List<Order_Line_Item__C> orderItems = new List<Order_Line_Item__c>();

         for(OrderItemWrapper i:items){
            orderItems.add(new Order_Line_Item__c(
                Order__c = order.Id,
                Menu_Item__c = i.menuItemId,
                Quantity__c = i.quantity,
                Price__c = i.price
            ));
         }

         insert orderItems;
         return order.Id;
    }
}