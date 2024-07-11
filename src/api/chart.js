import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { fetchWebApi } from './spotifyAPI';

const endPoint = collection(db, 'chart');

/* 차트 데이터가 저장된 firestore의 chart collection에서 랭킹 오름차순으로 데이터 요청 */
const getChartData = await getDocs(query(endPoint, orderBy('rank', 'asc')));

/* 차트 데이터 배열 (spotify chart의 k-pop 차트 200위 데이터)*/
const chartData = [];

/* 차트 track 곡 데이터 배열 (곡 이미지와 상세정보 데이터) */
const chartTrackData = [];

/* firestore에서 응답받은 문서들의 데이터 속성 값들을 배열에 저장 */
getChartData.forEach((chartDoc) => {
  const doc = {
    artist_names: chartDoc.data()['artist_names'],
    rank: chartDoc.data()['rank'],
    track_name: chartDoc.data()['track_name'],
    uri: chartDoc.data()['uri'],
  };

  chartData.push(doc);
});

/* 차트 데이터 속성값 중 uri 문자열 값에서 track id 추출 */
chartData.forEach((chart) => {
  /* uri 문자열 split 메소드로 배열로 변경 */
  const uriParse = chart.uri.split('');

  /* 배열을 splice 속성을 통해 track id 부분만 잘라내서 문자열로 합치기 */
  const findTrackId = uriParse.splice(14).join('');

  /* 객체에 uri -> trackId 값으로 변경 후 차트 track 곡 데이터 배열에 push */
  const includeTrackIdData = {
    artist_names: chart.artist_names,
    rank: chart.rank,
    track_name: chart.track_name,
    id: findTrackId,
  };

  chartTrackData.push(includeTrackIdData);
});

/* 추출한 음반 id 값들을 /tracks route -> query parameter 값으로 전송하여 곡 정보 추출 */
export const getChartTrack = async () => {
  const trackIdArray = chartTrackData.map((track) => {
    return track.id;
  });

  const fetchIdArray = trackIdArray.slice(0, 50).join(',');

  const res = await fetchWebApi(`v1/tracks?ids=${fetchIdArray}`, 'GET');

  return res.tracks;
};

export const getArtistAlbum = async ({ artist }) => {
  const res = fetchWebApi(
    `v1/search?q=artist=${artist}&type=album&limit=8`,
    'GET',
  );

  console.log(res);
};
