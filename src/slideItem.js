export const slideItem = (data) => {
  const track_item = document.createElement('div');
  const track_imgBox = document.createElement('div');
  const track_img = document.createElement('img');
  const track_title = document.createElement('h2');
  const track_artist = document.createElement('p');

  track_item.classList.toggle('track-item');
  track_item.appendChild(track_imgBox);
  track_imgBox.classList.toggle('track-img');
  track_imgBox.appendChild(track_img);
  track_img.src = data.album.images[0].url;
  track_item.appendChild(track_title);
  track_item.appendChild(track_artist);
  track_title.textContent = data.name;
  track_artist.textContent = data.album.artists[0].name;

  return track_item;
};
