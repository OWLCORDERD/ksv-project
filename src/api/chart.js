import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { fetchWebApi } from './spotifyAPI';

const endPoint = collection(db, 'chart');

const getChartData = await getDocs(query(endPoint, orderBy('rank', 'asc')));

const defaultChartData = [];
const chartTrackData = [];

getChartData.forEach((chartDoc) => {
  const doc = {
    artist_names: chartDoc.data()['artist_names'],
    rank: chartDoc.data()['rank'],
    track_name: chartDoc.data()['track_name'],
    uri: chartDoc.data()['uri'],
  };

  defaultChartData.push(doc);
});

defaultChartData.forEach((chart) => {
  const uriParse = chart.uri.split('');

  const findTrackId = uriParse.splice(14).join('');

  const includeTrackIdData = {
    artist_names: chart.artist_names,
    rank: chart.rank,
    track_name: chart.track_name,
    id: findTrackId,
  };

  chartTrackData.push(includeTrackIdData);
});

export const findChartTrack = async () => {
  const trackIdArray = chartTrackData.map((track) => {
    return track.id;
  });

  const fetchIdArray = trackIdArray.slice(0, 50).join(',');

  const res = await fetchWebApi(`v1/tracks?ids=${fetchIdArray}`, 'GET');

  return res.tracks;
};
