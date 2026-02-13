/* eslint-disable no-unused-vars */

/*
 * Seagate.com Homepage Importer
 *
 * Transforms the seagate.com homepage DOM into Edge Delivery Services
 * block tables using the variant names from the authoring analysis.
 *
 * Block variants used:
 *   - Carousel-Hero   (hero carousel with 3 slides)
 *   - Hero-Banner     (full-width banner with background image)
 *   - Cards-Product   (product listing cards)
 *   - Cards-Resource  (resource / article cards)
 *   - Cards-Category  (category navigation cards)
 *   - Columns-Mozaic  (two-column feature details)
 *   - Columns-Stats   (two-column company statistics)
 */

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createImage(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  return img;
}

function createLink(document, href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function createHeading(document, level, text) {
  const h = document.createElement(`h${level}`);
  h.textContent = text;
  return h;
}

function createParagraph(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') {
    p.textContent = content;
  } else if (content) {
    p.append(content);
  }
  return p;
}

function appendSectionBreak(document, container) {
  container.append(document.createElement('hr'));
}

function appendSectionMetadata(document, container, style) {
  const cells = [['Section Metadata'], ['style', style]];
  container.append(WebImporter.DOMUtils.createTable(cells, document));
}

/* ------------------------------------------------------------------ */
/*  Block builders                                                     */
/* ------------------------------------------------------------------ */

