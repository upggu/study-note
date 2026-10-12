import { normalizeBase } from '../utils/site-path.mjs';

// 대표 주소·게시 경로 설정. 빌드와 preview에서 같은 환경 변수 값을 쓴다.
// 배포 전에 site 기본값을 실제 대표 주소로 바꾼다. 하위 경로에 게시하면 base를 '/저장소이름/'처럼 둔다.
export const site = process.env.SITE_URL || 'https://example.com';
export const base = normalizeBase(process.env.SITE_BASE || '/');
