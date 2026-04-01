/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://www.seagate.com/
 * Selector: .ContentLayoutCarousel
 *
 * Source DOM:
 *   .ContentLayoutCarousel
 *     > .ContentLayoutCarousel-backgroundContainer > swiper > slide > .ContentLayoutCarousel-background > img
 *     > .ContentLayoutCarousel-maxScreenContainer > .ContentLayoutCarousel-contentPanelContainer
 *       > .ContentLayoutCarousel-contentPanel > swiper > .swiper-slide
 *         > .swiper-slide-body > .swiper-slide-content > h2, .copy, a.Button
 *
 * Hero library: 1 row [image | heading + description + CTA].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find background image using multiple strategies
  let bgImg = null;

  // Strategy 1: Direct background container query
  const bgContainer = element.querySelector('[class*="backgroundContainer"]');
  if (bgContainer) {
    bgImg = bgContainer.querySelector('img');
  }

  // Strategy 2: Look for background class images
  if (!bgImg) {
    const bgDiv = element.querySelector('[class*="ContentLayoutCarousel-background"]');
    if (bgDiv && bgDiv.querySelector) {
      bgImg = bgDiv.querySelector('img');
    }
  }

  // Strategy 3: Find images not in buttons or content panels
  if (!bgImg) {
    const imgs = element.querySelectorAll('img');
    for (const img of imgs) {
      if (img.closest('button')) continue;
      if (img.closest('[class*="contentPanel"]')) continue;
      if (img.closest('[class*="navArrow"]')) continue;
      const src = (img.getAttribute('src') || '');
      if (src.includes('arrow') || src.includes('icon') || src.startsWith('data:')) continue;
      bgImg = img;
      break;
    }
  }

  // Find content from non-duplicate slide
  let contentSlide = null;
  const slides = element.querySelectorAll('.swiper-slide');
  for (const slide of slides) {
    if (slide.classList.contains('swiper-slide-duplicate')) continue;
    if (slide.querySelector('h2, h1, h3')) {
      contentSlide = slide;
      break;
    }
  }

  const contentCell = [];

  if (contentSlide) {
    const heading = contentSlide.querySelector('h1, h2, h3');
    if (heading) contentCell.push(heading);

    const desc = contentSlide.querySelector('.copy, .copy-large');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.push(p);
    }

    const ctas = contentSlide.querySelectorAll('a.Button');
    ctas.forEach((cta) => {
      const arrows = cta.querySelectorAll('i.Button-arrow, .Button-arrow, i');
      arrows.forEach((arrow) => arrow.remove());
      contentCell.push(cta);
    });
  }

  cells.push([bgImg ? [bgImg] : [], contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
