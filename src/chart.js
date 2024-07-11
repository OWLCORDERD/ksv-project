import { getArtists } from './api/artist';
import { getArtistAlbum, getChartTrack } from './api/chart';
import './styles/chart.css';
import { Chart } from 'chart.js/auto';

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
const weekly1st_artist = await getArtists({ artistIds });

/* 주간 아티스트 이미지 부모 영역  */
const weeklyArtist_imageBox = document.querySelector('.weeklyArtist-imgBox');

/* 주간 아티스트 데이터의 images url 속성으로 이미지 노드 생성  */
const weeklyArtist_image = document.createElement('img');
weeklyArtist_image.src = weekly1st_artist.images[0].url;

/* 주간 아티스트 이미지 부모 영역에 자식 이미지 노드 추가  */
weeklyArtist_imageBox.appendChild(weeklyArtist_image);

const weeklyArtist_title = document.querySelector('.weeklyArtist-title > h1');

weeklyArtist_title.innerHTML += `${weekly1st_artist.name} 아티스트 앨범`;

const artist = artistLabels[0];

const weeklyArtist_album = await getArtistAlbum({ artist });
