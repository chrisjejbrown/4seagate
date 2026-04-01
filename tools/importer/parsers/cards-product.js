/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product variant.
 * Base block: cards
 * Source: https://www.seagate.com/
 * Selector: .CardLayoutFeaturedProducts
 *
 * Source DOM structure:
 *   .CardLayoutFeaturedProducts > .Container
 *     > .CardLayoutFeaturedProducts-heading > h2 (heading)
 *     > .CardLayoutFeaturedProducts-cards
 *       > a.CardLayoutFeaturedProducts-card.card--product (product cards)
 *         > .card-img > img
 *         > .card-img > .card-tagNames > .card-tagName (tags)
 *         > p.card-name (product name)
 *         > p.card-capacity > .value (capacity)
 *         > p.card-price > .value (price)
 *       > div.CardLayoutFeaturedProducts-card.card--promo (promo card)
 *
 * Cards library: 2 columns per row. Col1=image, Col2=text content.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all product cards (both product and promo types)
  const productCards = element.querySelectorAll('.CardLayoutFeaturedProducts-card');

  productCards.forEach((card) => {
    const isPromo = card.classList.contains('card--promo');

    // First cell: image
    const img = card.querySelector('.card-img > img, .card-img img');

    // Second cell: text content
    const contentCell = [];

    if (isPromo) {
      // Promo card: title with link
      const promoLink = card.querySelector('.card-title a, a');
      if (promoLink) {
        const h3 = document.createElement('h3');
        const link = document.createElement('a');
        link.href = promoLink.href;
        link.textContent = promoLink.textContent.trim();
        h3.appendChild(link);
        contentCell.push(h3);
      }
    } else {
      // Product card: name, capacity, price, tags
      const name = card.querySelector('.card-name');
      if (name) {
        const h3 = document.createElement('h3');
        if (card.href) {
          const link = document.createElement('a');
          link.href = card.href;
          link.textContent = name.textContent.trim();
          h3.appendChild(link);
        } else {
          h3.textContent = name.textContent.trim();
        }
        contentCell.push(h3);
      }

      const capacity = card.querySelector('.card-capacity .value');
      if (capacity) {
        const capP = document.createElement('p');
        capP.textContent = capacity.textContent.trim();
        contentCell.push(capP);
      }

      const priceLabel = card.querySelector('.card-price .label');
      const priceValue = card.querySelector('.card-price .value');
      if (priceValue) {
        const priceP = document.createElement('p');
        priceP.textContent = (priceLabel ? priceLabel.textContent.trim() + ' ' : '') + priceValue.textContent.trim();
        contentCell.push(priceP);
      }

      // Tags (e.g., "World Backup Day", "Exclusive Discount")
      const tags = card.querySelectorAll('.card-tagName');
      if (tags.length > 0) {
        const tagP = document.createElement('p');
        tagP.textContent = Array.from(tags).map((t) => t.textContent.trim()).join(', ');
        contentCell.push(tagP);
      }
    }

    cells.push([img ? [img] : [], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
