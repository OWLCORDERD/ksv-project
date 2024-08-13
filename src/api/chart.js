import { fetchWebApi } from './spotifyAPI';
import chart0725 from '../chartData/chart_0725.json';

// 차트 데이터 응답 값 저장 배열 (spotify chart의 k-pop 차트 200위 데이터)
const spotifyChartDB = [];

// 차트 1위 ~ 200위 아티스트 이름 배열
const chartArtists = [];

/* 
차트 랭킹 데이터 속성 값들을 배열에 저장
** 저장 시 데이터 필드 값중 uri 문자열의 곡 id 값을 추출하는 로직 추가 **
*/
chart0725.forEach((chartDoc) => {
  // json 데이터 배열 각 객체의 필요한 데이터만 추출
  const doc = {
    artist_names: chartDoc.artist_names,
    rank: chartDoc.rank,
    track_name: chartDoc.track_name,
    uri: chartDoc.uri,
  };

  /* uri 문자열 split 메소드로 배열로 변경 */
  const uriParse = doc.uri.split('');

  /* 배열을 splice 속성을 통해 track id 부분만 잘라내서 문자열로 합치기 */
  const findTrackId = uriParse.splice(14).join('');

  /* 문서 필드 객체에 uri -> trackId 값으로 변경 후 차트 데이터 저장 배열에 push */
  const includeTrackIdData = {
    artist_names: doc.artist_names,
    rank: doc.rank,
    track_name: doc.track_name,
    track_id: findTrackId,
  };

  spotifyChartDB.push(includeTrackIdData);
});

/* 차트 데이터 아티스트 이름 배열 업데이트 */
spotifyChartDB.forEach((data) => {
  chartArtists.push(data.artist_names);
});

/* 오름차순 정렬을 위한 배열을 만들기 위해 counts 객체 생성 */
const counts = {};

/* 주간 차트 출현하는 아티스트 각 출현 횟수 구하기 */
chartArtists.forEach((x) => {
  counts[x] = (counts[x] || 0) + 1;
});

/* 오름차순 정렬 아티스트 출연 횟수 데이터 배열 */
const chartArtistCounts = [];

for (let key in counts) {
  const currentArtist = spotifyChartDB.find(
    (chart) => chart.artist_names === key,
  );
  const findTrackId = currentArtist.track_id;
  chartArtistCounts.push({
    name: key,
    counts: counts[key],
    track_id: findTrackId,
  });
}

/* sort 메소드를 통해 counts(출현 횟수) 기준으로 정렬 */
chartArtistCounts.sort((a, b) => {
  return b.counts - a.counts;
});

/* 추출한 음반 id 값들을 /tracks route -> query parameter 값으로 전송하여 곡 정보 추출 */
export const getChartTrack = async (page) => {
  const trackIdArray = spotifyChartDB.map((track) => {
    return track.track_id;
  });

  const tracksRank = spotifyChartDB.map((track) => {
    return track.rank;
  });
  const maxPageDataLength = 10;
  let lastIndex = page * maxPageDataLength;
  let firstIndex = lastIndex - maxPageDataLength;

  const fetchIdArray = page
    ? trackIdArray.slice(firstIndex, lastIndex).join(',')
    : trackIdArray.slice(0, 10).join(',');

  const currentPage_Rank = tracksRank.slice(firstIndex, lastIndex);
  const res = await fetchWebApi(`v1/tracks?ids=${fetchIdArray}`, 'GET');

  return {
    tracks: res.tracks,
    ranks: currentPage_Rank,
  };
};

export const getTrackData = async (track_id) => {
  const res = await fetchWebApi(`v1/tracks/${track_id}`, 'GET');

  return res;
};

/* 출연 횟수 순으로 정렬시킨 배열에서 10위까지 추출하여 클라이언트로 return */
export const weeklyArtistData = async () => {
  const top10_artists = chartArtistCounts.slice(0, 10);
  const top10_tracks = top10_artists.map((artist) => {
    return artist.track_id;
  });

  /* 한글 지원이 안되는 spotify chart 아티스트 이름 영문 데이터
  -> track id 한글로 변경*/
  const res = await fetchWebApi(`v1/tracks?ids=${top10_tracks}`, 'GET');

  res.tracks.forEach((track, i) => {
    top10_artists[i].name = track.artists[0].name;
  });

  return top10_artists;
};
