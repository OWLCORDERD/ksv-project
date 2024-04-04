export const List = ({ data }) => {
  const albumImgBox = document.createElement('div');
  const albumImg = document.createElement('img');
  const a = document.createElement('a');
  const span = document.createElement('span');
  const li = document.createElement('li');

  if (li) {
    li.classList.toggle('track-item');
    li.appendChild(albumImgBox);
    albumImgBox.appendChild(albumImg);
    albumImg.src = data.album.images[0].url;
    li.appendChild(a);
    a.innerHTML = data.name;
    li.appendChild(span);
    span.innerHTML = data.artists[0].name;
  }

  return li;
};
