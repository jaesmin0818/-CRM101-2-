import { LightningElement } from 'lwc';
import submitSurvey from '@salesforce/apex/SurveyController.submitSurvey';

export default class SurveyForm extends LightningElement {
    // 라디오 버튼 선택지 옵션 정의
    판매여부Options = [
        { label: '주류 판매중', value: '주류 판매중' },
        { label: '주류 판매 계획 있음', value: '주류 판매 계획 있음' },
        { label: '주류 판매 계획 없음', value: '주류 판매 계획 없음' }
    ];

    주류카테고리Options = [
        { label: '맥주', value: '맥주' },
        { label: '소주', value: '소주' },
        { label: '와인', value: '와인' },
        { label: '위스키', value: '위스키' },
        { label: '기타', value: '기타' }
    ];

    공급업체만족도Options = [
        { label: '매우 불만족', value: '매우 불만족' },
        { label: '불만족', value: '불만족' },
        { label: '보통', value: '보통' },
        { label: '만족', value: '만족' },
        { label: '매우 만족', value: '매우 만족' }
    ];

    공급업체변경의향Options = [
        { label: '적극적으로 고려중', value: '적극적으로 고려중' },
        { label: '고려할 수 없음', value: '고려할 수 없음' },
        { label: '아직 계획 없음', value: '아직 계획 없음' }
    ];

    신제품도입요소Options = [
        { label: '가격', value: '가격' },
        { label: '품질', value: '품질' },
        { label: '브랜드인지도', value: '브랜드인지도' },
        { label: '고객 수요', value: '고객 수요' },
        { label: '기타', value: '기타' }
    ];

    // 선택된 값을 저장할 속성들
    question1 = '';
    question2 = '';
    question3 = '';
    question4 = '';
    question5 = '';
    leadId = ''; // Lead ID를 저장할 속성 추가

    connectedCallback() {
        // URL에서 LeadId 파싱
        const urlParams = new URLSearchParams(window.location.search);
        this.leadId = urlParams.get('leadId');
        
        // Lead ID가 유효한지 확인
        if (!this.leadId) {
            console.warn('Lead ID가 URL에서 발견되지 않았습니다.');
        } else {
            console.log('Lead ID:', this.leadId);
        }
    }

    // 입력 값 처리 함수
    handleInputChange(event) {
        const { name, value } = event.target;
        this[name] = value;
    }

    // 점수 계산 함수
    calculateScore() {
        let score = 0;

        // 첫 번째 질문 점수
        if (this.question1 === '주류 판매중') score += 3;
        else if (this.question1 === '주류 판매 계획 있음') score += 2;

        // 두 번째 질문 점수
        if (this.question2 === '맥주') score += 2;
        else if (this.question2 === '소주') score += 2;
        else if (this.question2 === '와인') score += 1;
        else if (this.question2 === '위스키') score += 1;

        // 세 번째 질문 점수')
        if (this.question3 === '매우 불만족') score += 4;
        else if (this.question3 === '불만족') score += 4;
        else if (this.question3 === '보통') score += 2;
        else if (this.question3 === '만족') score += 1;
        else if (this.question3 === '매우 만족') score += 1;

        // 네 번째 질문 점수
        if (this.question4 === '적극적으로 고려중') score += 3;
        else if (this.question4 === '고려할 수 없음') score += 1;

        // 다섯 번째 질문 점수
        if (this.question5 === '가격') score += 3;
        else if (this.question5 === '품질') score += 2;
        else if (this.question5 === '브랜드인지도') score += 1;
        else if (this.question5 === '고객 수요') score += 3;

        return score;
    }

    // 폼 제출 처리 함수
    handleSubmit(event) {
        event.preventDefault();
        const totalScore = this.calculateScore();

        // SurveyController Apex 메서드 호출
        submitSurvey({
            leadId: this.leadId, // Lead ID 전달
            question1: this.question1,
            question2: this.question2,
            question3: this.question3,
            question4: this.question4,
            question5: this.question5,
            totalScore: totalScore
        })
        .then(() => {
            alert('설문이 성공적으로 제출되었습니다.');
            this.resetForm();
        })
        .catch(error => {
            const errorMessage = error.body && error.body.message ? error.body.message : '감사합니다.';
            alert('담당자의 연락 드리겠습니다.: ' + errorMessage);
        });
        
    }

    resetForm() {
        this.leadId = '';
        this.question1 = '';
        this.question2 = '';
        this.question3 = '';
        this.question4 = '';
        this.question5 = '';
    }
}
