import './styles/index.css';
import { getArtists, getWeekArtist } from '@/api/artist';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import bannerVideo from '@/images/videos/bannerVideo.mp4';
import search from '@/api/youtubeAPI';
import { slideItem } from '@/slideItem';
import { findChartTrack } from './api/chart';
import spotify from './images/svg/spotify.svg';
import jsonFile from './images/svg/jsonFile.svg';
import database from './images/svg/database.svg';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import '@/styles/swiper/swiper.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const body = document.querySelector('body');
const loading = document.querySelector('.loading');

body.removeChild(loading);
body.style.overflow = 'auto';

/* -- gsap 라이브러리의 확장 기능 ScrollTrigger plugin 추가 (scroll event) -- */
gsap.registerPlugin(ScrollTrigger);

/* -- video element에 비디오 경로가 지정된 source element 추가 -- */
const video_screen = document.querySelector('.banner_video');
const video_src = document.createElement('source');
/* source element 생성 후, source element에 src 속성으로 비디오 경로 추가 후 자식노드로 추가 */
if (video_screen) {
  video_screen.appendChild(video_src);
  video_src.src = bannerVideo;
}

/* -- screen container 스크롤 이벤트 -- */

/* screen container의 Banner 스크롤 영역 */
const mainBanner = document.querySelector('.screen-container > .Banner');
/* Banner 300vh 높이 영역 스크롤 시, 상단에 고정 시키는 비디오 영역 */
const video_container = document.querySelector('.video-screen');
/* 고정된 비디오 영역을 fade-out 느낌으로 감추기 위한 screen opacity background 영역 */
const video_opacity = document.querySelector('.screen-opacity');
/* 비디오 영역이 검정색으로 변하는 동시에 동적으로 변하는 dynamic text wrap */
const dynamic_container = document.querySelector('.dynamic-container');
/* dynamic text wrap logo 영역 */
const dynamicLogo = document.querySelector('.dynamic-logo');
/* dynamic text wrap sub-txt 영역 */
const dynamicTxt = document.querySelector('.dynamic-txt');
/* scroll down 버튼 */
const scrollDown = document.querySelector('.scroll-down');

/* Banner 영역 상단에서 스크롤을 시작할 시,
비디오 스크린 영역을 sticky로 상단에 고정 */
gsap.to(video_container, {
  position: 'sticky',

  scrollTrigger: {
    trigger: mainBanner,
    start: 'top top',
    end: 'center bottom',
    scrub: 1,
  },
});

/* 비디오 스크린 영역이 상단에 고정되면서 하단까지 스크롤 될 때,
dynamic logo와 txt 영역의 인터렉션 변화를 위해  screen opacity 영역 background 검정색으로 투명도 증가 */
gsap.to(video_opacity, {
  backgroundColor: 'rgba(0,0,0,1)',

  scrollTrigger: {
    trigger: mainBanner,
    start: 'top top',
    end: '10% top',
    scrub: 1,
  },
});

/* dynamic 로고와 부제목을 감싸는 flex 컨테이너 부모 요소의 높이값을 증가 */
gsap.to(dynamic_container, {
  height: '16rem',

  scrollTrigger: {
    trigger: mainBanner,
    start: '10% top',
    end: '40% top',
    scrub: 1,
  },
});

/* 부제목을 제목뒤에 숨기기위해 absolute 속성으로 지정한 로고 영역에
relative 속성을 부여하여 flex column 정렬 */
gsap.to(dynamicLogo, {
  position: 'relative',

  scrollTrigger: {
    trigger: mainBanner,
    start: '10% top',
    scrub: 1,
  },
});

/* 제목뒤에 숨어있던 부제목 영역을 opacity 0 -> 1로 변경하여
fade-in 되도록 하고, relative 속성을 부여하여 flex column 정렬 */
gsap.fromTo(
  dynamicTxt,
  {
    opacity: 0,
    y: 100,
  },
  {
    opacity: 1,
    y: 0,
    position: 'relative',

    scrollTrigger: {
      trigger: mainBanner,
      start: '20% top',
      scrub: 1,
    },
  },
);

