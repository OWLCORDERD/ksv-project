const tokenUrl = 'https://accounts.spotify.com/api/token';

export async function accessToken() {
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        btoa(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET,
        ),
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    new Error('not connect to tokenUrl & not found client ID and Secret key');
  }

  const data = await res.json();

  return data.access_token;
}
