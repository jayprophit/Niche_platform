/**
 * Cross-platform media query utility
 * Provides responsive breakpoints and media query helpers
 */

// Breakpoints for different device sizes (in pixels)
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

// Media query strings for use in CSS-in-JS
export const MEDIA_QUERIES = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `@media (min-width: ${BREAKPOINTS.xxl}px)`,
  mobile: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,
  dark: `@media (prefers-color-scheme: dark)`,
  light: `@media (prefers-color-scheme: light)`,
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
};

/**
 * Generate responsive styles for different breakpoints
 * @param {string} property - CSS property name
 * @param {Object} values - Values for different breakpoints
 * @returns {Object} CSS-in-JS style object
 */
export function responsive(property, values) {
  const styles = {};
  
  if (values.base !== undefined) {
    styles[property] = values.base;
  }
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'base') return;
    
    if (MEDIA_QUERIES[breakpoint]) {
      styles[MEDIA_QUERIES[breakpoint]] = {
        [property]: value,
      };
    }
  });
  
  return styles;
}

/**
 * Hook to check if a media query matches
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
}

/**
 * Generate CSS for responsive grid layouts
 * @param {number} columns - Number of columns
 * @param {Object} options - Grid options
 * @returns {string} CSS string
 */
export function generateResponsiveGrid(columns = 12, options = {}) {
  const {
    gap = '1rem',
    containerClass = 'container',
    rowClass = 'row',
    colClass = 'col',
  } = options;
  
  return `
    .${containerClass} {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }
    
    ${MEDIA_QUERIES.sm} {
      .${containerClass} {
        max-width: 540px;
      }
    }
    
    ${MEDIA_QUERIES.md} {
      .${containerClass} {
        max-width: 720px;
      }
    }
    
    ${MEDIA_QUERIES.lg} {
      .${containerClass} {
        max-width: 960px;
      }
    }
    
    ${MEDIA_QUERIES.xl} {
      .${containerClass} {
        max-width: 1140px;
      }
    }
    
    ${MEDIA_QUERIES.xxl} {
      .${containerClass} {
        max-width: 1320px;
      }
    }
    
    .${rowClass} {
      display: flex;
      flex-wrap: wrap;
      margin-right: -${gap};
      margin-left: -${gap};
    }
    
    .${colClass} {
      position: relative;
      width: 100%;
      padding-right: ${gap};
      padding-left: ${gap};
    }
    
    ${Array.from({ length: columns }, (_, i) => i + 1)
      .map(
        (col) => `
          .${colClass}-${col} {
            flex: 0 0 ${(col / columns) * 100}%;
            max-width: ${(col / columns) * 100}%;
          }
        `
      )
      .join('\n')}
    
    ${Object.entries(BREAKPOINTS)
      .map(
        ([breakpoint, size]) => `
          ${MEDIA_QUERIES[breakpoint]} {
            ${Array.from({ length: columns }, (_, i) => i + 1)
              .map(
                (col) => `
                  .${colClass}-${breakpoint}-${col} {
                    flex: 0 0 ${(col / columns) * 100}%;
                    max-width: ${(col / columns) * 100}%;
                  }
                `
              )
              .join('\n')}
          }
        `
      )
      .join('\n')}
  `;
}
