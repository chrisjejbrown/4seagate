/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resource variant.
 * Base block: cards
 * Source: https://www.seagate.com/
 * Selectors: .CardLayout.CardLayout-bg--black, .CardLayout.CardLayout-bg--white
 *
 * Source DOM structure:
 *   .CardLayout > .CardLayout-heading > h2 (heading, may be empty)
 *   .CardLayout > ul.CardLayout-cards
 *     > li.CardLayout-card > a
 *       > .card-eyebrow (category tag)
 *       > .card-thumb > picture > img (thumbnail)
 *       > .card-title (title with arrow icon)
 *       > p.card-body (description)
 *
 * Cards library: 2 columns per row. Col1=image, Col2=text content.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all cards
  const cards = element.querySelectorAll('.CardLayout-card');

  cards.forEach((card) => {
    const link = card.querySelector('a');
    if (!link) return;

    // First cell: thumbnail image
    const img = card.querySelector('.card-thumb img');

    // Second cell: eyebrow + linked title + description
    const contentCell = [];

    // Eyebrow/category tag
    const eyebrow = card.querySelector('.card-eyebrow');
    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = eyebrow.textContent.trim();
      eyebrowP.appendChild(em);
      contentCell.push(eyebrowP);
    }

    // Title as linked heading (clean up arrow icons)
    const title = card.querySelector('.card-title');
    if (title) {
      // Get clean text without arrow icons
      const arrows = title.querySelectorAll('i.Button-arrow, .Button-arrow');
      arrows.forEach((arrow) => arrow.remove());

      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title.textContent.trim();
      h3.appendChild(a);
      contentCell.push(h3);
    }

    // Description
    const body = card.querySelector('.card-body');
    if (body) {
      const p = document.createElement('p');
      p.textContent = body.textContent.trim();
      contentCell.push(p);
    }

    cells.push([img ? [img] : [], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
