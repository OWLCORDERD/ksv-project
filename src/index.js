import './styles/index.css';
import { getArtists, getWeekArtist } from './api/artist';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import bannerVideo from './images/banner-video.mp4';
import search from './api/youtubeAPI';
import { slideItem } from './slideItem';

/* gsap 확장 기능 ScrollTrigger plugin 추가 (scroll event) */
gsap.registerPlugin(ScrollTrigger);

/* Banner 영역 video element에 source 태그 추가 */
const video_screen = document.querySelector('.banner_video');
const video_src = document.createElement('source');
/* source 노드가 생성 될 시, 부모인 비디오 element에 자식노드로 넣은 후 src 경로 import */
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
      start: '20% top',
      end: 'center center',
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
    start: '20% top',
    end: 'bottom bottom',
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

const track_slide = document.querySelector('.slide-wrap');

weekArtist[1].tracks.forEach((track) => {
  track_slide.appendChild(slideItem(track));
});
