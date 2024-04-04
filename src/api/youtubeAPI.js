export default async function search(query) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';

  const params = {
    q: query,
    part: 'snippet',
    type: 'video',
    key: process.env.YOUTUBE_API_KEY,
  };

  const queryString = new URLSearchParams(params).toString();

  const reqURL = `${searchURL}?${queryString}`;

  const res = await fetch(reqURL);
  if (res.ok) {
    const data = await res.json();

    return data.items;
  }
}
