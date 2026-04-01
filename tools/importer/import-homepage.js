/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsResourceParser from './parsers/cards-resource.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/seagate-cleanup.js';
import sectionsTransformer from './transformers/seagate-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-product': cardsProductParser,
  'cards-category': cardsCategoryParser,
  'cards-resource': cardsResourceParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Seagate corporate homepage with hero banners, product categories, promotional content, and brand messaging',
  urls: ['https://www.seagate.com/'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.FeatureContentLayoutCarousel'],
    },
    {
      name: 'cards-product',
      instances: ['.CardLayoutFeaturedProducts'],
    },
    {
      name: 'cards-category',
      instances: ['.CardLayoutAllProducts'],
    },
    {
      name: 'cards-resource',
      instances: ['.CardLayout.CardLayout-bg--black', '.CardLayout.CardLayout-bg--white'],
    },
    {
      name: 'hero-banner',
      instances: ['.ContentLayoutCarousel'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.FeatureContentLayoutCarousel',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Products',
      selector: '.CardLayoutFeaturedProducts',
      style: null,
      blocks: ['cards-product'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Explore All Products',
      selector: '.CardLayoutAllProducts',
      style: 'dark',
      blocks: ['cards-category'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Storage at Scale',
      selector: ['.Blurb', '.CardLayout.CardLayout-bg--black'],
      style: 'dark',
      blocks: ['cards-resource'],
      defaultContent: ['.Blurb h2', '.Blurb p'],
    },
    {
      id: 'section-5',
      name: 'Latest Resources',
      selector: '.CardLayout.CardLayout-bg--white',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Corporate Message',
      selector: '.ContentLayoutCarousel',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Footnotes',
      selector: '.Footnotes',
      style: null,
      blocks: [],
      defaultContent: ['.Footnotes-list'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page using template selectors
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
