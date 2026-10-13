# D2 아이콘

D2 펜스에서 `icon: icons/<이름>.svg`로 쓰는 로고 모음이다. 제품 로고는 이 폴더에 바로 두고,
Kubernetes 리소스·컴포넌트 아이콘은 `k8s/`에 둔다(`icon: icons/k8s/pod.svg`). 빌드 때 D2가 SVG 안에 base64로 박아 넣으므로
배포 환경의 네트워크·프록시와 무관하다. 사용법은 [docs/d2-authoring.md](../../../docs/d2-authoring.md)의
"로고·아이콘" 절을 따른다.

새 로고는 아래 두 출처에서 받아 이 폴더에 두고, 이 표에 한 줄을 더한다. 50KB를 넘는 파일은 두지 않는다
(SVG마다 통째로 임베드된다). 원격 URL을 펜스에 직접 쓰지 않는다 — 한 개만 실패해도 변환이 멈춘다.

- [D2 공식 아이콘](https://icons.d2lang.com) — `https://icons.d2lang.com/<팩>%2F<이름>.svg`. 컬러 로고.
  팩: dev(123)·aws(778)·gcp(109)·azure(262)·essentials·infra·tech. "기존 URL은 바꾸지 않는다"고 보장한다.
- [Simple Icons](https://simpleicons.org) — `https://cdn.simpleicons.org/<slug>`. 브랜드 색 단색 로고, CC0 1.0.
  D2 팩에 없는 로고(Kubernetes·Kafka·Keycloak·Grafana 등)를 여기서 받는다.
- 둘 다에 없는 제품은 그 프로젝트 저장소의 로고 파일을 받는다(아래 kagent·kMCP). 가로로 긴 wordmark는
  노드 안에서 띠처럼 작아지므로, 정사각형 마크를 따로 두고 wordmark는 `-wordmark` 접미사로 둔다.

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
| kagent.svg | https://github.com/kagent-dev/kagent/blob/main/ui/public/favicon.svg (Apache-2.0, 마크만) |
| kagent-wordmark.svg | https://github.com/kagent-dev/kagent/blob/main/img/icon-light.svg (밝은 배경용 wordmark) |
| kmcp.svg | https://github.com/kagent-dev/kmcp/blob/main/img/kmcp-logo-dark.svg 의 왼쪽 마크만 viewBox로 잘라 냄 (Apache-2.0) |
| kmcp-wordmark.svg | https://github.com/kagent-dev/kmcp/blob/main/img/kmcp-logo-dark.svg (밝은 배경용 wordmark) |

## k8s/ — Kubernetes 공식 아이콘 세트

[kubernetes/community의 icons](https://github.com/kubernetes/community/tree/master/icons) (Apache-2.0)에서
받은 **labeled** 버전이다. 파란 육각형 안에 리소스 약어가 적혀 있어 노드 라벨이 길어도 종류가 한눈에 보인다.
파일명은 kubectl 약어와 같다. 다시 받을 때는 `https://raw.githubusercontent.com/kubernetes/community/master/icons/svg/<폴더>/labeled/<이름>.svg`.

| 폴더 | 파일 |
|---|---|
| resources | c-role cm crb crd cronjob deploy ds ep group hpa ing job limits netpol ns pod psp pv pvc quota rb role rs sa sc secret sts svc user vol |
| infrastructure_components | control-plane etcd node |
| control_plane_components | api c-c-m c-m k-proxy kubelet sched |
