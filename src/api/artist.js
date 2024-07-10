import { getChartTrack } from './chart';
import { fetchWebApi } from './spotifyAPI';

const artistIds = [
  '3HqSLMAZ3g3d5poNaI7GOU',
  '3qNVuliS40BLgXGxhdBdqu',
  '5dCvSnVduaFleCnyy98JMo',
  '6UbmqUEgjLA6jAcXwbM1Z9',
  '6dhfy4ByARPJdPtMyrUYJK',
  '6qvVoPGEqNCyYSjYCgfV1v',
  '7c1HgFDe8ogy5NOZ1ANCJQ',
  '0kRAVpQhUUArA8UnYwEdeZ',
  '6zn0ihyAApAYV51zpXxdEp',
];

const weekTrackChart = await getChartTrack();

const weekArtist = weekTrackChart[0].artists[0].id;

export const getArtists = async () => {
  const ksvArtistList = [];

  for (let i = 0; i < artistIds.length; i++) {
    const res = await fetchWebApi(`v1/artists/${artistIds[i]}`, 'GET');

    ksvArtistList.push(res);
  }

  return ksvArtistList;
};

export const getWeekArtist = async () => {
  const artistData = [];

  const artist = await fetchWebApi(`v1/artists/${weekArtist}`, 'GET');

  artistData.push(artist);

  if (artist) {
    const track = await fetchWebApi(
      `v1/artists/${weekArtist}/top-tracks`,
      'GET',
    );

    artistData.push(track);
  }

  return artistData;
};
