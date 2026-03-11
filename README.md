# Saqib Nawaz - Developer Portfolio

A modern, modular developer portfolio website built with vanilla HTML, CSS, and JavaScript.

## Project Structure

```
saqib-portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # CSS custom properties (colors, fonts, spacing)
│   ├── base.css            # Reset, typography, utilities
│   ├── components.css      # Reusable components (buttons, cards, tags)
│   └── sections.css        # Section-specific styles (nav, hero, etc.)
├── js/
│   └── main.js             # JavaScript functionality
├── assets/
│   └── images/             # Image assets
└── README.md
```

## Quick Start

1. **Open locally**: Simply open `index.html` in a browser
2. **Using a local server** (recommended for development):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if http-server is installed)
   npx http-server
   ```

## Customization Guide

### Colors & Theming
Edit `css/variables.css` to change the color palette:
- `--color-primary`: Main accent color
- `--color-accent`: Secondary accent
- `--color-bg`: Background colors
- `--color-text`: Text colors

### Typography
The site uses two fonts from Google Fonts:
- **Syne**: Display/heading font
- **Space Mono**: Monospace font for code/technical elements

### Adding New Sections
1. Add HTML in `index.html` with class `section`
2. Add navigation link in the `nav__menu`
3. Add section-specific styles in `css/sections.css`

### Adding Projects
Copy and customize the `.project-card` template in the work section.

### Adding Skills
Add new `.skill-category` blocks in the skills section.

## Modules to Add

Ideas for expanding the portfolio:
- [ ] Blog section
- [ ] Experience/timeline
- [ ] Testimonials
- [ ] Case studies
- [ ] Dark/light mode toggle
- [ ] Contact form
- [ ] Analytics integration
- [ ] SEO meta tags
- [ ] RSS feed

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Uses CSS custom properties and modern JavaScript features.

## License

MIT
