# D2 아이콘

D2 펜스에서 `icon: icons/<이름>.svg`로 쓰는 로고 모음이다. 빌드 때 D2가 SVG 안에 base64로 박아 넣으므로
배포 환경의 네트워크·프록시와 무관하다. 사용법은 [docs/d2-authoring.md](../../../docs/d2-authoring.md)의
"로고·아이콘" 절을 따른다.

새 로고는 아래 두 출처에서 받아 이 폴더에 두고, 이 표에 한 줄을 더한다. 50KB를 넘는 파일은 두지 않는다
(SVG마다 통째로 임베드된다). 원격 URL을 펜스에 직접 쓰지 않는다 — 한 개만 실패해도 변환이 멈춘다.

- [D2 공식 아이콘](https://icons.d2lang.com) — `https://icons.d2lang.com/<팩>%2F<이름>.svg`. 컬러 로고.
  팩: dev(123)·aws(778)·gcp(109)·azure(262)·essentials·infra·tech. "기존 URL은 바꾸지 않는다"고 보장한다.
- [Simple Icons](https://simpleicons.org) — `https://cdn.simpleicons.org/<slug>`. 브랜드 색 단색 로고, CC0 1.0.
  D2 팩에 없는 로고(Kubernetes·Kafka·Keycloak·Grafana 등)를 여기서 받는다.

로고는 각 상표권자의 자산이다. 제품을 가리키는 아키텍처 그림 용도로만 쓰고 변형하지 않는다.

| 파일 | 출처 |
|---|---|
| docker.svg | https://icons.d2lang.com/dev%2Fdocker.svg |
| postgresql.svg | https://icons.d2lang.com/dev%2Fpostgresql.svg |
| python.svg | https://icons.d2lang.com/dev%2Fpython.svg |
| github.svg | https://icons.d2lang.com/dev%2Fgithub.svg |
| redis.svg | https://icons.d2lang.com/dev%2Fredis.svg |
| nginx.svg | https://icons.d2lang.com/dev%2Fnginx.svg |
| nodejs.svg | https://icons.d2lang.com/dev%2Fnodejs.svg |
| linux.svg | https://cdn.simpleicons.org/linux |
| kubernetes.svg | https://cdn.simpleicons.org/kubernetes |
| kafka.svg | https://cdn.simpleicons.org/apachekafka |
| keycloak.svg | https://cdn.simpleicons.org/keycloak |
| grafana.svg | https://cdn.simpleicons.org/grafana |
| prometheus.svg | https://cdn.simpleicons.org/prometheus |
| mlflow.svg | https://cdn.simpleicons.org/mlflow |
| helm.svg | https://cdn.simpleicons.org/helm |
| argo.svg | https://cdn.simpleicons.org/argo |
| nvidia.svg | https://cdn.simpleicons.org/nvidia |
| supabase.svg | https://cdn.simpleicons.org/supabase |
| cloudflare.svg | https://cdn.simpleicons.org/cloudflare |
| terraform.svg | https://cdn.simpleicons.org/terraform |
| vercel.svg | https://cdn.simpleicons.org/vercel |
