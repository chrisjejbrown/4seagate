export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (!picture) {
    block.classList.add('no-image');
    return;
  }

  // Move picture to be a direct child of the block for absolute positioning
  block.prepend(picture);

  // Move text content out of nested divs into a content wrapper
  const contentDiv = document.createElement('div');
  contentDiv.className = 'hero-banner-content';
  const textElements = block.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  textElements.forEach((el) => contentDiv.append(el));

  // Remove the original row/column structure
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => row.remove());

  // Re-add picture and content wrapper
  block.append(picture);
  block.append(contentDiv);
}
