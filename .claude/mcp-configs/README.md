# MCP Server Configurations

이 디렉토리는 Claude Code에서 사용할 MCP (Model Context Protocol) 서버 설정을 포함합니다.

## 설치 방법

1. 원하는 MCP 서버 설정을 `~/.claude.json`의 `mcpServers` 섹션에 복사
2. 필요한 환경 변수나 API 키 설정
3. Claude Code 재시작

## 사용 가능한 설정

### mcp-servers.json
프로젝트에 권장되는 MCP 서버 목록:
- **GitHub**: PR, Issue 관리
- **Fetch**: 외부 API 호출
- **Filesystem**: 파일 시스템 접근 (선택적)

## 환경 변수

```bash
# GitHub MCP (선택적 - gh CLI가 있으면 불필요)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## 참고

- MCP 서버는 Claude Code의 기능을 확장합니다
- 각 서버는 특정 도구들을 제공합니다
- 자세한 내용: https://modelcontextprotocol.io/
