import { fetchWebApi } from './spotifyAPI';

export const getCurrentAlbum = async (album_id) => {
  const res = await fetchWebApi(`v1/albums/${album_id}`, 'GET');

  return res;
};

export const weeklyArtistAlbum = async (artist) => {
  const res = await fetchWebApi(
    `v1/search?q=artist=${artist}&type=album&limit=8`,
    'GET',
  );

  return res.albums;
};
