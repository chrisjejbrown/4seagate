/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Seagate site-wide cleanup.
 * Selectors from captured DOM of https://www.seagate.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent banners (from captured DOM: OneTrust cookie consent)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="cookie"]',
      '[class*="Cookie"]',
    ]);

    // Remove overlay/modal elements that block parsing
    WebImporter.DOMUtils.remove(element, [
      '.modal-overlay',
      '.Modal',
      '[class*="popup"]',
    ]);

    // Remove navigation carousel controls (not authorable)
    WebImporter.DOMUtils.remove(element, [
      '.swiper-button-disabled',
      '.swiper-button-lock',
    ]);

    // Fix overflow issues for full-page capture
    const overflowEls = element.querySelectorAll('[style*="overflow: hidden"]');
    overflowEls.forEach((el) => { el.style.overflow = 'visible'; });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable global chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      // Header/Navigation
      'header',
      '.PrimaryNav',
      '.SecondaryNav',
      '.AlertBar',
      '.NavigationMenu',
      'nav',
      // Footer
      'footer',
      '.Footer',
      '.PrimaryFooter',
      '.SecondaryFooter',
      // Breadcrumbs
      '.Breadcrumb',
      '[class*="breadcrumb"]',
      // Utility elements
      'iframe',
      'link',
      'noscript',
      'script',
      // Hidden elements
      '.data-uw-rm-autofix-hide',
      '[aria-hidden="true"]',
      '.hidden',
      '.d-none',
    ]);

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-gtm');
    });

    // Remove empty heading placeholders
    element.querySelectorAll('.data-uw-rm-autofix-hide').forEach((el) => {
      const parent = el.closest('h1, h2, h3, h4, h5, h6');
      if (parent && parent.textContent.trim() === 'Empty heading') {
        parent.remove();
      }
    });

    // Clean up source elements (picture element cleanup)
    element.querySelectorAll('source').forEach((el) => el.remove());
  }
}