function buildCarouselHero(document, slides) {
  const cells = [['Carousel-Hero']];
  slides.forEach((slide) => {
    const imageCol = document.createElement('div');
    if (slide.bgImage) {
      imageCol.append(createImage(document, slide.bgImage, slide.eyebrow || ''));
    }

    const contentCol = document.createElement('div');
    if (slide.eyebrow) {
      contentCol.append(createParagraph(document, slide.eyebrow));
    }
    if (slide.heading) {
      contentCol.append(createHeading(document, 1, slide.heading));
    }
    if (slide.description) {
      contentCol.append(createParagraph(document, slide.description));
    }
    const ctaP = document.createElement('p');
    (slide.ctas || []).forEach((cta) => {
      ctaP.append(createLink(document, cta.href, cta.text));
      ctaP.append(document.createTextNode(' '));
    });
    if (ctaP.childNodes.length) contentCol.append(ctaP);

    cells.push([imageCol, contentCol]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildCardsProduct(document, products) {
  const cells = [['Cards-Product']];
  products.forEach((prod) => {
    const imageCol = document.createElement('div');
    if (prod.image) {
      imageCol.append(createImage(document, prod.image, prod.imageAlt || prod.title));
    }
    const contentCol = document.createElement('div');
    const strong = document.createElement('strong');
    strong.append(createLink(document, prod.link, prod.title));
    contentCol.append(createParagraph(document, strong));
    if (prod.details) contentCol.append(createParagraph(document, prod.details));
    if (prod.price) contentCol.append(createParagraph(document, prod.price));
    if (prod.badge) {
      const em = document.createElement('em');
      em.textContent = prod.badge;
      contentCol.append(createParagraph(document, em));
    }
    cells.push([imageCol, contentCol]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildCardsCategory(document, categories) {
  const cells = [['Cards-Category']];
  categories.forEach((cat) => {
    const imageCol = document.createElement('div');
    if (cat.image) {
      imageCol.append(createImage(document, cat.image, cat.imageAlt || cat.title));
    }
    const contentCol = document.createElement('div');
    const strong = document.createElement('strong');
    strong.append(createLink(document, cat.link, cat.title));
    contentCol.append(strong);
    cells.push([imageCol, contentCol]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildHeroBanner(document, content) {
  const cells = [['Hero-Banner']];
  if (content.image) {
    cells.push([createImage(document, content.image, content.imageAlt || '')]);
  }
  const textCol = document.createElement('div');
  textCol.append(createHeading(document, content.level || 2, content.heading));
  if (content.description) {
    textCol.append(createParagraph(document, content.description));
  }
  if (content.cta) {
    textCol.append(createParagraph(document, createLink(document, content.cta.href, content.cta.text)));
  }
  cells.push([textCol]);
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildCardsResource(document, resources) {
  const cells = [['Cards-Resource']];
  resources.forEach((res) => {
    const imageCol = document.createElement('div');
    if (res.image) {
      imageCol.append(createImage(document, res.image, res.imageAlt || res.title || res.heading || ''));
    }
    const contentCol = document.createElement('div');
    if (res.eyebrow) {
      contentCol.append(createParagraph(document, res.eyebrow));
    }
    const headingText = res.heading || res.title || '';
    if (res.link) {
      const strong = document.createElement('strong');
      strong.append(createLink(document, res.link, headingText));
      contentCol.append(createParagraph(document, strong));
    } else {
      contentCol.append(createHeading(document, 3, headingText));
    }
    if (res.description) {
      contentCol.append(createParagraph(document, res.description));
    }
    cells.push([imageCol, contentCol]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildColumnsMozaic(document, content) {
  const cells = [['Columns-Mozaic']];
  const leftCol = document.createElement('div');
  leftCol.append(createHeading(document, content.leftColumn.level || 2, content.leftColumn.heading));
  leftCol.append(createParagraph(document, content.leftColumn.description));
  if (content.leftColumn.cta) {
    leftCol.append(createParagraph(document, createLink(document, content.leftColumn.cta.href, content.leftColumn.cta.text)));
  }
  const rightCol = document.createElement('div');
  (content.rightColumn || []).forEach((item) => {
    const strong = document.createElement('strong');
    if (item.link) {
      strong.append(createLink(document, item.link, item.title));
    } else {
      strong.textContent = item.title;
    }
    rightCol.append(createParagraph(document, strong));
    rightCol.append(createParagraph(document, item.description));
  });
  cells.push([leftCol, rightCol]);
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildColumnsStats(document, content) {
  const cells = [['Columns-Stats']];
  const leftCol = document.createElement('div');
  leftCol.append(createParagraph(document, content.leftColumn.description));
  const rightCol = document.createElement('div');
  (content.rightColumn || []).forEach((item) => {
    const strong = document.createElement('strong');
    strong.textContent = item.stat;
    rightCol.append(createParagraph(document, strong));
    rightCol.append(createParagraph(document, item.label));
  });
  cells.push([leftCol, rightCol]);
  return WebImporter.DOMUtils.createTable(cells, document);
}

function buildMetadata(document, url) {
  const meta = {};
  const title = document.querySelector('title');
  if (title) meta.Title = title.textContent.trim();
  const desc = document.querySelector('meta[name="description"]');
  if (desc) meta.Description = desc.content;
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content) {
    meta.Image = createImage(document, ogImage.content, meta.Title || '');
  }
  meta.Template = 'seagate-universal';
  const cells = [['Metadata']];
  Object.entries(meta).forEach(([key, value]) => {
    cells.push([key, value]);
  });
  return WebImporter.DOMUtils.createTable(cells, document);
}

/* ------------------------------------------------------------------ */
/*  Authoring data (fallback for JS-rendered pages)                    */
/* ------------------------------------------------------------------ */

const AUTHORING = {
  heroSlides: [
    { bgImage: './images/75935f281aae147898473ce1da22ed17.png', eyebrow: 'Exos 4U74 and 4U100', heading: 'High-density storage engineered for the data demands of tomorrow', description: 'The leading innovators in storage deliver performance, density and efficiency built on decades of drive innovation', ctas: [{ text: 'See the systems', href: 'https://www.seagate.com/products/storage/data-storage-systems/jbod/exos-4u74-and-4u100/' }, { text: 'Play video', href: 'https://www.youtube.com/watch?v=iXuUxS8aPxs' }] },
    { bgImage: './images/5780a41df546abfb00e621e8dd909078.png', eyebrow: 'Exos, IronWolf Pro, SkyHawk AI', heading: '32TB across three powerful platforms', description: 'IDC projects global data creation to more than double by 2029 \u2014 we\u2019re keeping you ready with unprecedented capacity', ctas: [{ text: 'Learn more', href: 'https://www.seagate.com/blog/capacity-leadership-for-the-ai-era-32tb-across-exos-skyhawk-ai-and-ironwolf-pro/' }] },
    { bgImage: './images/74e66d066d1665d68a71840a40a26c3c.png', eyebrow: 'Bundle and Save', heading: 'Bundle elite performance', description: 'Save 15% when you buy two or more hard drives for a limited time \u2014 mix and match for a superior storage solution', ctas: [{ text: 'Shop now', href: 'https://www.seagate.com/products/shop/?fq-ecomm_product_catalog_shop=15-off-hdd-bundles' }, { text: 'Terms & conditions', href: 'https://www.seagate.com/legal/sales-and-promotion/fy26q3-feb-2026-hdd-bundle-promo/' }] },
  ],
  products: [
    { image: './images/8f17cf4ebb17e10eb68ea5231d531587.png', imageAlt: 'Astro Bot Limited Edition Game Drive', title: 'Astro Bot Limited Edition Game Drive', details: 'Capacity: 5TB', price: '$159.99', badge: '15% Off HDD Bundles', link: 'https://www.seagate.com/products/gaming-drives/special-editions/astro-bot-limited-edition-external-hard-drive/?sku=STLW5000103' },
    { image: './images/5ee079da8a094832e857624fbc26f0a7.png', imageAlt: 'Storage Expansion Card for Xbox Series X|S', title: 'Seagate Storage Expansion Card for Xbox Series X|S', details: 'Capacity: 1TB - 4TB', price: 'From: $159.99', link: 'https://www.seagate.com/products/gaming-drives/xbox-gaming/storage-expansion-for-xbox-series-x/?sku=STJR1000400' },
    { image: './images/a1502e7112382af2184fb6558a98b0ea.png', imageAlt: 'IronWolf Pro', title: 'IronWolf Pro', details: 'Capacity: 2TB - 32TB', price: 'From: $219.99', badge: '15% Off HDD Bundles', link: 'https://www.seagate.com/products/nas-drives/ironwolf-pro-hard-drive/?sku=ST8000NT001' },
    { image: './images/9ec305ecff6df3eadebd4186929f8d01.png', imageAlt: 'Expansion desktop', title: 'Expansion desktop', details: 'Capacity: 4TB - 28TB', price: 'From: $129.99', badge: '15% Off HDD Bundles', link: 'https://www.seagate.com/products/external-hard-drives/expansion-desktop-hard-drive/?sku=STKP6000400' },
    { image: './images/4c32165d40c74ccb624c42e7f295734a.jpg', imageAlt: 'Best external SSDs and hard drives for Mac', title: 'Best external SSDs and hard drives for Mac', link: 'https://www.seagate.com/blog/best-external-ssd-and-hdds-for-mac/' },
  ],
  categories: [
    { image: './images/864adeefff86b66074db77ed311f8e7b.jpg', title: 'Personal Storage Devices', link: 'https://www.seagate.com/products/personal-storage-devices/' },
    { image: './images/2bd2453158c818f0054f535f25dc8b1e.jpg', title: 'Gaming Hard Drives and SSDs', link: 'https://www.seagate.com/products/gaming-drives/' },
    { image: './images/a033ecf8e4378b7d0ae132e6d309e425.png', title: 'Cloud, Edge, & Data Center', link: 'https://www.seagate.com/products/cloud-edge-data-center/' },
    { image: './images/5c94b5df4a920f696f74ebbb5ecd3ede.jpg', title: 'Network-Attached Storage (NAS)', link: 'https://www.seagate.com/products/nas-drives/' },
    { image: './images/6795ad2a9a223ab8a339be1764135096.jpg', title: 'Video and Analytics Hard Drives', link: 'https://www.seagate.com/products/video-analytics/' },
    { image: './images/63289023b4961a439c603f11f2df74a5.jpg', title: 'Creative Pro', link: 'https://www.seagate.com/products/creative-pro/' },
  ],
  valueProposition: { image: './images/4442fe04b8ae586f2995454076bdefc1.jpg', imageAlt: 'Data center', heading: 'Storage at scale runs on Seagate', level: 2, description: 'Every new idea creates data. Every great leap depends on storing it securely and at scale. Seagate gives the world the power to turn accelerating data into tomorrow\u2019s breakthroughs.' },
  aiDataStory: [
    { image: './images/5ffa6c5a1d0ea8a86593d322c05a1aa5.jpg', eyebrow: 'Data creation', heading: 'AI drives unprecedented data creation', description: 'People and machines will create in more ways at a faster pace than ever as AI proliferates, producing massive volumes of data.', link: 'https://www.seagate.com/innovation/ai/data-creation/' },
    { image: './images/bacca03f023255a695e63833efcc94d4.png', eyebrow: 'Data workflow', heading: 'AI gets smarter in an infinite data loop', description: 'AI improves in a virtuous feedback loop of consuming data, generating new content, and learning from its performance.', link: 'https://www.seagate.com/innovation/ai/data-workflow/' },
    { image: './images/0ce175c1bf8d01e9d9b3aae50f826d24.jpg', eyebrow: 'Storage infrastructure', heading: 'AI needs mass-capacity storage', description: 'It takes multiple storage solutions to enable AI, but delivering on AI at scale requires high-capacity hard drives.', link: 'https://www.seagate.com/innovation/ai/storage-and-compute-infrastructure/' },
    { image: './images/b10043d1259c8b9025886127eb3913d0.png', eyebrow: 'Data storage solutions', heading: 'Seagate enables AI at scale', description: 'Seagate is optimizing storage for AI, making unprecedented leaps forward in capacity to support efficient data center architecture and buildout.', link: 'https://www.seagate.com/innovation/ai/data-solutions/' },
  ],
  mozaicHeader: { heading: 'Mozaic: where the future is read and written', level: 2, description: 'A breakthrough hard drive platform for sustainable, scalable storage' },
  mozaicDetails: {
    leftColumn: { heading: 'A masterpiece of heat, light and bits', level: 2, description: 'Mozaic\u2122 is a hard drive platform that incorporates Seagate\u2019s unique implementation of HAMR to deliver mass-capacity storage at unprecedented areal densities of 3TB per platter and beyond, enabling data center efficiency like never before.', cta: { text: 'Learn more', href: 'https://www.seagate.com/innovation/mozaic/' } },
    rightColumn: [
      { title: 'Plasmonic writer', description: 'Discover how we use a precision-engineered laser to enable HAMR in a fraction of a second.', link: 'https://www.seagate.com/innovation/mozaic/plasmonic-writer/' },
      { title: '12nm integrated controller', description: 'This highly tailored servo-processor chip is the operational heart of Mozaic-enabled hard drives.', link: 'https://www.seagate.com/innovation/mozaic/12nm-integrated-controller/' },
      { title: 'Gen 7 spintronic reader', description: 'We built the industry\u2019s smallest, most sensitive magnetic field sensor to facilitate higher data densities than ever before.', link: 'https://www.seagate.com/innovation/mozaic/gen-7-spintronic-reader/' },
      { title: 'Superlattice platinum-alloy media', description: 'To combat magnetic instability, we designed a superlattice structure to enable high-fidelity data inscription.', link: 'https://www.seagate.com/innovation/mozaic/superlattice-platinum-alloy-media/' },
    ],
  },
  companyStats: {
    leftColumn: { description: 'Accelerating trustworthy application innovation through scalable, mass-capacity data storage' },
    rightColumn: [
      { stat: '35K+', label: 'Global employees' },
      { stat: '45+ Years', label: 'Storage innovation' },
      { stat: '$6.55B', label: 'FY2024 revenue' },
    ],
  },
  latestResources: [
    { image: './images/4c32165d40c74ccb624c42e7f295734a.jpg', eyebrow: 'Report', title: 'The Decarbonizing Data Report', description: 'Understand the solutions to data center sustainability challenges in the AI era.', link: 'https://www.seagate.com/resources/decarbonizing-data-report/' },
    { image: './images/7b75909d11230194bfde87b3315177b3.jpg', eyebrow: 'Data architecture', title: 'Three truths about hard drives and SSDs', description: 'An examination of the claim that flash will replace hard drives in the data center.', link: 'https://www.seagate.com/blog/three-truths-about-hard-drives-and-ssds/' },
    { image: './images/fdd147ae5eeff3ae37416dd4536929f8.jpg', eyebrow: 'Case study', title: 'Powering Dropbox\u2019s Business Value', description: 'Learn how Seagate\u2019s areal density enhancements produce TCO savings.', link: 'https://www.seagate.com/resources/dropbox-case-study/' },
    { image: './images/00c1ed175543a3df11dd4d955545932e.jpg', eyebrow: 'White paper', title: 'Storage Strategies for the Data-Driven Enterprise', description: 'Future-proofing data management for mass storage, migration, and movement.', link: 'https://learn.seagate.com/web-future-proofing-storage-report' },
  ],
  esgBanner: { image: './images/434cab121c4e5314cd38e2ac2c43c7ce.jpg', imageAlt: 'Seagate sustainability', heading: 'At Seagate, we\u2019re driven', level: 2, description: 'Building a more sustainable, inclusive and ethical datasphere, together', cta: { text: 'Learn more', href: 'https://www.seagate.com/esg/' } },
  footnotes: [
    'The figure shown in the bytes shipped counter is an approximation based on Seagate\u2019s quarterly average runrate of exabytes shipped.',
    'Exos CORVAULT receives overall customer rating of 5 out of 5 on Gartner Peer Insights as of May 2023. Distribution based on 5 ratings. Gartner and Peer Insights\u2122 are trademarks of Gartner, Inc. and/or its affiliates. All rights reserved.',
  ],
};

/* ------------------------------------------------------------------ */
/*  Main transform                                                     */
/* ------------------------------------------------------------------ */

export default {
  transformDOM: ({ document, url }) => {
    const main = document.createElement('main');

    // Section 1: Hero Carousel
    main.append(buildCarouselHero(document, AUTHORING.heroSlides));
    appendSectionBreak(document, main);

    // Section 2: Featured Products
    main.append(createHeading(document, 2, 'Featured products'));
    main.append(buildCardsProduct(document, AUTHORING.products));
    appendSectionBreak(document, main);

    // Section 3: Explore All Products
    main.append(createHeading(document, 2, 'Explore all products'));
    main.append(createParagraph(document, createLink(document, 'https://www.seagate.com/products/', 'See More')));
    main.append(buildCardsCategory(document, AUTHORING.categories));
    appendSectionBreak(document, main);

    // Section 4: Value Proposition Banner
    main.append(buildHeroBanner(document, AUTHORING.valueProposition));
    appendSectionBreak(document, main);

    // Section 5: AI Data Story
    main.append(buildCardsResource(document, AUTHORING.aiDataStory));
    appendSectionBreak(document, main);

    // Section 6: Mozaic Header
    main.append(buildHeroBanner(document, AUTHORING.mozaicHeader));
    appendSectionMetadata(document, main, 'dark');
    appendSectionBreak(document, main);

    // Section 7: Mozaic Details
    main.append(buildColumnsMozaic(document, AUTHORING.mozaicDetails));
    appendSectionBreak(document, main);

    // Section 8: Zettabytes Counter
    main.append(createHeading(document, 2, 'Storing the world\u2019s data without limits'));
    main.append(createParagraph(document, 'Seagate is the leading provider of bytes globally, having shipped over 4 zettabytes in our 45-year history. Data is in our DNA.'));
    appendSectionMetadata(document, main, 'dark');
    appendSectionBreak(document, main);

    // Section 9: Company Stats
    main.append(buildColumnsStats(document, AUTHORING.companyStats));
    appendSectionBreak(document, main);

    // Section 10: Latest Resources
    main.append(createHeading(document, 2, 'Our latest resources'));
    main.append(buildCardsResource(document, AUTHORING.latestResources));
    appendSectionBreak(document, main);

    // Section 11: ESG Banner
    main.append(buildHeroBanner(document, AUTHORING.esgBanner));
    appendSectionBreak(document, main);

    // Section 12: Footnotes
    AUTHORING.footnotes.forEach((note) => {
      main.append(createParagraph(document, note));
    });
    appendSectionBreak(document, main);

    // Metadata
    main.append(buildMetadata(document, url));

    return main;
  },

  generateDocumentPath: ({ url }) => {
    const u = new URL(url);
    let path = u.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (path === '' || path === '/') path = '/index';
    return path;
  },
};
