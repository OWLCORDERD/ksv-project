import '@/styles/album.css';
import { getCurrentAlbum } from '../api/album';
import optionButton from '@/images/svg/dot-menu-more.svg';
import trashIcon from '@/images/svg/option-menu/trash.svg';
import playListIcon from '@/images/svg/option-menu/music-library.svg';
import musicFile from '@/images/svg/dashboard-icon/music-file.svg';
import gsap from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getTrackData } from '../api/chart';

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

// 앨범 페이지에 접속할때마다 로컬 스토리지의 play_list 아이템 배열 가져오기
const play_list = localStorage.getItem('play_list');

// 사용자가 곡 리스트에서 곡을 선택할때마다 저장되어 포맷되는 로컬 스토리지 재생곡 id 문자열
const current_play = localStorage.getItem('current_play');

// header에 포함된 현재 재생중인 노래 미리보기 player 음반 이미지, 제목, 아티스트 이름 영역 노드
const currentMusic_cover = document.querySelector(
  '.currentMusic-player > .music-cover',
);
const currentMusic_title = document.querySelector(
  '.currentMusic-player > .music-titleWrap > .music-title',
);
const currentMusic_artist = document.querySelector(
  '.currentMusic-player > .music-titleWrap > .music-artist',
);
// 음반 이미지 영역 이미지 태그 노드
const currentMusic_image = document.querySelector(
  '.currentMusic-player > .music-cover > img',
);

/* 렌더링시 current_play 로컬스토리지 아이템에 사용자가 선택한 곡이 없으면
사용자에게 보여질 header 영역 currentMusic player 영역 default 노드 세팅 */
if (current_play === '') {
  currentMusic_cover.innerHTML += musicFile;

  currentMusic_title.textContent = '곡을 선택해주세요.';

  currentMusic_artist.remove();

  currentMusic_title.style.height = '3rem';
  currentMusic_title.style.display = 'flex';
  currentMusic_title.style.alignItems = 'center';
} else {
  /* 렌더링 시 current_play 로컬스토리지에 곡 id 값이 존재할 시
  매개변수로 fetching하여 응답받은 곡 데이터 속성값으로 header영역 currentMusic player 노드 세팅  */
  const current_play = localStorage.getItem('current_play');
  const currentMusic_data = await getTrackData(current_play);

  currentMusic_image.src = currentMusic_data.album.images[0].url;
  currentMusic_image.style.opacity = 1;

  currentMusic_title.textContent = currentMusic_data.name;
  currentMusic_artist.textContent = currentMusic_data.artists[0].name;
}

// playList 팝업창 class toggle 시키는 header currentMusic player 토글 버튼
const popup_toggleButton = document.querySelector('.playList-toggle');

// playList 팝업창 부모 노드
const popup_container = document.querySelector('.playList-popup');

// playList 팝업창 music player 영역 자식 노드들 (음반 제목, 아티스트, 이미지)
const popup_playerTitle = document.querySelector(
  '.playList-popup > .music-player > .music-title',
);
const popup_playerArtist = document.querySelector(
  '.playList-popup > .music-player > .music-artist',
);
const popup_playerDisk = document.querySelector(
  '.playList-popup > .music-player > .music-disk',
);

const popup_playerDiskImg = document.querySelector(
  '.playList-popup > .music-player > .music-disk > img',
);

// playList 팝업창 music player 오디오 영역
const popup_playerAudio = document.querySelector('.music-audio');
const popup_playerSource = document.querySelector('.music-audio > source');

// playList 팝업창 music player 오디오 재생 현황에 따라 업데이트되는 range input 영역
const popup_musicSeekBar = document.querySelector('.seek-bar');

// playList 팝업창 music player 오디오 총 재생시간 텍스트 영역
const popup_playDuration = document.querySelector(
  '.audio-slider > .music-duration',
);

// playList 팝업창 music player 오디오 재생시간 현황 텍스트 영역
const popup_playCurrentTime = document.querySelector(
  '.audio-slider > .current-time',
);

