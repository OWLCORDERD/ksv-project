import gsap, { ScrollTrigger } from 'gsap/all';
import { getArtists, getWeekArtist } from '../api/artist';
import { getChartTrack } from '../api/chart';
import { weeklyArtistAlbum } from '../api/album';
import '@/styles/chart.css';
import { Chart } from 'chart.js/auto';
import search from '../api/youtubeAPI';

gsap.registerPlugin(ScrollTrigger);

/* 주간 차트 곡 데이터 배열 */
const weekly_chartTrack = await getChartTrack();

/* 주간 차트 아티스트 이름 배열 */
const weekly_chartArtist = [];

/* 주간 차트 곡 데이터에서 아티스트 이름 추출 */
weekly_chartTrack.forEach((track) => {
  /* 아티스트 이름 배열에 이름 추가  */
  weekly_chartArtist.push(track.artists[0].name);
});

/* 주간 차트 아티스트 출현 횟수 object */
const counts = {};

/* 주간 차트 출현하는 아티스트 각 출현 횟수 구하기 */
weekly_chartArtist.forEach((x) => {
  counts[x] = (counts[x] || 0) + 1;
});

/* 주간 차트 출현 횟수 많은 아티스트 순으로 정렬하는 배열 */
const sortCounts = [];

/* counts object의 key 값 (아티스트 이름)과 counts(출현 횟수) 값의 object를 생성하여
출현 횟수 기준 내림차순으로 정렬할 배열에 push */
for (let key in counts) {
  sortCounts.push({
    artist: key,
    counts: counts[key],
  });
}

/* sort 메소드를 통해 counts(출현 횟수) 기준으로 정렬 */
sortCounts.sort((a, b) => {
  return b.counts - a.counts;
});

/*출현 횟수가 많은 주간 아티스트 top5 선별 */
const top5_weeklyArtist = sortCounts.slice(0, 5);

/* 차트 설정 labels에 추가 될 아티스트 이름 */
const artistLabels = [];

/* 차트 data에 추가 될 아티스트의 출현 횟수 */
const trackCounts = [];

top5_weeklyArtist.forEach((count) => {
  artistLabels.push(count.artist);
});

top5_weeklyArtist.forEach((count) => {
  trackCounts.push(count.counts);
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
      label: '6.21 - 6.27 chart top 5',
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
            size: 12,
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
          fontSize: 30,
          font: {
            size: 12,
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
          },
        },
      },
    },
    responsive: true,
  },
};

/* new 키워드 생성자에 canvas 요소와 설정 객체를 파라미터로 보내서 차트 그래프 생성 */
new Chart(chartGraph, config);

Chart.defaults.color = '#fff';

/* 주간 1위 아티스트 이름과 곡 카운트 영역을 생성하는 작업 이후
style 속성 부여 */
weeklyArtist_name.style.top = 0;
artist_trackCount.style.top = 0;

/* 주간 아티스트의 차트인 곡 데이터 배열 */
const weekly1stArtist_track = [];

/* 주간 차트 곡 데이터 배열에서 각 object의 artists 배열에서 name 속성값을
1위 아티스트 이름과 비교하여 아티스트의 차트인 곡들을 추출 */
weekly_chartTrack.forEach((track) => {
  if (track.artists[0].name === artistLabels[0]) {
    weekly1stArtist_track.push(track);
  }
});

const artistIds = [`${weekly1stArtist_track[0].artists[0].id}`];

/* 주간 아티스트 정보 데이터 요청 */
const weekly1st_artist = await getArtists({
  artistIds,
});

/* 주간 아티스트 이미지 부모 영역  */
const weeklyArtist_imageBox = document.querySelector('.weeklyArtist-imgBox');

/* 주간 아티스트 데이터의 images url 속성으로 이미지 노드 생성  */
const weeklyArtist_image = document.createElement('img');
weeklyArtist_image.src = weekly1st_artist.images[0].url;

/* 주간 아티스트 이미지 부모 영역에 자식 이미지 노드 추가  */
weeklyArtist_imageBox.appendChild(weeklyArtist_image);

const weeklyArtist_title = document.querySelector('.weeklyArtist-title > h1');

weeklyArtist_title.textContent = `${weekly1st_artist.name} 아티스트 앨범`;

const weeklyArtist_albumData = await weeklyArtistAlbum(artistLabels[0]);

const album_list = weeklyArtist_albumData.items;

const albumList_container = document.querySelector('.album-list');
const skeleton_container = document.querySelector('.skeleton-loading');

album_list.forEach((album) => {
  skeleton_container.remove();
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
}
