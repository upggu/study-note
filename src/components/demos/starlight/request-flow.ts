import type { LearningFlow } from '../../docs/learning-flow';

export const requestFlow = {
  title: '요청을 보낸 뒤 응답이 도착하기까지',
  terms: [
    { id: 'html', name: 'HTML', description: 'HyperText Markup Language. 브라우저가 페이지를 구성할 때 읽는 문서 형식.' },
  ],
  objects: [
    { id: 'browser', label: '브라우저', role: '페이지를 요청하고 응답을 받는다.' },
    { id: 'server', label: '서버', role: '요청한 페이지의 문서를 반환한다.' },
  ],
  steps: [
    {
      id: 'request',
      title: '페이지 요청',
      description: '서버가 요청을 받았지만 브라우저는 아직 문서를 받지 않았다.',
      message: {
        from: 'browser', to: 'server', kind: '요청',
        label: '페이지 조회', values: ['GET /guide'],
      },
      storage: {
        browser: '요청 주소를 알고 응답을 기다림. 문서 없음.',
        server: '요청 경로와 반환할 문서 보유.',
      },
      storageSummary: {
        browser: '응답 대기 / 문서 없음',
        server: '요청 경로 / 원본 문서',
      },
    },
    {
      id: 'response',
      title: '문서 응답',
      description: '서버가 보낸 문서가 브라우저에 도착했다. 서버의 원본은 그대로 남는다.',
      message: {
        from: 'server', to: 'browser', kind: '응답',
        label: '문서 반환', values: ['HTML'],
      },
      storage: {
        browser: '응답 문서 수신. 페이지 구성에 사용 가능.',
        server: '원본 문서 보유.',
      },
      storageSummary: {
        browser: '응답 문서 수신',
        server: '원본 문서 유지',
      },
    },
  ],
} satisfies LearningFlow;
