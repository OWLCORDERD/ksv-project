import { fetchWebApi } from './spotifyAPI';

export const getCurrentAlbum = async (album_id) => {
  const res = await fetchWebApi(`v1/albums/${album_id}`, 'GET');

  return res;
};

export const weeklyArtistAlbum = async (artist_id) => {
  const res = await fetchWebApi(
    `v1/artists/${artist_id}/albums?limit=8`,
    'GET',
  );

  return res;
};
