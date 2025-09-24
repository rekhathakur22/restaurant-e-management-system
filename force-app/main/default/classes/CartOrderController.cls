public with sharing class CartOrderController {

    // Fetch all tables which have at least one order 
    @AuraEnabled(cacheable=true)
    public static List<Table__c> getTableWithOrders(){
        return [
            SELECT Id,Name 
            FROM Table__c 
            WHERE Id IN (SELECT Table__c FROM Order__c)
        ];
    }

    // Fetch all orders for a given table
    @AuraEnabled(cacheable=true)
    public static List<Order_Line_Item__c> getTableOrders(Id tableId){
        return [
           SELECT Id , Menu_Item__c, Quantity__c,Price__c, Status__c,Menu_Item__c
           FROM Order_Line_Item__c 
           WHERE Order__r.Table__c = :tableId
        ];
    }

}