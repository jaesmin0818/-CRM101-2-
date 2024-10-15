trigger leadTrigger on Lead (after update) {
  List<Account> accountsToUpdate = new List<Account>();
  List<Opportunity> opportunitiesToUpdate = new List<Opportunity>();

  for (Lead lead : Trigger.new) {
      // 리드가 변환되고 관련된 계정 및 기회가 있을 경우
      if (lead.IsConverted && lead.ConvertedAccountId != null) {
          // 계정 업데이트
          Account accountToUpdate = new Account(Id = lead.ConvertedAccountId);
          accountToUpdate.issue__c = lead.issue__c; // 리드의 Issue__c 값을 계정으로 복사
          accountsToUpdate.add(accountToUpdate);

          // 기회 업데이트
          if (lead.ConvertedOpportunityId != null) {
              Opportunity opportunityToUpdate = new Opportunity(Id = lead.ConvertedOpportunityId);
              opportunityToUpdate.issue__c = lead.issue__c; // 리드의 Issue__c 값을 기회로 복사
              opportunitiesToUpdate.add(opportunityToUpdate);
          }
      }
  }

  // 계정 및 기회 업데이트
  if (!accountsToUpdate.isEmpty()) {
      update accountsToUpdate;
  }
  if (!opportunitiesToUpdate.isEmpty()) {
      update opportunitiesToUpdate;
  }
}
