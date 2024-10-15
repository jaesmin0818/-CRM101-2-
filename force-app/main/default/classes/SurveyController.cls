public without sharing class SurveyController {
    @AuraEnabled
    public static void submitSurvey(String leadId, String question1, String question2, String question3, String question4, String question5, Integer totalScore) {
        // Lead ID 유효성 검사
        if (String.isEmpty(leadId)) {
            throw new AuraHandledException('Lead ID가 제공되지 않았습니다.');
        }

        // 디버그: URL에서 받은 leadId 확인
        System.debug('Lead ID: ' + leadId);

        // 설문 데이터 저장
        LeadSurvey__c survey = new LeadSurvey__c();
        survey.Name = '박람회 수집 건';
        survey.leadId__c = leadId; // 필드 이름에 맞게 수정
        survey.Question1__c = question1;
        survey.Question2__c = question2;
        survey.Question3__c = question3;
        survey.Question4__c = question4;
        survey.Question5__c = question5;
        survey.Total_Score__c = totalScore;

        try {
            insert survey;
        } catch (DmlException e) {
            throw new AuraHandledException('설문 저장 중 오류가 발생했습니다: ' + e.getMessage());
        }

        // Lead의 Total Score 업데이트
        try {
            Lead leadToUpdate = [SELECT Id, Total_Score__c FROM Lead WHERE Id = :leadId LIMIT 1];
            leadToUpdate.Total_Score__c = totalScore; // Lead의 Total Score를 업데이트
            update leadToUpdate; // Lead 객체를 데이터베이스에 업데이트
        } catch (QueryException e) {
            System.debug('리드를 찾을 수 없습니다: ' + e.getMessage());
            throw new AuraHandledException('리드를 찾을 수 없습니다.');
        }
    }
}