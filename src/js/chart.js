import gsap, { ScrollTrigger } from 'gsap/all';
import { getArtists, getWeekArtist } from '../api/artist';
import { getTrackData, weeklyArtistData } from '../api/chart';
import { weeklyArtistAlbum } from '../api/album';
import musicFile from '@/images/svg/dashboard-icon/music-file.svg';
import '@/styles/chart.css';
import { Chart } from 'chart.js/auto';
import search from '../api/youtubeAPI';

gsap.registerPlugin(ScrollTrigger);

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

// 차트 200위 데이터중 출현 횟수가 많은 주간 아티스트 top10 선별
const top10_weeklyArtist = await weeklyArtistData();

// 차트 설정 labels에 추가 될 아티스트 이름
const artistLabels = [];

//차트 data에 추가 될 아티스트의 출현 횟수
const trackCounts = [];

top10_weeklyArtist.forEach((artist) => {
  artistLabels.push(artist.name);
});

top10_weeklyArtist.forEach((artist) => {
  trackCounts.push(artist.counts);
});

/* 주간 1위 아티스트 이름 부모 요소 */
const weeklyArtist_container = document.querySelector(
  '.artist-wrap > .artist-name',
);

/* 주간 1위 아티스트 이름 node 생성 */
const weeklyArtist_name = document.createElement('span');

/* innerHtml로 출현 횟수가 가장 많은 아티스트의 이름 문자열 추가 */
weeklyArtist_name.innerHTML += artistLabels[0];

/* 주간 1위 아티스트 이름 부모 요소에 자식 요소로 추가 */
weeklyArtist_container.appendChild(weeklyArtist_name);

/*주간 차트 대시보드의 데이터 영역 곡 출현 횟수 부모 요소 */
const countTrack_container = document.querySelector('.count-wrap > .count');

/* 곡 출현 횟수 node 생성 */
const artist_trackCount = document.createElement('span');

/* innerHtml로 곡 출현 횟수 문자열 추가 */
artist_trackCount.innerHTML += trackCounts[0];

/* 곡 출현 횟수 부모 요소에 자식 요소로 추가 */
countTrack_container.appendChild(artist_trackCount);

/*chart graph 영역 canvas 요소 id */
const chartGraph = document.querySelector('#myChart');

/* 차트 데이터 설정 객체 */
const data = {
  labels: artistLabels,
  datasets: [
    {
      label: '금주 차트인 상위 아티스트 곡 갯수',
      data: trackCounts,
      backgroundColor: ['#fff'],
    },
  ],
};

/* 차트 그래프 설정 객체 */
const config = {
  type: 'bar',
  data: data,
  options: {
    scales: {
      y: {
        grid: {
          color: '#fff',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
            family: 'SEBANG_Regular',
          },
        },
      },
      x: {
        grid: {
          color: 'transparent',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 14,
            family: 'SEBANG_Regular',
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
            family: 'SEBANG_Regular',
            color: '#fff',
          },
        },
      },
    },
    responsive: true,
  },
};

/* 차트 그래프 생성 중에 사용자에게 보여지는 로딩 스켈레톤 UI 영역 */
const chartGraph_skeleton = document.querySelector(
  '.weeklyChart-graph > .skeleton-loading',
);
/* new 키워드 생성자에 canvas 요소와 설정 객체를 파라미터로 보내서 차트 그래프 생성 */
new Chart(chartGraph, config);
Chart.defaults.color = '#fff';

/* 차트 생성이 완료되면 스켈레톤 요소 삭제 */
chartGraph_skeleton.remove();

/* 주간 1위 아티스트 이름과 곡 카운트 영역을 생성하는 작업 이후
style 속성 부여 */
weeklyArtist_name.style.top = 0;
artist_trackCount.style.top = 0;

/* 주간 아티스트의 차트인 곡 데이터 배열 */
const weeklyChart_1st = await getTrackData(top10_weeklyArtist[0].track_id);

const artistIds = [`${weeklyChart_1st.artists[0].id}`];

/* 주간 아티스트 정보 데이터 요청 */
const weekly1st_artist = await getArtists({
  artistIds,
});

/* 주간 아티스트 이미지 부모 영역  */
const weeklyArtist_imageBox = document.querySelector('.weeklyArtist-imgBox');

/* 주간 아티스트 이미지 로딩 스켈레톤 UI 영역 */
const weeklyArtistImg_skeleton = document.querySelector(
  '.weeklyArtist-imgBox > .skeleton-loading',
);

/* 주간 아티스트 데이터의 images url 속성으로 이미지 노드 생성  */
const weeklyArtist_image = document.createElement('img');
weeklyArtist_image.src = weekly1st_artist.images[0].url;

/* 주간 아티스트 이미지 부모 영역에 자식 이미지 노드 추가  */
weeklyArtist_imageBox.appendChild(weeklyArtist_image);

/* 주간 아티스트 이미지 로드 완료 후 스켈레톤 UI 제거 */
weeklyArtistImg_skeleton.remove();

const weeklyArtist_title = document.querySelector('.weeklyArtist-title > h1');

weeklyArtist_title.textContent = `${weekly1st_artist.name} 아티스트 앨범`;

const weeklyArtist_albumData = await weeklyArtistAlbum(
  weeklyChart_1st.artists[0].id,
);

const album_list = weeklyArtist_albumData.items;

const albumList_container = document.querySelector('.album-list');
const albumList_skeleton = document.querySelector(
  '.weeklyArtist-album > .albums-loading',
);

