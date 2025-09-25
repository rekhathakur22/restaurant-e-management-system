public with sharing class CartOrderController {

    // Fetch all tables which have at least one order 
    @AuraEnabled(cacheable=true)
    public static List<Table__c> getTableWithOrders(){
        return [
            SELECT Id,Name 
            FROM Table__c 
            WHERE Id IN (SELECT Table__c FROM Reservation__c)
        ];
    }

    // Fetch all orders for a given table
   @AuraEnabled(cacheable=true)
public static List<Map<String, Object>> getTableOrders(Id tableId) {
    List<Order_Line_Item__c> items = [
        SELECT Id, Menu_Item__r.Name, Quantity__c, Price__c, Status__c
        FROM Order_Line_Item__c
        WHERE Order__r.Reservation__r.Table__c = :tableId
    ];
    
    List<Map<String, Object>> results = new List<Map<String, Object>>();
    for (Order_Line_Item__c item : items) {
        results.add(new Map<String, Object>{
            'Id' => item.Id,
            'Menu_Item_Name' => item.Menu_Item__r != null ? item.Menu_Item__r.Name : '',
            'Quantity__c' => item.Quantity__c,
            'Price__c' => item.Price__c,
            'Status__c' => item.Status__c
        });
    }
    return results;
}


}