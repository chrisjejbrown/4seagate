var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate) > .FeatureContentLayoutSimple");
    slides.forEach((slide) => {
      const itemType = "Carousel Hero Slide";
      const fgImg = slide.querySelector(".FeatureContentLayoutSimple-imageContainer img, .FeatureContentLayoutSimple-logoContainer img");
      const bgImg = slide.querySelector(".FeatureContentLayoutSimple-background-large img, .FeatureContentLayoutSimple-background img");
      const mediaImg = fgImg || bgImg;
      const mediaCell = mediaImg ? [mediaImg] : [];
      const contentCell = [];
      const eyebrow = slide.querySelector(".FeatureContentLayoutSimple-eyebrow, .Eyebrow");
      if (eyebrow) {
        const eyebrowEl = document.createElement("p");
        eyebrowEl.textContent = eyebrow.textContent.trim();
        contentCell.push(eyebrowEl);
      }
      const heading = slide.querySelector("h1, h2, h3");
      if (heading) contentCell.push(heading);
      const desc = slide.querySelector("p.copy, .FeatureContentLayoutSimple-copyContainer > p:not(.Eyebrow)");
      if (desc) contentCell.push(desc);
      const ctas = slide.querySelectorAll(".FeatureContentLayoutSimple--buttongroup a.Button, a.Button-primary, a.Button-secondary");
      ctas.forEach((cta) => {
        const arrows = cta.querySelectorAll("i.Button-arrow, .Button-arrow");
        arrows.forEach((arrow) => arrow.remove());
        contentCell.push(cta);
      });
      cells.push([itemType, mediaCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const cells = [];
    const productCards = element.querySelectorAll(".CardLayoutFeaturedProducts-card");
    productCards.forEach((card) => {
      const isPromo = card.classList.contains("card--promo");
      const img = card.querySelector(".card-img > img, .card-img img");
      const contentCell = [];
      if (isPromo) {
        const promoLink = card.querySelector(".card-title a, a");
        if (promoLink) {
          const h3 = document.createElement("h3");
          const link = document.createElement("a");
          link.href = promoLink.href;
          link.textContent = promoLink.textContent.trim();
          h3.appendChild(link);
          contentCell.push(h3);
        }
      } else {
        const name = card.querySelector(".card-name");
        if (name) {
          const h3 = document.createElement("h3");
          if (card.href) {
            const link = document.createElement("a");
            link.href = card.href;
            link.textContent = name.textContent.trim();
            h3.appendChild(link);
          } else {
            h3.textContent = name.textContent.trim();
          }
          contentCell.push(h3);
        }
        const capacity = card.querySelector(".card-capacity .value");
        if (capacity) {
          const capP = document.createElement("p");
          capP.textContent = capacity.textContent.trim();
          contentCell.push(capP);
        }
        const priceLabel = card.querySelector(".card-price .label");
        const priceValue = card.querySelector(".card-price .value");
        if (priceValue) {
          const priceP = document.createElement("p");
          priceP.textContent = (priceLabel ? priceLabel.textContent.trim() + " " : "") + priceValue.textContent.trim();
          contentCell.push(priceP);
        }
        const tags = card.querySelectorAll(".card-tagName");
        if (tags.length > 0) {
          const tagP = document.createElement("p");
          tagP.textContent = Array.from(tags).map((t) => t.textContent.trim()).join(", ");
          contentCell.push(tagP);
        }
      }
      cells.push([img ? [img] : [], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse3(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      const link = slide.querySelector("a.slide-link");
      if (!link) return;
      const img = slide.querySelector(".slide-image img");
      const contentCell = [];
      const title = slide.querySelector(".slide-title, h3");
      if (title) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = title.textContent.trim();
        h3.appendChild(a);
        contentCell.push(h3);
      }
      cells.push([img ? [img] : [], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse4(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".CardLayout-card");
    cards.forEach((card) => {
      const link = card.querySelector("a");
      if (!link) return;
      const img = card.querySelector(".card-thumb img");
      const contentCell = [];
      const eyebrow = card.querySelector(".card-eyebrow");
      if (eyebrow) {
        const eyebrowP = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = eyebrow.textContent.trim();
        eyebrowP.appendChild(em);
        contentCell.push(eyebrowP);
      }
      const title = card.querySelector(".card-title");
      if (title) {
        const arrows = title.querySelectorAll("i.Button-arrow, .Button-arrow");
        arrows.forEach((arrow) => arrow.remove());
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = title.textContent.trim();
        h3.appendChild(a);
        contentCell.push(h3);
      }
      const body = card.querySelector(".card-body");
      if (body) {
        const p = document.createElement("p");
        p.textContent = body.textContent.trim();
        contentCell.push(p);
      }
      cells.push([img ? [img] : [], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document }) {
    const cells = [];
    let bgImg = null;
    const bgContainer = element.querySelector('[class*="backgroundContainer"]');
    if (bgContainer) {
      bgImg = bgContainer.querySelector("img");
    }
    if (!bgImg) {
      const bgDiv = element.querySelector('[class*="ContentLayoutCarousel-background"]');
      if (bgDiv && bgDiv.querySelector) {
        bgImg = bgDiv.querySelector("img");
      }
    }
    if (!bgImg) {
      const imgs = element.querySelectorAll("img");
      for (const img of imgs) {
        if (img.closest("button")) continue;
        if (img.closest('[class*="contentPanel"]')) continue;
        if (img.closest('[class*="navArrow"]')) continue;
        const src = img.getAttribute("src") || "";
        if (src.includes("arrow") || src.includes("icon") || src.startsWith("data:")) continue;
        bgImg = img;
        break;
      }
    }
    let contentSlide = null;
    const slides = element.querySelectorAll(".swiper-slide");
    for (const slide of slides) {
      if (slide.classList.contains("swiper-slide-duplicate")) continue;
      if (slide.querySelector("h2, h1, h3")) {
        contentSlide = slide;
        break;
      }
    }
    const contentCell = [];
    if (contentSlide) {
      const heading = contentSlide.querySelector("h1, h2, h3");
      if (heading) contentCell.push(heading);
      const desc = contentSlide.querySelector(".copy, .copy-large");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      const ctas = contentSlide.querySelectorAll("a.Button");
      ctas.forEach((cta) => {
        const arrows = cta.querySelectorAll("i.Button-arrow, .Button-arrow, i");
        arrows.forEach((arrow) => arrow.remove());
        contentCell.push(cta);
      });
    }
    cells.push([bgImg ? [bgImg] : [], contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/seagate-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        '[class*="cookie"]',
        '[class*="Cookie"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".modal-overlay",
        ".Modal",
        '[class*="popup"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".swiper-button-disabled",
        ".swiper-button-lock"
      ]);
      const overflowEls = element.querySelectorAll('[style*="overflow: hidden"]');
      overflowEls.forEach((el) => {
        el.style.overflow = "visible";
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header/Navigation
        "header",
        ".PrimaryNav",
        ".SecondaryNav",
        ".AlertBar",
        ".NavigationMenu",
        "nav",
        // Footer
        "footer",
        ".Footer",
        ".PrimaryFooter",
        ".SecondaryFooter",
        // Breadcrumbs
        ".Breadcrumb",
        '[class*="breadcrumb"]',
        // Utility elements
        "iframe",
        "link",
        "noscript",
        "script",
        // Hidden elements
        ".data-uw-rm-autofix-hide",
        '[aria-hidden="true"]',
        ".hidden",
        ".d-none"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("onclick");
        el.removeAttribute("data-gtm");
      });
      element.querySelectorAll(".data-uw-rm-autofix-hide").forEach((el) => {
        const parent = el.closest("h1, h2, h3, h4, h5, h6");
        if (parent && parent.textContent.trim() === "Empty heading") {
          parent.remove();
        }
      });
      element.querySelectorAll("source").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/seagate-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-product": parse2,
    "cards-category": parse3,
    "cards-resource": parse4,
    "hero-banner": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Seagate corporate homepage with hero banners, product categories, promotional content, and brand messaging",
    urls: ["https://www.seagate.com/"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".FeatureContentLayoutCarousel"]
      },
      {
        name: "cards-product",
        instances: [".CardLayoutFeaturedProducts"]
      },
      {
        name: "cards-category",
        instances: [".CardLayoutAllProducts"]
      },
      {
        name: "cards-resource",
        instances: [".CardLayout.CardLayout-bg--black", ".CardLayout.CardLayout-bg--white"]
      },
      {
        name: "hero-banner",
        instances: [".ContentLayoutCarousel"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".FeatureContentLayoutCarousel",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Products",
        selector: ".CardLayoutFeaturedProducts",
        style: null,
        blocks: ["cards-product"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Explore All Products",
        selector: ".CardLayoutAllProducts",
        style: "dark",
        blocks: ["cards-category"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Storage at Scale",
        selector: [".Blurb", ".CardLayout.CardLayout-bg--black"],
        style: "dark",
        blocks: ["cards-resource"],
        defaultContent: [".Blurb h2", ".Blurb p"]
      },
      {
        id: "section-5",
        name: "Latest Resources",
        selector: ".CardLayout.CardLayout-bg--white",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Corporate Message",
        selector: ".ContentLayoutCarousel",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Footnotes",
        selector: ".Footnotes",
        style: null,
        blocks: [],
        defaultContent: [".Footnotes-list"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
