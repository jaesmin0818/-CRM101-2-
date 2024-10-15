trigger SurveyResponseScore on Survey_Question_Response__c (after insert) {
  // 설문 응답 처리를 위한 핸들러 클래스 인스턴스 생성
  SurveyResponseHandler handler = new SurveyResponseHandler();
  handler.processSurveyResponses(trigger.new);
}

public class SurveyResponseHandler {
  
  public void processSurveyResponses(List<Survey_Question_Response__c> surveyResponses) {
      Map<Id, Integer> leadScores = new Map<Id, Integer>();

      // 각 설문 응답 처리
      for (Survey_Question_Response__c response : surveyResponses) {
          Integer score = calculateScore(response);
          updateLeadScores(leadScores, response.Lead__c, score);
      }

      // Lead의 총 점수 업데이트
      updateLeadScoresInDB(leadScores);
  }

  private Integer calculateScore(Survey_Question_Response__c response) {
      // 점수를 계산하는 로직
      Integer score = 0;

      // 응답에 따라 점수를 할당
      switch on response.Question_Title__c {
          when '현재 귀하의 사업장에서 주류 판매 여부는 어떻게 됩니까?' {
              score += (response.Response__c == '주류 판매중') ? 10 :
                        (response.Response__c == '주류 판매 계획 있음') ? 5 : 0;
          }
          when '귀하의 사업장에서 가장 많이 판매하는 주류 카테고리는 무엇입니까?' {
              score += (response.Response__c == '맥주') ? 10 :
                        (response.Response__c == '소주') ? 8 :
                        (response.Response__c == '와인') ? 6 : 
                        (response.Response__c == '위스키') ? 4 : 2; // 기타
          }
          when '현재 주류 공급업체와의 거래에 만족하십니까?' {
              score += (response.Response__c == '매우 만족') ? 10 :
                        (response.Response__c == '만족') ? 8 :
                        (response.Response__c == '보통') ? 5 : 
                        (response.Response__c == '불만족') ? 2 : 0; // 매우 불만족
          }
          when '주류 공급업체를 변경하거나 추가 공급업체를 도입할 의향이 있습니까?' {
              score += (response.Response__c == '적극적으로 고려중') ? 10 :
                        (response.Response__c == '고려할 수 없음') ? 0 : 0; // 아직 계획 없음
          }
          when '신제품 도입 시 어떤 요소를 가장 중요하게 고려하십니까?' {
              score += (response.Response__c == '가격') ? 10 :
                        (response.Response__c == '품질') ? 8 :
                        (response.Response__c == '브랜드인지도') ? 6 : 
                        (response.Response__c == '고객 수요') ? 4 : 2; // 기타
          }
      }

      return score;
  }

  private void updateLeadScores(Map<Id, Integer> leadScores, Id leadId, Integer score) {
      if (leadScores.containsKey(leadId)) {
          leadScores.put(leadId, leadScores.get(leadId) + score);
      } else {
          leadScores.put(leadId, score);
      }
  }

  private void updateLeadScoresInDB(Map<Id, Integer> leadScores) {
      List<Lead> leadsToUpdate = new List<Lead>();
      
      for (Id leadId : leadScores.keySet()) {
          Lead leadToUpdate = new Lead(Id = leadId, Total_Score__c = leadScores.get(leadId));
          leadsToUpdate.add(leadToUpdate);
      }
      
      if (!leadsToUpdate.isEmpty()) {
          update leadsToUpdate;
      }
  }
}
