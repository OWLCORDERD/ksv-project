import '@/styles/album.css';
import { getCurrentAlbum } from '../api/album';
import playButton from '@/images/svg/play.svg';
import gsap from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* 차트 페이지에서 URL로 넘겨받은 쿼리 객체 조회  */
const params = new URLSearchParams(window.location.search);

/* search 속성 객체에서 앨범 id 속성 값 추출 */
const select_albumId = params.get('id');

/* 선택한 앨범 id 값으로 spotify web api /albums 앨범 데이터 요청 */
const current_albumData = await getCurrentAlbum(select_albumId);

/* 선택 앨범 표지 이미지 영역 */
const album_cover = document.querySelector('.album-Banner > .album-cover');

/* 선택 앨범 표지 이미지 경로*/
const album_coverImg = current_albumData.images[0].url;

/* 앨범 이미지 노드 생성 */
const cover_image = document.createElement('img');
/* 앨범 이미지 src 경로 지정 및 앨범 이름 alt 속성 지정 */
cover_image.src = album_coverImg;
cover_image.alt = `${current_albumData.name} 앨범 커버`;

/* 앨범 표지 이미지 영역에 이미지 노드 추가 */
album_cover.appendChild(cover_image);

/* 선택 앨범 이름 영역 */
const album_name = document.querySelector('.album-name > h1');
const name_container = document.querySelector('.album-name');

/* 앨범 이름 데이터 fetching 완료 후 loading background 삭제 후 텍스트 생성 */
name_container.style.backgroundColor = 'transparent';
album_name.textContent = current_albumData.name;

/* 선택 앨범 발매일 영역 */
const release_date = document.querySelector('.release-date > p');
const date_container = document.querySelector('.release-date');

/* 발매일 데이터 fetching 완료 후 loading background 삭제 후 텍스트 생성 */
date_container.style.backgroundColor = 'transparent';
release_date.textContent = `Release date: ${current_albumData.release_date}`;

/* 앨범 곡 갯수 카운트 영역 */
const track_count = document.querySelector('.total-track > span');
const count_container = document.querySelector('.total-track');

/* 곡 카운트 데이터 fetching 완료 후 loading background 삭제 후 텍스트 생성 */
count_container.style.backgroundColor = 'transparent';
track_count.textContent = `Total track: ${current_albumData.total_tracks}`;

const header = document.querySelector('header');
const body = document.querySelector('body');
gsap.to(header, {
  backgroundColor: '#000',
  scrollTrigger: {
    trigger: body,
    top: 'top top',
    end: 'center center',
    scrub: 1,
  },
});

/* 앨범 곡 리스트 데이터 */
const album_tracks = current_albumData.tracks.items;

const track_list = document.querySelector('.track-list');
/* 앨범 데이터가 fetching 되는동안 사용자에게 보여질 skeleton 로딩 화면 영역 */
const skeleton_container = document.querySelector('.skeleton-loading');

/* 앨범 곡 리스트 데이터에 반복문을 활용하여 곡 리스트 영역에 아이템 노드 생성 */
album_tracks.forEach((track) => {
  /* 로딩 skeleton UI 제거 */
  skeleton_container.remove();
  const track_item = document.createElement('li');
  track_item.classList.toggle('track-item');

  const track_imgBox = document.createElement('div');
  track_imgBox.classList.toggle('track-img');

  const track_img = document.createElement('img');
  track_img.src = album_coverImg;
  track_img.alt = `${track.name} 앨범 이미지`;

  track_imgBox.appendChild(track_img);

  const track_titleWrap = document.createElement('div');
  track_titleWrap.classList.toggle('title-wrap');

  const track_title = document.createElement('h2');
  track_title.textContent = track.name;

  const track_album = document.createElement('p');
  track_album.textContent = current_albumData.name;

  track_titleWrap.appendChild(track_title);
  track_titleWrap.appendChild(track_album);

  const track_artist = document.createElement('span');
  track_artist.classList.toggle('track-artist');
  track_artist.textContent = track.artists[0].name;

  track_item.appendChild(track_imgBox);
  track_item.appendChild(track_titleWrap);
  track_item.appendChild(track_artist);

  const track_play = document.createElement('div');
  track_play.classList.toggle('play-track');
  track_play.innerHTML += playButton;

  track_item.appendChild(track_play);
  track_list.appendChild(track_item);
});
