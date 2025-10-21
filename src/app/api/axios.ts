// src/app/api/axios.ts
// Axios 인스턴스
// - 역할: ToDo 백엔드(origin)로 HTTP 요청 전송
// - 주의: baseURL이 외부 도메인이면 브라우저에서 CORS가 발생할 수 있다.
//   - Vercel/Next 프록시(/api/* 라우트 또는 rewrites)로 우회하려면
//     -> baseURL을 '/api' 같은 동일 출처 경로로 바꾸고,
//     -> 래퍼에서 경로를 '/:tenant/items' 형태로 사용한다.
//   - 지금 설정은 외부로 직접 호출(https://assignment-todolist-api.vercel.app).

import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_TODO_API_ORIGIN ??
  'https://assignment-todolist-api.vercel.app'; // 기본 외부 API origin

const instance = axios.create({
  baseURL: API_URL, // 모든 요청의 기본 origin. 예) `${API_URL}/api/...`
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
// - 공통 헤더 추가, 토큰 첨부, 로깅 등을 여기에 확장 가능
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
// - 성공 응답은 그대로 통과
// - 오류 응답은 message/status를 정규화해 throw
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    // 서버가 응답을 반환한 경우(4xx/5xx)
    if (error.response) {
      console.error('error.response', error.response.data);
      return Promise.reject({
        message: error.response?.data.message,
        status: error.response?.status,
      });
    }

    // 요청을 보냈으나 응답을 받지 못한 경우(네트워크, CORS 등)
    if (error.request) {
      console.error('error.request', error.request);
      return Promise.reject({ message: error.request?.responseText });
    }

    // 그 외 설정/코드 오류
    console.error('error', error.message);
    return Promise.reject(error);
  }
);

export default instance;
