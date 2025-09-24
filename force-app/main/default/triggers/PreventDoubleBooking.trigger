trigger PreventDoubleBooking on Reservation__c (before insert, before update){
  // Collect all Table Ids from the incoming reservations
  Set<Id> tableIds = new Set<Id>();
  for(Reservation__c res: Trigger.new){
    tableIds.add(res.Table__c);
  }

  // Query existing reservations for these tables

  Map<Id,List<Reservation__c>> existingReservations = new Map<Id,List<Reservation__c>>();
  for(Reservation__c r : [SELECT Id, Table__c, Reservation_DateTime__c FROM Reservation__c WHERE Table__c IN :tableIds]){
        if(!existingReservations.containsKey(r.Table__c)) existingReservations.put(r.Table__c, new List<Reservation__c>());
        existingReservations.get(r.Table__c).add(r);
    }

  // Check for double bookings
 for(Reservation__c r : Trigger.new){
        if(existingReservations.containsKey(r.Table__c)){
            for(Reservation__c existing : existingReservations.get(r.Table__c)){
                if(existing.Reservation_DateTime__c == r.Reservation_DateTime__c){
                    r.addError('This table is already booked for the selected date and time.');
                }
            }
        }
    }
}
