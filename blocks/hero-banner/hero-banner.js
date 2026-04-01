export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.querySelectorAll(':scope > div')];
  const pictureCol = cols[0];
  const textCol = cols[1];

  const picture = pictureCol?.querySelector('picture');
  if (picture) {
    // Move picture to be a direct child for absolute positioning
    block.prepend(picture);
    // Ensure eager loading for below-fold background images
    const img = picture.querySelector('img');
    if (img) img.loading = 'eager';
  } else {
    block.classList.add('no-image');
    return;
  }

  // Create content wrapper from text column
  if (textCol) {
    const content = document.createElement('div');
    content.classList.add('hero-banner-content');
    while (textCol.firstChild) {
      content.appendChild(textCol.firstChild);
    }
    block.appendChild(content);
  }

  // Remove original row structure
  row.remove();
}
