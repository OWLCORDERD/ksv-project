import './styles/index.css';
import { getArtists, getWeekArtist } from './api/artist';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import bannerVideo from './images/banner-video.mp4';
import search from './api/youtubeAPI';
import { slideItem } from './slideItem';

/* --gsap 라이브러리의 확장 기능 ScrollTrigger plugin 추가 (scroll event)-- */
gsap.registerPlugin(ScrollTrigger);

/* --screen container의 video 태그에 source 태그 추가-- */
const video_screen = document.querySelector('.banner_video');
const video_src = document.createElement('source');
/* --source 노드가 생성 될 시, 부모인 비디오 element에 자식노드로 넣은 후 src 경로 import-- */
if (video_screen) {
  video_screen.appendChild(video_src);
  video_src.src = bannerVideo;
}

const screenVideo = document.querySelector('.video-screen');
const video = document.querySelector('.banner_video');
const screenElement = document.querySelector('.screen-container');

gsap.to(screenVideo, {
  position: 'sticky',

  scrollTrigger: {
    trigger: screenElement,
    start: 'top top',
    end: '20% top',
    scrub: 1,
  },
});

gsap.to(video, {
  width: '100%',

  scrollTrigger: {
    trigger: screenElement,
    start: 'top top',
    end: '20% top',
    scrub: 1,
  },
});

const introduce_container = document.querySelector('.main-introduce');

gsap.fromTo(
  introduce_container,
  {
    opacity: 0,
  },
  {
    opacity: 1,
    scrollTrigger: {
      trigger: screenElement,
      start: '10% top',
      end: '20% top',
      scrub: 1,
    },
  },
);

const video_opacity = document.querySelector('.screen-opacity');

gsap.to(video_opacity, {
  width: '100%',

  scrollTrigger: {
    trigger: screenElement,
    start: 'top top',
    end: '20% top',
    scrub: 1,
  },
});

gsap.to(video_opacity, {
  backgroundColor: 'rgba(0,0,0,1)',

  scrollTrigger: {
    trigger: screenElement,
    start: 'top top',
    end: '30% top',
    scrub: 1,
  },
});

/* artist container 영역의 슬라이드 영역 appendChild */
const artists = await getArtists();

const carouselAnimate_container = document.querySelector(
  '.carousel-animateBox',
);

for (let i = 0; i < artists.length; i++) {
  let rotateY = i * 40;

  carouselAnimate_container.innerHTML += `
  <div class = "artist" style = "--i: ${rotateY}">
    <img src = "${artists[i].images[0].url}"/>
  </div>
  `;
}

/* getWeekArtist 비동기 함수 -> 주간 아티스트 ID를 선정하여
아티스트의 정보 요청과 인기곡 리스트 요청 총 2개의 더미 데이터를 배열로 저장합니다. */
const weekArtist = await getWeekArtist();

/* week-recommend (주간 추천 아티스트 영역) artist info 영역 */
const artistInfo = document.querySelector('.artist-info');
/* API에서 가져온 아티스트 이미지 삽입할 element 추가 */
const artistImgBox = document.createElement('div');
const artistImg = document.createElement('img');

/* 주간 아티스트 데이터 fetch 후 0번째 배열의 아티스트 정보에서 name 프로퍼티 추출하여 innerHTML */
if (weekArtist && artistInfo) {
  artistInfo.innerHTML = `
    <div class = "pick-title">
        <h3>This Week Ksv Artist</h3>
    </div>
    <div class = "artist-name">
        <h2>${weekArtist[0].name}</h2>
    </div>
  `;

  /* artist info 영역에 이미지를 감싸는 부모 element 자식 노드로 추가 */
  artistInfo.appendChild(artistImgBox);
  /* 이미지를 감싸는 부모 영역에 class 추가 */
  artistImgBox.classList.toggle('artist-imgBox');
  /* */
  artistImgBox.appendChild(artistImg);
  artistImg.src = weekArtist[0].images[0].url;
}

/* 아티스트 인기 곡 리스트 중 첫번째 곡을 대표 인기곡으로 선정 */
const weekArtist_topTrack = weekArtist[1].tracks[0];

/* search 비동기 함수 -> 대표 인기곡의 제목을 파라미터 값으로 전송하여
youtube API에 해당 곡을 검색하여 비디오 추출 */
const youtube = await search(weekArtist_topTrack.name);

const topTrack_video = document.querySelector('.topTrack-video');

const topTrack_videoId = youtube[0].id.videoId;

/*youtube iframe 비디오 태그 기본 형식에 src 경로의 id부분 대표 인기곡 ID로 설정 */
if (youtube && topTrack_video) {
  topTrack_video.innerHTML = `
  <iframe width="560" height="315"
  src="https://www.youtube.com/embed/${topTrack_videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${topTrack_videoId}"
  title="YouTube video player" frameborder="0" allow="accelerometer;
  autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;
  web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
  </iframe>
  `;
}

