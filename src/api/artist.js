import { getChartTrack } from './chart';
import { fetchWebApi } from './spotifyAPI';

const weekTrackChart = await getChartTrack();

const weekArtist = weekTrackChart[0].artists[0].id;

export const getArtists = async ({ artistIds }) => {
  const ksvArtistList = [];

  if (artistIds.length > 1) {
    for (let i = 0; i < artistIds.length; i++) {
      const res = await fetchWebApi(`v1/artists/${artistIds[i]}`, 'GET');

      ksvArtistList.push(res);
    }
    return ksvArtistList;
  } else {
    const res = await fetchWebApi(`v1/artists/${artistIds[0]}`, 'GET');

    return res;
  }
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
