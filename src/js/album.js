import '@/styles/album.css';
import { getCurrentAlbum } from '../api/album';
import optionButton from '@/images/svg/dot-menu-more.svg';
import playIcon from '@/images/svg/option-menu/play.svg';
import playListIcon from '@/images/svg/option-menu/music-library.svg';
import gsap from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

/* 차트 페이지에서 URL로 넘겨받은 쿼리 객체 조회  */
const params = new URLSearchParams(window.location.search);

/* search 속성 객체에서 앨범 id 속성 값 추출 */
const select_albumId = params.get('id');

/* spotify web api albums 라우터에 선택한 앨범 id 값으로 앨범 데이터 요청 */
const current_albumData = await getCurrentAlbum(select_albumId);

/* 선택 앨범 표지 이미지 영역 */
const album_cover = document.querySelector('.album-cover');
const albumCover_skeleton = document.querySelector(
  '.album-cover > .skeleton-loading',
);

/* 선택 앨범 표지 이미지 경로*/
const album_coverImg = current_albumData.images[0].url;

/* 앨범 이미지 노드 생성 */
const cover_image = document.createElement('img');
/* 앨범 이미지 src 경로 지정 및 앨범 이름 alt 속성 지정 */
cover_image.src = album_coverImg;
cover_image.alt = `${current_albumData.name} 앨범 커버`;

/* 앨범 표지 이미지 영역에 이미지 노드 추가 */
album_cover.appendChild(cover_image);

/* 이미지 노드 추가 된 후 기존 스켈레톤 UI 제거 */
albumCover_skeleton.remove();

/* 선택 앨범 이름 영역 */
const album_name = document.querySelector('.album-name > h1');
const name_skeleton = document.querySelector('.album-name > .skeleton-loading');

/* 앨범 이름 데이터 fetching 완료 후 loading background 삭제 후 텍스트 생성 */
album_name.textContent = current_albumData.name;
name_skeleton.remove();

/* 선택 앨범 발매일 영역 */
const release_date = document.querySelector('.release-date > p');
const release_skeleton = document.querySelector(
  '.release-date > .skeleton-loading',
);

/* 발매일 데이터 fetching 완료 후 text */
release_date.textContent = `Release date: ${current_albumData.release_date}`;
release_skeleton.remove();

/* 앨범 곡 갯수 카운트 영역 */
const track_count = document.querySelector('.total-track > span');
const trackCount_skeleton = document.querySelector(
  '.total-track > .skeleton-loading',
);

/* 곡 카운트 데이터 fetching 완료 후 loading background 삭제 후 텍스트 생성 */
track_count.textContent = `Total track: ${current_albumData.total_tracks}`;
trackCount_skeleton.remove();

/* 앨범 데이터의 곡 리스트 데이터 배열 추출 */
const album_tracks = current_albumData.tracks.items;

/* 앨범 곡 리스트 부모 영역 */
const track_list = document.querySelector('.track-list');
/* 리스트 노드 자식노드들 생성되기까지 보여지는 Skeleton UI 영역 */
const trackList_skeleton = document.querySelector('.trackList-loading');

/* 앨범 곡 리스트 데이터에 반복문을 활용하여 곡 리스트 영역에 아이템 노드 생성 */
album_tracks.forEach((track) => {
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

  const option_toggleButton = document.createElement('button');
  option_toggleButton.classList.toggle('option-button');
  option_toggleButton.innerHTML += optionButton;
  track_item.appendChild(option_toggleButton);

  const track_optionMenu = document.createElement('div');
  track_optionMenu.classList.toggle('option-menu');

  track_item.appendChild(track_optionMenu);
  track_list.appendChild(track_item);
  trackList_skeleton.remove();
});

const option_toggleButton = document.querySelectorAll('.option-button');
const track_optionMenu = document.querySelectorAll('.option-menu');

option_toggleButton.forEach((button, i) => {
  button.addEventListener('click', () => {
    if (track_optionMenu[i].className === 'option-menu') {
      track_optionMenu.forEach((menu) => {
        menu.classList.remove('active');
      });
      track_optionMenu[i].classList.add('active');
    } else {
      track_optionMenu[i].classList.remove('active');
    }
  });
});

const menuData = [
  {
    title: '플레이리스트에 추가하기',
    class: 'add_playList',
    icon: playListIcon,
  },
  {
    title: '바로 듣기',
    class: 'play_music',
    icon: playIcon,
  },
];

track_optionMenu.forEach((menu) => {
  const option_list = document.createElement('ul');

  menuData.forEach((item) => {
    const option_item = document.createElement('li');
    option_item.classList.toggle(item.class);
    const iconBox = document.createElement('div');
    iconBox.classList.toggle('menu-icon');
    const titleBox = document.createElement('div');
    titleBox.classList.toggle('menu-title');

    iconBox.innerHTML += item.icon;
    titleBox.innerHTML += item.title;

    option_item.appendChild(iconBox);
    option_item.appendChild(titleBox);
    option_list.appendChild(option_item);
  });
  menu.appendChild(option_list);
});

const track_items = document.querySelectorAll('.track-item');

let save_trackIds = [];

track_items.forEach((item, i) => {
  const addPlayList_option = document.querySelector(
    `.track-item:nth-child(${i + 1}) > .option-menu > ul > .add_playList`,
  );

  addPlayList_option.addEventListener('click', () => {
    const track_id = current_albumData.tracks.items[i].id;

    const find_duplicate = save_trackIds.find((id) => id === track_id);

    if (find_duplicate === undefined) {
      save_trackIds.push(track_id);
      localStorage.setItem('play_list', save_trackIds);
    }
  });
});
