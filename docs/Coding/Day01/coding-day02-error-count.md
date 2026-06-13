# Coding Day 02 - Problem 02 <br> 코딩 2일차 - 2번 문제

## Count ERROR Logs By Service <br> 서비스별 ERROR 로그 발생 횟수 집계

### Difficulty <br> 난이도

Easy <br> 쉬움

### Topics <br> 관련 주제

- Dictionary <br> 딕셔너리 자료구조
- defaultdict <br> defaultdict 초기화 생략 기법
- Log Aggregation <br> 로그 정보 데이터 집계

---

## Problem Statement <br> 문제 설명

Given application logs in the following format: <br> 다음과 같은 형식의 애플리케이션 로그가 제공됩니다.

Example: <br> 예시:

```text
auth ERROR login failed
auth ERROR token expired
api ERROR timeout
api ERROR timeout
api INFO request completed
worker ERROR connection lost
```

Count the number of ERROR messages for each service. <br> 각 서비스별(auth, api, worker 등)로 발생한 ERROR 수준의 메시지 횟수를 집계하세요. (INFO 등 다른 레벨은 무시합니다.)

Expected Output: <br> 예상 출력값:

```json
{
  "auth": 2,
  "api": 2,
  "worker": 1
}
```

---

## Key Concepts <br> 핵심 개념

- Aggregation <br> 키-값 그룹 데이터 누적 집계
- defaultdict <br> collections.defaultdict를 이용한 방어적 딕셔너리 기법
- Log Analysis <br> 텍스트 필터링 및 구문 분석 기본기

---

## Expected Solution <br> 추천 모범 답안

Use: <br> 사용 기능:

- defaultdict(int) <br> collections.defaultdict(int) 생성자
- Dictionary Aggregation <br> 기본 해시 맵 누적 연산

---

## Follow-up Questions <br> 심화 면접 질문

1. How would you return the top service by error count? <br> 에러 건수가 가장 높은 최상위 서비스만 추출하려면 코드를 어떻게 수정하시겠습니까?
2. How would you aggregate logs across multiple servers? <br> 여러 대의 독립된 서버에서 생성되는 로그들을 통합 집계하는 대규모 아키텍처는 어떻게 설계합니까?
3. How would you handle malformed log lines? <br> 일부 행에 데이터 유실이나 포맷 깨짐 현상(Malformed)이 섞여 있을 때의 예외 방어책은 무엇입니까?
4. How would you process logs in real-time? <br> 로그 파일이 실시간 파일 스트림이나 카프카(Kafka)로 들어올 때 메모리 효율을 고려한 파이썬 구현은 무엇입니까?

---

## Learning Goals <br> 학습 목표

□ defaultdict <br> defaultdict(int)를 활용해 불필요한 키 검사 코드 제거

□ Aggregation <br> 대용량 데이터에서 특정 카테고리별 합산 흐름 습득

□ Error Analysis <br> ERROR 등 특정 스트링 키워드 조건문 필터링 실습

□ Production Log Processing <br> 실무 환경 로그 파싱 인터페이스 구성 능력 배양
