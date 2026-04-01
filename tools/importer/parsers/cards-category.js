/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category variant.
 * Base block: cards
 * Source: https://www.seagate.com/
 * Selector: .CardLayoutAllProducts
 *
 * Source DOM structure:
 *   .CardLayoutAllProducts > .CardLayoutCarousel
 *     > .CardLayoutCarousel-headingPanel > h2 (heading)
 *     > .CardLayoutCarousel-headingPanel > .CardLayoutCarousel-buttonsContainer > a.Button (See More CTA)
 *     > .CardLayoutCarousel-contentPanel > .swiper-container > .swiper-wrapper
 *       > .swiper-slide > a.slide-link
 *         > .slide-image > img
 *         > h3.slide-title
 *
 * Cards library: 2 columns per row. Col1=image, Col2=text content.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all category slides
  const slides = element.querySelectorAll('.swiper-slide');

  slides.forEach((slide) => {
    const link = slide.querySelector('a.slide-link');
    if (!link) return;

    // First cell: category image
    const img = slide.querySelector('.slide-image img');

    // Second cell: category title as linked heading
    const contentCell = [];
    const title = slide.querySelector('.slide-title, h3');
    if (title) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title.textContent.trim();
      h3.appendChild(a);
      contentCell.push(h3);
    }

    cells.push([img ? [img] : [], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
