public with sharing class TableController {
    @AuraEnabled(cacheable=true)
    public static List<Table__c> getTables() {
        return [SELECT Id, Name, Table_Status__c FROM Table__c ORDER BY Name];
    }

    @AuraEnabled
    public static void updateTableStatus(Id tableId, String status) {
        Table__c tbl = [SELECT Id, Table_Status__c FROM Table__c WHERE Id = :tableId LIMIT 1];
        tbl.Table_Status__c = status;
        update tbl;
    }

    @AuraEnabled 
    public static List<Table__c> getAvailableTables(){
        return [SELECT Id,Name,Seating_Capacity__c,Table_Status__c 
        FROM Table__c
        WHERE Table_Status__c = 'Available'];
    }
}
