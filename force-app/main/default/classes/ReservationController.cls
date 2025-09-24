public with sharing class ReservationController {
    @AuraEnabled
    public static Id createReservation(Id customerId, Number noOfGuests, Date reservationDate , Time reservationTime , Id tableId) {

        Reservation__c Res = new Reservation__C(
             Customer__c = customerId,
             Number_of_Guests__c = noOfGuests,
             Reservation_Date__C = reservationDate,
             Reservation_Time__c = reservationTime,
             Table__c = tableId
        );

        insert Res;
        return Res.Id;
    }
}