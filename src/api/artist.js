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

const weekArtistId = '3HqSLMAZ3g3d5poNaI7GOU';

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

  const artist = await fetchWebApi(`v1/artists/${weekArtistId}`, 'GET');

  artistData.push(artist);

  if (artist) {
    const track = await fetchWebApi(
      `v1/artists/${weekArtistId}/top-tracks`,
      'GET',
    );

    artistData.push(track);
  }

  return artistData;
};

export const example = async () => {
  const res = await fetchWebApi(
    'v1/search?query=country%3Dkorea%26date%3Dlatest%26recurrence%3Ddaily&type=track&locale=ko-KR%2Cko%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7&offset=0&limit=20',
    'GET',
  );

  return res;
};