/*아티스트 대표 인기곡 앨범 이미지, 제목, 아티스트 노드 추가 */
const topTrack_imgBox = document.querySelector('.track-img');
const topTrack_img = document.createElement('img');
const topTrack_titleBox = document.querySelector('.track-title');
const topTrack_title = document.createElement('h2');
const topTrack_artistBox = document.querySelector('.track-artist');
const topTrack_artist = document.createElement('span');

topTrack_img.src = weekArtist_topTrack.album.images[0].url;
topTrack_imgBox.appendChild(topTrack_img);
topTrack_title.textContent = weekArtist_topTrack.name;
topTrack_titleBox.appendChild(topTrack_title);
topTrack_artist.textContent = weekArtist_topTrack.artists[0].name;
topTrack_artistBox.appendChild(topTrack_artist);

const ksvArtist_container = document.querySelector('.main-ksvArtist');
const carousel_container = document.querySelector('.carousel-Artist');
const carousel_animateBox = document.querySelector('.carousel-animateBox');

gsap.to(carousel_container, {
  position: 'sticky',

  scrollTrigger: {
    trigger: ksvArtist_container,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  },
});

gsap.fromTo(
  carousel_animateBox,
  {
    rotateY: '0deg',
  },
  {
    rotateY: '-360deg',

    scrollTrigger: {
      trigger: ksvArtist_container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  },
);

/* --header logo 영역 scroll 이벤트-- */

/*body 태그 내부에서 스크롤이 발생 시, logo 영역 이벤트 발생 */
const body = document.querySelector('body');
const logo_subTitle = document.querySelector('.sub-title');
const logo_mainTitle = document.querySelector('.main-title > h1');
const logo_container = document.querySelector('.logo');

/* @ logo 부제목 (sub-title) 영역 scroll Event @
스크롤 시, 부제목 영역의 높이값이 0으로 줄어들면서 사라지는 효과와 동시에
메인 title 영역만 logo 영역에 남도록 설정 */
gsap.to(logo_subTitle, {
  height: 0,

  scrollTrigger: {
    trigger: body,
    start: 'top top',
    end: '5% top',
    scrub: 1,
  },
});

/* @ logo (.logo) 영역 scroll Event @
높이 값을 메인 title 높이 값만큼 축소하고, 아래에서 위로 올라오도록 설정한
margin-top 값을 0으로 초기화하면서 메인 title 영역이 header 안에 위치하도록 설정 */
gsap.to(logo_container, {
  height: '5rem',
  marginTop: 0,

  scrollTrigger: {
    trigger: body,
    start: 'top top',
    end: '5% top',
    scrub: 1,
  },
});

/* @ logo 메인 제목 (main-title) 영역 scroll Event @
=> logo 영역의 크기를 줄임과 동시에 텍스트 크기 축소 */
gsap.to(logo_mainTitle, {
  fontSize: '1.5rem',

  scrollTrigger: {
    trigger: body,
    start: 'top top',
    end: '5% top',
    scrub: 1,
  },
});

/* --main contents 영역 header 스크롤 이벤트-- */

/* 메인 페이지의 main-contents container 영역에서 스크롤 시,
header 영역에 background 속성 부여  */
const contents_container = document.querySelector('.main-contents');
const header = document.querySelector('header');

gsap.fromTo(
  header,
  {
    backgroundColor: 'rgba(15, 15, 15, 0.0)',
  },
  {
    backgroundColor: 'rgba(15, 15, 15, 1)',

    scrollTrigger: {
      trigger: contents_container,
      start: '-20% top',
      end: 'top top',
      scrub: 1,
    },
  },
);

/* week ksv 아티스트 track List 영역 커스텀 슬라이드 구현 */
const track_slide = document.querySelector('.slide-wrap');

/* spotify web api에서 가져온 주간 artist 데이터 중 tracks 데이터 객체의
곡 데이터 갯수만큼 slideItem 함수에 파라미터로 데이터를 하나씩 넘기며
반복 실행 -> slide-wrap 영역에 자식 노드로 appendChild */
weekArtist[1].tracks.forEach((track) => {
  track_slide.appendChild(slideItem(track));
});

/* -- 커스텀 제작 캐러셀 슬라이드 객체 -- */
class customCarousel {
  version = 0.1;
  /* slide wrapper container element */
  el = null;
  /* slide item elements */
  items = [];
  /* wrapper 내부 화면에 보여질 item 갯수 */
  size = 3;
  /* slide item 속성 */
  item = {
    gap: 10, // margin in px
    width: 0, // 접속하는 해상도마다 el % 크기에 따라 width값 자동 조절
    left: 0, // 아이템 위칫값
  };
  /* slide item active class */
  activeClass = true;

  constructor(el) {
    /* 객체 el 식별자 = 객체 생성 시 넘겨받은 wrapper element */
    this.el = el;
    /* 객치 items 배열 식별자 = slide item elements */
    this.items = document.getElementsByClassName('track-item');

    /* 슬라이드 컨트롤하는 버튼 elements 조회 */
    const nav = document.querySelectorAll('#slide-button');

    /* 각 nav 버튼 클릭 할 시, 각 dom element 인자값을 move 메소드에 전송하여 이벤트 실행 */
    for (let i = 0; i < nav.length; i++) {
      nav[i].addEventListener('click', () => this.move(nav[i]));
    }

    /* 초기 작업 init 호출 */
    this.init();
  }

  /* 초기 작업 함수 */
  async init() {
    /*getSize 메소드 = slide item width 값 반환받고 객체 item width 프로퍼티에 저장 */
    this.item.width = await this.getSize();
    /* slide wrapper 높이값을 slide item 높이값 + px 지정 */
    this.el.style.height = this.items[0].clientHeight + 'px';

    /* slide item의 포지션을 생성하는 build 호출 */
    await this.build();
  }

  /* slide item width 값 구하는 함수 */
  async getSize() {
    /* slide item들을 담고 있는 wrapper container의 넓이 값 */
    const el_width = this.el.clientWidth;
    let w = 0;
    /* slide wrapper 넓이 값을 화면에 보여질 아이템 갯수로 나누어
    한 아이템의 넓이 값 구하고, 아이템간의 여백값만큼 빼기 */
    w = el_width / this.size - this.item.gap;
    return w;
  }

  /* slide item 포지션 생성 함수 */
  async build() {
    /* slide item left 값 */
    let l = this.item.width * -1;
    for (let i = 0; i < this.items.length; i++) {
      /*각 아이템의 넓이 값을 getSize() 에서 구한 값 + px 적용 */
      this.items[i].style.width = this.item.width + 'px';

      /* 각 아이템의 left 값 + px 적용 */
      this.items[i].style.left = l + 'px';

      /* i번째 아이템의 left값을 지정한 뒤 다음 아이템의 left 값을 구한다 */
      l = l + this.item.width;
      if (i > 0) {
        /* 첫번째 아이템을 제외한 나머지 아이템의 left 속성에 여백 크기를 합하여 구한다. */
        l = l + this.item.gap;
      }
    }

    /* 각 slide item의 포지션 생성을 완료한 이후 setActive 메소드 실행 */
    if (this.activeClass) {
      this.setActive();
    }
  }

  /* prev, next 속성값에 따른 DOM node를 복제하는 함수 */
  async clone(pos = 'next') {
    /* 복제 할 item node */
    let item = 0;

    /*클릭한 버튼의 속성값이 next 일시 0번째 인덱스
    즉 첫번째 아이템을 복제 */
    if (pos === 'next') {
      item = this.items[0];

      /*클릭한 버튼의 속성값이 prev 일시 마지막 인덱스
    아이템을 복제 */
    } else {
      item = this.items[this.items.length - 1];
    }

    /* item 복제본을 저장 */
    let c = item.cloneNode(true);

    /* 복제한 0번째 index의 아이템을 append 메소드를 통해서 뒤로 위치시킴 */
    if (pos === 'next') {
      this.el.append(c);

      /* 복제한 마지막 index의 아이템을 prepend 메소드를 통해서 맨앞으로 위치시킴 */
    } else {
      this.el.prepend(c);
    }

    /* 복제본 자리 이동 완료 후 원본 아이템 삭제 */
    item.remove();
  }

  /* prev&next navigator 속성값에 따라 슬라이드 이동시키는 함수 */
  async move(el) {
    /* navigator button element의 data-dir 속성 값 추출 */
    const posAttribute = el.getAttribute('data-dir');

    /* 속성값에 따른 메소드 실행 */
    if (posAttribute === 'next') {
      this.next();
    } else {
      this.prev();
    }
  }

  /* 클릭한 control 버튼의 data-dir 속성값이 "next" 일시 실행되는 함수 */
  async next() {
    await this.clone('next');
    await this.build();
  }

  /* 클릭한 control 버튼의 data-dir 속성값이 "prev" 일시 실행되는 함수 */
  async prev() {
    await this.clone('prev');
    await this.build();
  }

  /* build 메소드가 실행된 뒤로 active class를 toggle시킬 item을 지정하는 함수 */
  setActive() {
    /* active class가 toggle되는 기준 인덱스 */
    let m = Math.round(this.size / 2);

    for (let i = 0; i < this.items.length; i++) {
      /* 모든 slide item들의 active class를 지움 */
      this.items[i].classList.remove('active');

      /* 기준 값 m과 일치하는 반복문의 i번째 아이템의 인덱스에 active class toggle */
      if (i === m) {
        this.items[i].classList.add('active');
      }
    }
  }
}

/* 커스텀 슬라이드 객체 생성 시 슬라이드 이벤트를 부여 할 
slide-wrap 영역을 인자값으로 전달 */
new customCarousel(track_slide);
