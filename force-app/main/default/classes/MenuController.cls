public with sharing class MenuController {
    @AuraEnabled(cacheable=true)
    public static List<Menu_Item__c> getMenuItem() {
      return [
        SELECT Id, Name, Price__c, Description__c,Category__c,Availability__c 
        FROM Menu_Item__c 
        ORDER BY Category__c, Name
      ];
    }
}