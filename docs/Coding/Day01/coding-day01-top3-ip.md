# Coding Day 01 - Problem 01 <br> 코딩 1일차 - 1번 문제

## Find Top 3 Most Frequent IP Addresses <br> 최다 방문 상위 3개 IP 주소 찾기

### Difficulty <br> 난이도

Easy <br> 쉬움

### Topics <br> 관련 주제

- Dictionary <br> 딕셔너리 자료형
- Counter <br> Counter 빈도 집계
- Top-K <br> Top-K 추출 알고리즘
- Log Parsing <br> 로그 텍스트 파싱

---

## Problem Statement <br> 문제 설명

You are given a log file where each line starts with an IP address. <br> 각 행이 IP 주소로 시작하는 로그 파일이 제공됩니다.

Example: <br> 예시:

```text
10.0.0.1 GET /index.html
10.0.0.2 GET /health
10.0.0.1 POST /login
10.0.0.3 GET /home
10.0.0.1 GET /dashboard
10.0.0.2 GET /metrics
```

Write a Python function that returns the top 3 most frequent IP addresses and their request counts. <br> 가장 빈번하게 나타나는 상위 3개의 IP 주소와 이들의 요청 횟수를 반환하는 파이썬 함수를 작성하세요.

Expected Output: <br> 예상 출력값:

```json
[
 ("10.0.0.1", 3),
 ("10.0.0.2", 2),
 ("10.0.0.3", 1)
]
```

---

## Key Concepts <br> 핵심 개념

- Frequency Counting <br> 발생 빈도 집계 기법
- Counter <br> collections.Counter 객체 활용
- Sorting <br> 딕셔너리 정렬 기준 수립
- Top-K <br> 대용량 데이터의 Top-K 성능 최적화

---

## Expected Solution <br> 추천 모범 답안

Use: <br> 사용 기능:

- collections.Counter <br> collections.Counter 클래스
- Dictionary <br> 기본 딕셔너리 자료형

---

## Follow-up Questions <br> 심화 면접 질문

1. How would you process a 100GB log file? <br> 100GB 크기의 로그 파일을 메모리 초과 없이 처리하려면 어떻게 해야 할까요?
2. How would you return Top 100 IPs? <br> 만약 상위 100개의 IP를 반환해야 한다면 정렬 알고리즘을 어떻게 개선하겠습니까?
3. How would you process streaming logs? <br> 실시간으로 계속 유입되는 스트리밍 로그 상황에서는 어떤 설계를 적용하겠습니까?
4. What is the time complexity? <br> 구현한 솔루션의 시간 복잡도와 공간 복잡도는 어떻게 됩니까?

---

## Learning Goals <br> 학습 목표

□ Counter <br> Counter 객체를 활용한 집계 최적화

□ Dictionary <br> 딕셔너리를 활용한 해시 맵 구조 적응

□ Top-K <br> 정렬을 통한 최상위 항목 추출 구현

□ Log Parsing <br> 문자열 분할 및 텍스트 파일 읽기 기초