album_list.forEach((album) => {
  const album_item = document.createElement('a');
  album_item.classList.toggle('album-item');
  album_item.href = `album.html?id=${album.id}`;

  /* 앨범 이미지 영역 생성 */
  const album_imageBox = document.createElement('div');
  album_imageBox.classList.toggle('album-image');

  /* 앨범 이미지 자식 노드 생성 */
  const album_image = document.createElement('img');
  album_image.src = album.images[0].url;
  album_image.alt = `${album.name} 앨범 이미지`;
  album_imageBox.appendChild(album_image);

  album_item.appendChild(album_imageBox);

  /* 앨범 제목 및 발매일 노드 생성 */
  const album_info = document.createElement('div');
  album_info.classList.toggle('album-info');

  const album_name = document.createElement('h2');
  album_name.classList.toggle('album-title');

  album_name.innerHTML += album.name;

  const release_date = document.createElement('span');
  release_date.classList.toggle('release-date');

  release_date.innerHTML += album.release_date;

  album_info.appendChild(album_name);
  album_info.appendChild(release_date);
  album_item.appendChild(album_info);
  /* 앨범 아이템 노드 부모 영역에 appendChild */
  albumList_container.appendChild(album_item);

  albumList_skeleton.remove();
});

const header = document.querySelector('header');
const body = document.querySelector('body');

gsap.to(header, {
  backgroundColor: '#000',

  scrollTrigger: {
    trigger: body,
    top: '5% top',
    end: '10% top',
    scrub: 1,
  },
});

/* 주간 아티스트를 선정하여 아티스트의 spotify web api ID값으로
아티스트 데이터 & top track 데이터 총 2개의 더미 데이터를 요청하고 결과를 반환합니다. */
const weekArtist = await getWeekArtist();

/* week-recommend (주간 추천 아티스트 영역) artist info 영역 */
const chart1st_artistName = document.querySelector(
  '.chart1st-artist > .artist-name > h2',
);

const chart1st_artistImg = document.querySelector(
  '.chart1st-artist > .artist-imgBox',
);

const chart1stImg_skeleton = document.querySelector(
  '.chart1st-artist > .artist-imgBox > .skeleton-loading',
);

const chart1stName_skeleton = document.querySelector(
  '.chart1st-artist > .artist-name > .skeleton-loading',
);

/* 결과 더미데이터 중, 0번째 인덱스의 아티스트 데이터에서 name 프로퍼티 추출하여 
artist info 영역에 innerHTML */
if (weekArtist) {
  chart1st_artistName.textContent = weekArtist[0].name;
  /* API에서 가져온 아티스트 이미지를 삽입할 img element 추가 */
  const artistImg = document.createElement('img');
  chart1st_artistImg.appendChild(artistImg);
  /* 0번째 인덱스의 아티스트 데이터 중 높은 화질의 image url 속성값 추출하여 src import */
  artistImg.src = weekArtist[0].images[0].url;
  artistImg.alt = `${weekArtist[0].name} 프로필 이미지`;
  /* 아티스트 이미지, 이름 노드 생성 완료 후 로딩 스켈레톤 UI 제거 */
  chart1stName_skeleton.remove();
  chart1stImg_skeleton.remove();
}

/* 1번째 인덱스의 top track 데이터 중 첫번째 곡을 대표 인기곡으로 선정 */
const weekArtist_topTrack = weekArtist[1].tracks[0];

/* search 비동기 함수 -> 대표 인기곡의 제목을 파라미터 값으로 전송하여
youtube API에 해당 곡을 검색하여 비디오 추출 */
const music_video = await search(weekArtist_topTrack.name);

const topTrack_video = document.querySelector('.topTrack-video');

const topTrack_videoId = music_video[0].id.videoId;

const chart1stInfo_skeleton = document.querySelector(
  '.chart1st-track > .track-info > .skeleton-loading',
);

const topTrackVideo_skeleton = document.querySelector(
  '.chart1st-track > .topTrack-video > .skeleton-loading',
);

if (music_video && topTrack_video) {
  topTrack_video.innerHTML = `
  <iframe
  src="https://www.youtube.com/embed/${topTrack_videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${topTrack_videoId}"
  title="YouTube video player" frameborder="0" allow="accelerometer;
  autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;
  web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
  </iframe>
  `;

  topTrackVideo_skeleton.remove();
}

if (weekArtist_topTrack) {
  /* 주간 아티스트 대표 인기곡 앨범 이미지 element 추가 */
  const topTrack_imgBox = document.querySelector(
    '.chart1st-track > .track-info > .track-img',
  );
  const topTrack_img = document.createElement('img');

  if (topTrack_img) {
    /* 이미지 element에 대표 인기곡 데이터 중 앨범 이미지 경로값 src 속성에 추가 */
    topTrack_img.src = weekArtist_topTrack.album.images[0].url;
    topTrack_img.alt = `${weekArtist_topTrack.album.name} 대표 곡 앨범 이미지`;
    topTrack_imgBox.appendChild(topTrack_img);
  }

  /* 주간 아티스트 대표 인기곡 제목 text 추가 */
  const topTrack_title = document.querySelector(
    '.chart1st-track > .track-info > .track-title > h4',
  );

  if (topTrack_title) {
    topTrack_title.innerText = weekArtist_topTrack.name;
  }

  /* 주간 아티스트 대표 인기곡 앨범 아티스트 이름 text 추가 */
  const topTrack_artist = document.querySelector(
    '.chart1st-track > .track-info > .track-artist > span',
  );

  if (topTrack_artist) {
    topTrack_artist.innerText = weekArtist_topTrack.artists[0].name;
  }

  chart1stInfo_skeleton.remove();
}
