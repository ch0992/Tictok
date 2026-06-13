# Coding Day 03 - Problem 03 <br> 코딩 3일차 - 3번 문제

## Aggregate Metrics From JSON Logs <br> JSON 로그 데이터 기반 시스템 메트릭 지표 집계

### Difficulty <br> 난이도

Medium <br> 보통

### Topics <br> 관련 주제

- JSON Parsing <br> JSON 문자열 파싱
- Aggregation <br> 다차원 데이터 집계
- Data Processing <br> 대규모 데이터 파이프라인 가공

---

## Problem Statement <br> 문제 설명

Given JSON log entries: <br> 다음과 같은 형식의 JSON 로그 항목들이 스트림 형태로 주어집니다.

Example: <br> 예시:

```json
{
  "service": "api",
  "status": 200,
  "latency": 120
}

{
  "service": "api",
  "status": 500,
  "latency": 350
}

{
  "service": "auth",
  "status": 200,
  "latency": 90
}
```

Calculate: <br> 다음 요건에 맞춰 메트릭 정보를 연산해 결과를 반환하세요.

1. Request count by service <br> 서비스별 총 요청 횟수
2. Average latency by service <br> 서비스별 평균 응답 지연 시간 (latency)
3. Error count (status >= 500) <br> HTTP 상태 코드가 500 이상인 에러 개수

Expected Output: <br> 예상 출력값:

```json
{
  "api": {
    "requests": 2,
    "avg_latency": 235,
    "errors": 1
  },
  "auth": {
    "requests": 1,
    "avg_latency": 90,
    "errors": 0
  }
}
```

---

## Key Concepts <br> 핵심 개념

- JSON <br> 파이썬 내장 json 라이브러리 사용법
- Aggregation <br> 중첩 딕셔너리 데이터 구조의 초기화 및 누적
- Metrics Processing <br> 모니터링 시스템의 핵심 통계 지표 처리 기법

---

## Expected Solution <br> 추천 모범 답안

Use: <br> 사용 기능:

- json.loads() <br> json.loads() 메서드를 활용한 딕셔너리 역직렬화
- Dictionary Aggregation <br> 다중 뎁스 해시 맵 누적 구조 설계
- Running Average <br> 실시간 유입 상황에서 저메모리 평균 연산법

---

## Follow-up Questions <br> 심화 면접 질문

1. How would you process millions of records? <br> 수백만 개의 로그 데이터가 들어올 때 메모리 누수를 피하기 위해 generator를 어떻게 활용하겠습니까?
2. How would you handle missing fields? <br> 일부 JSON 객체에 `latency`나 `status` 같은 필수 필드가 누락되었을 때의 대처 기법(get, 예외 처리)은 무엇입니까?
3. How would you parallelize processing? <br> CPU 멀티코어 환경을 활용해 로그 파싱 연산을 병렬로 처리하려면 어떻게 코드를 확장해야 합니까?
4. How would you store aggregated results? <br> 집계된 결과 데이터를 시계열 DB(Prometheus, InfluxDB)나 관계형 DB에 적재하는 일반적인 프로덕션 파이프라인 구성 방식은?

---

## Learning Goals <br> 학습 목표

□ JSON Parsing <br> json.loads() 및 json.JSONDecodeError 예외 핸들링

□ Metrics Aggregation <br> 중첩 오브젝트 데이터 모델 구성 및 실시간 누적

□ Production Monitoring Concepts <br> 실무에서 가장 빈번히 집계하는 평균 레이턴시 및 에러율 계산 원리

□ Data Processing <br> 복잡한 로그 데이터를 정제하여 정보 데이터로 전환하는 분석 능력
