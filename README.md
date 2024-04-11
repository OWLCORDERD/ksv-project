### 📚 Use Tech

Develop language
<br/>
<br/>
<img src="https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=Webpack&logoColor=white"/>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
<br/>
<br/>
Used API
<br/>
<br/>
<img src="https://img.shields.io/badge/Spotify-1DB954?style=flat-square&logo=Spotify&logoColor=white"/>
<img src="https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=YouTube&logoColor=white"/>
<br/>
<br/>

### 🔎 Previews

#### Introduce

```
# UI 디자인 템플릿
https://www.figma.com/file/vupgYgR0OvCivnaUTCRNei?node-id=0:1&locale=en&type=design

# 배포 환경
아직 배포 단계 X
추후에 netlify에 우선 배포 예정

# 프로젝트 소개
- Webpack 모듈을 사용하여 vanila js webpack 환경 템플릿 생성
- 애니메이션 라이브러리를 활용한 인터렉티브 스크롤 이벤트 구현
- Spotify Web API를 활용한 artist 프로필 데이터와 artist의 track 곡 데이터 수집
- Spotify API에서 수집한 곡들의 제목을 Youtube API 활용하여 뮤직비디오 검색

# 프로젝트를 만들게 된 계기는?
오직 Vanila Javascript만으로 UI 로직과 비즈니스 로직을 구현하고 싶었고, CRA 같은 자동화 도구 말고도 Webpack을 직접 설치하여 개발 환경 구성 작업을 해보기 위하여 프로젝트를 만들게 되었습니다. 또한 최신 트렌드인 스크롤 인터렉티브 디자인을 구현하고 음원 API를 활용하여 아티스트를 추천하는 사이트를 제작하고 싶었습니다.
```

<br/>

#### 👨🏻‍💻 WebPack Setting

#### 1. 프로젝트 npm 사용을 위한 초기 initialize 작업

##### package.json 파일이 생성되어 프로젝트 버전과 사용된 모듈들, 스크립트 명령어 관리 가능

```bash
npm init -y
```

<br/>

#### 2. 웹팩 모듈 설치

##### develop mode로 설치하며, 터미널에서 webpack 커맨드를 실행하기 위한 webpack-cli 패키지 설치

```bash
npm install -D webpack webpack-cli
```

<br/>

#### 3. webpack.config.js 환경 설정 파일 생성

<br/>

#### 4. mode 환경 설정

##### npm -init 초기화 명령어로 생성 된 package.json 파일에서 mode 설정

```
mode 매개변수에는 production과 development로 나뉨

# 개발 모드 (npm start)
1. "webpack serve --open" : 개발용 webpack-dev-server 실행 후 브라우저 자동 오픈
2. "--mode=development" : webpack 개발 모드로 실행 (개발용, 소스맵 제공)

# 배포 모드 (npm build)
1. "webpack --mode=production" : webpack 배포 모드로 실행 (코드 압축하여 번들 최소화)
```

<br/>

#### 5. entry, output, plugins, module 환경 설정

```
# entry
webpack이 실행될 시, 모듈의 시작점이며 파일에 포함된 모듈, 라이브러리 번들링
예) './src/index.js'

# output
1. 번들링된 파일을 반환 할 path 경로를 지정
2. 반환 할 filename 지정

# loaders
기본적으로 js만 인식하는 webpack에 다른 파일들도 처리하도록 모듈로 변환하는 도구이며
css파일을 로드하는 css-loader, 비디오 파일을 로드하는 file-loader 등이 있다.

module 객체의 rules 속성에 규칙을 추가하며, use 속성에는 모듈 이름
test 속성에는 파일 확장자 정규식을 추가한다.

# plugins
loader의 모듈 변환 이외에 더 다양한 기능의 도구를 제공
사용 기능) htmlWebpackPlugin, MiniCssExtractPlugin
```

#### Used Library

- Gsap (Javascript Animation Library)

```bash
npm install gsap
```

🔧 Safe Plugin Gsap ScrollTrigger (Gsap 추가 기능 ScrollTrigger 플러그인)

```bash
gsap.registerPlugin(ScrollTrigger);
```