/* dynamic txt의 인터렉션 변화가 일어나는 동시에 스크롤 버튼을 아래로 내리면서
fade-out 되는 효과 부여 */
gsap.to(scrollDown, {
  y: 250,
  opacity: 0,

  scrollTrigger: {
    trigger: mainBanner,
    start: '25% top',
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
    <img src = "${artists[i].images[0].url}" alt = "${artists[i].name} 프로필 이미지"/>
  </div>
  `;
}

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

/* 주간 아티스트를 선정하여 아티스트의 spotify web api ID값으로
아티스트 데이터 & top track 데이터 총 2개의 더미 데이터를 요청하고 결과를 반환합니다. */
const weekArtist = await getWeekArtist();

/* week-recommend (주간 추천 아티스트 영역) artist info 영역 */
const artistInfo = document.querySelector('.artist-info');

/* 결과 더미데이터 중, 0번째 인덱스의 아티스트 데이터에서 name 프로퍼티 추출하여 
artist info 영역에 innerHTML */
if (weekArtist && artistInfo) {
  artistInfo.innerHTML = `
    <div class = "pick-title">
        <p>This Week Ksv Artist</p>
    </div>
    <div class = "artist-name">
        <h2>${weekArtist[0].name}</h2>
    </div>
  `;

  /* API에서 가져온 아티스트 이미지를 삽입할 img element 추가 */
  const artistImgBox = document.createElement('div');
  const artistImg = document.createElement('img');

  /* artist info 영역에 img element 자식 노드로 추가 */
  artistInfo.appendChild(artistImgBox);
  artistImgBox.classList.toggle('artist-imgBox');
  artistImgBox.appendChild(artistImg);
  /* 0번째 인덱스의 아티스트 데이터 중 높은 화질의 image url 속성값 추출하여 src import */
  artistImg.src = weekArtist[0].images[0].url;
  artistImg.alt = `${weekArtist[0].name} 프로필 이미지`;
}

/* 1번째 인덱스의 top track 데이터 중 첫번째 곡을 대표 인기곡으로 선정 */
const weekArtist_topTrack = weekArtist[1].tracks[0];

/* search 비동기 함수 -> 대표 인기곡의 제목을 파라미터 값으로 전송하여
youtube API에 해당 곡을 검색하여 비디오 추출 */
const music_video = await search(weekArtist_topTrack.name);

const topTrack_video = document.querySelector('.topTrack-video');

const topTrack_videoId = music_video[0].id.videoId;

/*youtube iframe 비디오 태그 기본 형식에 src 경로의 id부분 대표 인기곡 ID로 설정 */
if (music_video && topTrack_video) {
  topTrack_video.innerHTML = `
  <iframe width="560" height="315"
  src="https://www.youtube.com/embed/${topTrack_videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${topTrack_videoId}"
  title="YouTube video player" frameborder="0" allow="accelerometer;
  autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;
  web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
  </iframe>
  `;
}

if (weekArtist_topTrack) {
  /* 주간 아티스트 대표 인기곡 앨범 이미지 element 추가 */
  const topTrack_imgBox = document.querySelector('.track-img');
  const topTrack_img = document.createElement('img');

  if (topTrack_img) {
    /* 이미지 element에 대표 인기곡 데이터 중 앨범 이미지 경로값 src 속성에 추가 */
    topTrack_img.src = weekArtist_topTrack.album.images[0].url;
    topTrack_img.alt = `${weekArtist_topTrack.album.name} 대표 곡 앨범 이미지`;
    topTrack_imgBox.appendChild(topTrack_img);
  }

  /* 주간 아티스트 대표 인기곡 제목 element 추가 */
  const topTrack_titleBox = document.querySelector('.track-title');
  const topTrack_title = document.createElement('h2');

  if (topTrack_title) {
    topTrack_title.innerText = weekArtist_topTrack.name;
    topTrack_titleBox.appendChild(topTrack_title);
  }

  /* 주간 아티스트 대표 인기곡 앨범 아티스트 이름 element 추가 */
  const topTrack_artistBox = document.querySelector('.track-artist');
  const topTrack_artist = document.createElement('span');

  if (topTrack_artist) {
    topTrack_artist.innerText = weekArtist_topTrack.artists[0].name;
    topTrack_artistBox.appendChild(topTrack_artist);
  }
}

/* --main contents 영역 header 스크롤 이벤트-- */

/* 메인 페이지의 main-contents container 영역에서 스크롤 시,
header 영역에 background 속성 부여  */
const contents_container = document.querySelector('.main-contents');
const header = document.querySelector('header');

gsap.fromTo(
  header,
  {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  {
    backgroundColor: 'rgba(0, 0, 0, 1)',

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

const pickMethods_container = document.querySelector('.pick-methods');

const methodData = [
  {
    id: 1,
    image: spotify,
    title: 'Download Spotify Chart File',
    info: 'spotify chart 사이트에서 주간마다 제공하는 한국 차트곡 데이터 CSV 파일을 추출합니다.',
  },
  {
    id: 2,
    image: jsonFile,
    title: 'Format CSV file to JSON file',
    info: '웹 브라우저에서 곡 데이터들을 볼 수 있도록 CSV 파일을 JSON 파일로 포맷합니다. .',
  },
  {
    id: 3,
    image: database,
    title: 'Update Chart Database',
    info: '차트 데이터를 관리하는 데이터베이스에 파일을 반영하여 내용을 업데이트합니다.',
  },
];

/* Weekly Chart(주간 차트) pick methods(선택한 방법) ul container 자식 노드 */
methodData.forEach((data) => {
  const method_item = document.createElement('li');
  const method_imageBox = document.createElement('div');
  const method_infoBox = document.createElement('div');
  const info_title = document.createElement('h2');
  const info_txtBox = document.createElement('div');
  const info_txt = document.createElement('p');

  method_item.classList.toggle('method-item');
  method_item.appendChild(method_imageBox);
  method_imageBox.classList.toggle('method-imgBox');
  method_imageBox.innerHTML += data.image;
  method_item.appendChild(method_infoBox);
  method_infoBox.classList.toggle('method-infoBox');
  method_infoBox.appendChild(info_title);
  info_txtBox.classList.toggle('info-txt');
  method_infoBox.appendChild(info_txtBox);
  info_txtBox.appendChild(info_txt);
  info_title.textContent = data.title;
  info_txt.textContent = data.info;

  pickMethods_container.appendChild(method_item);
});

const chartTrackDB = await findChartTrack();

const chart10Track = chartTrackDB.slice(0, 10);

const slide_prev = document.querySelector('.prev-button');
const slide_next = document.querySelector('.next-button');

new Swiper('.swiper-container', {
  slidesPerView: 3,
  modules: [Navigation],
  navigation: {
    prevEl: slide_prev,
    nextEl: slide_next,
  },
  speed: 1000,
  spaceBetween: 50,
});

const slideWrapper = document.querySelector('.swiper-wrapper');

chart10Track.forEach((track) => {
  const track_slide = document.createElement('div');
  track_slide.classList.toggle('swiper-slide');
  const slide_imageBox = document.createElement('div');
  slide_imageBox.classList.toggle('track-image');
  const slide_image = document.createElement('img');
  slide_image.src = `${track.album.images[0].url}`;
  slide_imageBox.appendChild(slide_image);
  track_slide.appendChild(slide_imageBox);
  const track_infoBox = document.createElement('div');
  track_infoBox.classList.add('track-infoBox');
  const track_title = document.createElement('h3');
  const track_artist = document.createElement('span');
  track_title.textContent = track.name;
  track_infoBox.appendChild(track_title);
  track_artist.textContent = track.artists[0].name;
  track_infoBox.appendChild(track_artist);
  track_slide.appendChild(track_infoBox);
  slideWrapper.appendChild(track_slide);
});

const weeklyChart_container = document.querySelector('.Weekly-chart');
const weeklyChart_title = document.querySelector('.chart-titleWrap');

gsap.fromTo(
  weeklyChart_title,
  {
    opacity: 0,
    y: 50,
  },
  {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: weeklyChart_container,
      start: '-10% top',
      end: 'top top',
    },
  },
);

gsap.fromTo(
  pickMethods_container,
  {
    opacity: 0,
    y: 50,
  },
  {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: weeklyChart_container,
      start: '5% top',
      end: '10% top',
    },
  },
);
