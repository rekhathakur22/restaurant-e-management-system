public with sharing class ReservationController {
    @AuraEnabled
    public static Id createReservation(Id customerId, Integer noOfGuests,Datetime reservationDateTime, Id tableId) {

        Reservation__c Res = new Reservation__C(
             Customer__c = customerId,
             Number_of_Guests__c = noOfGuests,
             Reservation_DateTime__c = reservationDateTime,
             Table__c = tableId
        );

        insert Res;
        return Res.Id;
    }
}