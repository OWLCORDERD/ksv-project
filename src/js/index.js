import '@/styles/index.css';
import { getArtists } from '@/api/artist';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import bannerVideo from '@/images/videos/bannerVideo.mp4';
import { getChartTrack } from '@/api/chart';
import spotify from '@/images/svg/spotify.svg';
import jsonFile from '@/images/svg/jsonFile.svg';
import database from '@/images/svg/database.svg';
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
const artistIds = [
  '3HqSLMAZ3g3d5poNaI7GOU',
  '3qNVuliS40BLgXGxhdBdqu',
  '5dCvSnVduaFleCnyy98JMo',
  '6UbmqUEgjLA6jAcXwbM1Z9',
  '6dhfy4ByARPJdPtMyrUYJK',
  '6qvVoPGEqNCyYSjYCgfV1v',
  '7c1HgFDe8ogy5NOZ1ANCJQ',
  '0kRAVpQhUUArA8UnYwEdeZ',
  '6zn0ihyAApAYV51zpXxdEp',
];

const artists = await getArtists({ artistIds });

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

const chartTrackDB = await getChartTrack();

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
  slide_image.alt = `${track.name} 앨범 이미지`;
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
