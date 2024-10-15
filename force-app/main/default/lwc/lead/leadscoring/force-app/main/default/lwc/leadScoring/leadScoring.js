import { LightningElement, track } from 'lwc';

export default class LeadScoring extends LightningElement {
    @track currentSales = '';             // 주류 판매 여부
    @track mostSellingCategory = '';       // 가장 많이 판매하는 주류 카테고리
    @track supplierSatisfaction = '';      // 공급업체 거래 만족도
    @track supplierChangeInterest = '';    // 공급업체 변경 의향
    @track newProductFactors = '';         // 신제품 도입 시 고려 요소
    @track totalScore = 0;                 // 총 점수

    // 점수 계산 메서드
    calculateScore() {
        // 각 질문에 대한 점수 매핑
        const scoreMapping = {
            'currentSales': {
                '주류 판매중': 5,
                '주류 판매 계획 있음': 3,
                '주류 판매 계획 없음': 0
            },
            'mostSellingCategory': {
                '맥주': 5,
                '소주': 4,
                '와인': 3,
                '위스키': 2,
                '기타': 1
            },
            'supplierSatisfaction': {
                '매우 불만족': 0,
                '불만족': 1,
                '보통': 2,
                '만족': 3,
                '매우 만족': 4
            },
            'supplierChangeInterest': {
                '적극적으로 고려중': 5,
                '고려할 수 없음': 2,
                '아직 계획 없음': 0
            },
            'newProductFactors': {
                '가격': 4,
                '품질': 5,
                '브랜드인지도': 3,
                '고객 수요': 4,
                '기타': 2
            }
        };

        // 사용자 입력을 가져오기
        const currentSalesResponse = this.currentSales; // 주류 판매 여부
        const mostSellingCategoryResponse = this.mostSellingCategory; // 가장 많이 판매하는 주류 카테고리
        const supplierSatisfactionResponse = this.supplierSatisfaction; // 공급업체 거래 만족도
        const supplierChangeInterestResponse = this.supplierChangeInterest; // 공급업체 변경 의향
        const newProductFactorsResponse = this.newProductFactors; // 신제품 도입 시 고려 요소

        // 점수 계산
        let totalScore = 0;
        totalScore += scoreMapping['currentSales'][currentSalesResponse] || 0;
        totalScore += scoreMapping['mostSellingCategory'][mostSellingCategoryResponse] || 0;
        totalScore += scoreMapping['supplierSatisfaction'][supplierSatisfactionResponse] || 0;
        totalScore += scoreMapping['supplierChangeInterest'][supplierChangeInterestResponse] || 0;
        totalScore += scoreMapping['newProductFactors'][newProductFactorsResponse] || 0;

        this.totalScore = totalScore; // 총 점수 업데이트
    }

    // 각 입력 필드의 변경 이벤트 핸들러
    handleCurrentSalesChange(event) {
        this.currentSales = event.target.value;
    }

    handleMostSellingCategoryChange(event) {
        this.mostSellingCategory = event.target.value;
    }

    handleSupplierSatisfactionChange(event) {
        this.supplierSatisfaction = event.target.value;
    }

    handleSupplierChangeInterestChange(event) {
        this.supplierChangeInterest = event.target.value;
    }

    handleNewProductFactorsChange(event) {
        this.newProductFactors = event.target.value;
    }
}
