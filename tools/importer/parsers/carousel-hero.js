/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero variant.
 * Base block: carousel
 * Source: https://www.seagate.com/
 * Selector: .FeatureContentLayoutCarousel
 *
 * Source DOM structure:
 *   .FeatureContentLayoutCarousel > .FeatureContentLayoutCarousel-backgroundContainer
 *     > .swiper-container > .swiper-wrapper > .swiper-slide
 *       > .FeatureContentLayoutSimple (each slide)
 *         > .FeatureContentLayoutSimple-background img (bg image)
 *         > .FeatureContentLayoutSimple-contentContainer
 *           > .FeatureContentLayoutSimple-copyContainer
 *             > .FeatureContentLayoutSimple-eyebrow (eyebrow)
 *             > h1 (heading)
 *             > p.copy (description)
 *             > .FeatureContentLayoutSimple--buttongroup a.Button (CTA)
 *           > .FeatureContentLayoutSimple-imageContainer img (foreground image)
 *
 * Model: carousel-hero-item (xwalk)
 *   Field groups → columns:
 *     Col0: Item type name "Carousel Hero Slide"
 *     Col1: media group (media_image + media_imageAlt) → product/foreground image
 *     Col2: content group (content_text) → richtext (eyebrow, heading, desc, CTA)
 *
 * Skip duplicate slides (.swiper-slide-duplicate).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all non-duplicate slides
  const slides = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) > .FeatureContentLayoutSimple');

  slides.forEach((slide) => {
    // Col0: Item type name (xwalk convention for block items)
    const itemType = 'Carousel Hero Slide';

    // Col1: media group — foreground product image (maps to media_image + media_imageAlt)
    const fgImg = slide.querySelector('.FeatureContentLayoutSimple-imageContainer img, .FeatureContentLayoutSimple-logoContainer img');
    // Fallback to background image if no foreground image
    const bgImg = slide.querySelector('.FeatureContentLayoutSimple-background-large img, .FeatureContentLayoutSimple-background img');
    const mediaImg = fgImg || bgImg;
    const mediaCell = mediaImg ? [mediaImg] : [];

    // Col2: content group — richtext (maps to content_text)
    const contentCell = [];

    // Eyebrow text
    const eyebrow = slide.querySelector('.FeatureContentLayoutSimple-eyebrow, .Eyebrow');
    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      contentCell.push(eyebrowEl);
    }

    // Heading
    const heading = slide.querySelector('h1, h2, h3');
    if (heading) contentCell.push(heading);

    // Description paragraph
    const desc = slide.querySelector('p.copy, .FeatureContentLayoutSimple-copyContainer > p:not(.Eyebrow)');
    if (desc) contentCell.push(desc);

    // CTA links
    const ctas = slide.querySelectorAll('.FeatureContentLayoutSimple--buttongroup a.Button, a.Button-primary, a.Button-secondary');
    ctas.forEach((cta) => {
      const arrows = cta.querySelectorAll('i.Button-arrow, .Button-arrow');
      arrows.forEach((arrow) => arrow.remove());
      contentCell.push(cta);
    });

    cells.push([itemType, mediaCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