/* 오디오 태그에서 제공하는 재생시간 minute : second 형태로 포맷해주는 함수 */
const audioPlayTime_Format = (audio_time) => {
  let min = Math.floor(audio_time / 60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(audio_time % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min} : ${sec}`;
};

// header의 currentMusic player 영역의 팝업 토글 버튼 클릭 이벤트
popup_toggleButton.addEventListener('click', async () => {
  // 팝업창 active class toggle (display : none 상태 -> display : block)
  popup_container.classList.toggle('active');

  // 팝업창 active class가 부여되어 있을 시 실행
  if (popup_container.className.includes('active')) {
    // 오디오 재생 중에 팝업창을 닫았을 시 저장한 재생 시간
    const current_beforeTime = localStorage.getItem('audio_currentTime');
    // 실시간으로 변경 될수도 있는 로컬 스토리지에 저장된 곡 id 값을 클릭할때마다 추출
    const current_play = localStorage.getItem('current_play');

    if (current_play !== '') {
      // 실시간으로 클릭할때마다 로컬 스토리지에 저장된 곡 id 값으로 곡 데이터 요청
      const currentMusic_data = await getTrackData(current_play);
      //playList popup -> music-player 영역 자식 노드들의 데이터 업데이트
      popup_playerTitle.textContent = currentMusic_data.name;
      popup_playerArtist.textContent = currentMusic_data.artists[0].name;
      popup_playerDiskImg.src = currentMusic_data.album.images[0].url;
      popup_playerSource.src = currentMusic_data.preview_url;
      popup_playerAudio.load();
      popup_playerAudio.volume = 0.3;

      // audio 태그가 로드되고 나서 비동기로 오디오 총 재생시간 minute : second 형태로 포맷
      setTimeout(() => {
        popup_playDuration.textContent = audioPlayTime_Format(
          popup_playerAudio.duration,
        );

        // 현재 재생 상태를 나타내는 range input의 max 최대치를 총 재생시간으로 설정
        popup_musicSeekBar.max = popup_playerAudio.duration;

        // 로컬스토리지에 저장되어있던 재생시간으로 오디오 재생시간 조정
        if (current_beforeTime) {
          popup_playerAudio.currentTime = current_beforeTime;
          popup_playCurrentTime.innerHTML =
            audioPlayTime_Format(current_beforeTime);
          popup_musicSeekBar.value = current_beforeTime;
        }
      }, 1000);
    } else {
      popup_playerTitle.textContent = '곡을 선택해주세요';
    }
  } else {
    // 팝업창을 닫을 때, 재생중이던 곡의 currentTime 값을 로컬 스토리지에 저장
    localStorage.setItem('audio_currentTime', popup_playerAudio.currentTime);
  }
});

// range input을 클릭하여 onChange 이벤트 발생 시 현재 시간을 range value값으로 변경
popup_musicSeekBar.addEventListener('change', () => {
  popup_playerAudio.currentTime = popup_musicSeekBar.value;
});

// playList popup -> music-player 음악 컨트롤 재생 버튼
const popup_playButton = document.querySelector('.play-btn');

popup_playButton.addEventListener('click', () => {
  // 재생 버튼이 pause class toggle 상태일때 클릭 시 이벤트 실행
  if (popup_playButton.className.includes('pause')) {
    popup_playerAudio.play();
    /*  5초마다 현재 재생중인 오디오의 재생시간을 range input value값으로 업데이트
    및 currentTime text 업데이트 */
    const audioPlay_realTime = setInterval(() => {
      popup_musicSeekBar.value = popup_playerAudio.currentTime;
      popup_playCurrentTime.innerHTML = audioPlayTime_Format(
        popup_playerAudio.currentTime,
      );

      // 총 재생 시간과 현재 재생중인 재생시간이 일치할 시 setinterval 함수 clear
      if (popup_playerAudio.currentTime == popup_playerAudio.duration) {
        clearInterval(audioPlay_realTime);
        popup_playerDisk.classList.remove('play');
        popup_playButton.classList.toggle('pause');

        // 다시 0초로 세팅 및 range input 초기상태로 되돌리기
        popup_playerAudio.currentTime = 0;
        popup_musicSeekBar.value = popup_playerAudio.currentTime;
        popup_playCurrentTime.innerHTML = audioPlayTime_Format(
          popup_playerAudio.currentTime,
        );
      }
    }, 500);
  } else {
    popup_playerAudio.pause();
  }

  popup_playButton.classList.toggle('pause');
  popup_playerDisk.classList.toggle('play');
});

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
    title: '이 곡 삭제하기',
    class: 'delete_playList',
    icon: trashIcon,
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

track_items.forEach((item, i) => {
  const addPlayList_option = document.querySelector(
    `.track-item:nth-child(${i + 1}) > .option-menu > ul > .add_playList`,
  );

  const deletePlayList_option = document.querySelector(
    `.track-item:nth-child(${i + 1}) > .option-menu > ul > .delete_playList`,
  );

  addPlayList_option.addEventListener('click', async () => {
    const track_id = current_albumData.tracks.items[i].id;
    const play_list = [localStorage.getItem('play_list')];

    const find_duplicate = play_list.find((id) => id === track_id);

    if (find_duplicate === undefined) {
      play_list.push(track_id);
      const filterEmpty = play_list.filter((id) => id !== '');
      localStorage.setItem('play_list', filterEmpty);
      alert('플레이리스트에 추가되었습니다.');
      localStorage.setItem('current_play', track_id);

      /* 사용자가 선택한 곡(current_play)이 업데이트 될 시
      곡 데이터를 fetching하여 데이터 속성값으로 header영역 current music player 화면 구현  */
      const current_play = localStorage.getItem('current_play');
      const currentMusic_data = await getTrackData(current_play);

      currentMusic_image.src = currentMusic_data.album.images[0].url;
      currentMusic_image.style.opacity = 1;

      currentMusic_title.textContent = currentMusic_data.name;
      currentMusic_artist.textContent = currentMusic_data.artists[0].name;

      localStorage.setItem('audio_currentTime', 0);
    }

    track_optionMenu.forEach((menu) => {
      menu.classList.remove('active');
    });
  });

  deletePlayList_option.addEventListener('click', () => {
    const track_id = current_albumData.tracks.items[i].id;
    const play_list = localStorage.getItem('play_list').split(',');
    const find_duplicate = play_list.filter((id) => id === track_id);

    if (find_duplicate.length === 0) {
      alert('플레이리스트에 존재하지 않는 곡입니다.');
    } else {
      const filter_playList = play_list.filter((id) => id !== track_id);
      localStorage.setItem('play_list', filter_playList);
      alert('플레이리스트에서 정상적으로 삭제되었습니다.');
    }

    track_optionMenu.forEach((menu) => {
      menu.classList.remove('active');
    });
  });
});
