# Animated Vector Avatars

An interactive "Meet the Team" page that presents nine team members as animated vector avatars. Hover over a portrait, or tap it on a touch screen, and that person's avatar comes to life with an animation of its own.

**[Live demo →](https://interactive-avatars-umber.vercel.app)**

---

## Overview

Animated Vector Avatars is a lightweight front-end project built with plain HTML, CSS and JavaScript. It has no framework, no package manager and no build step, so it can be opened directly in a browser or deployed as static files.

The page renders a responsive grid of team cards. The grid is populated by `script.js`, and each card responds to hover, focus or tap with a unique animation.

## Features

- **Nine individually animated avatars**, each with its own animation.
- **Hover and tap interaction**, with a single interaction model for desktop and touch devices.
- **Responsive layout** that adapts to phones, tablets and desktops, including devices with display cutouts (`viewport-fit=cover`).
- **Accessible markup**, with the grid exposed to assistive technology as a labelled "Team members" section.
- **Zero dependencies.** The only external requests are Google Fonts (Poppins, Bricolage Grotesque and Figtree).
- **Static hosting ready**, with nothing to compile or install.

## Tech stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Markup     | HTML5                                       |
| Styling    | CSS3                                        |
| Behavior   | Vanilla JavaScript (ES6+)                   |
| Typography | Google Fonts                                |
| Hosting    | Vercel (static)                             |

## Getting started

### Prerequisites

A modern web browser. Python 3 or any other static file server is optional.

### Run locally

```bash
git clone https://github.com/mahdipuya/interactive-avatars.git
cd interactive-avatars
```

Then either open `index.html` directly in your browser, or serve the folder:

```bash
python3 -m http.server 8000
```

and visit <http://localhost:8000>.

## Project structure

```
interactive-avatars/
├── index.html            # Page shell: header and the empty grid that script.js fills
├── styles.css            # Layout, theming and animation styles
├── script.js             # Team data, avatar rendering and interaction logic
├── Lineup in Motion.html # Secondary page (work in progress)
└── README.md
```

## Usage

1. Open the page.
2. Hover over any portrait (desktop) or tap it (touch devices).
3. Watch that person's avatar animate.

## Customization

- **Team members:** edit the team data in `script.js` to change names, roles and avatar details.
- **Look and feel:** adjust layout, colors and animation styles in `styles.css`.
- **Page copy:** update the heading, eyebrow text and intro paragraph in `index.html`.

## Deployment

Because the project is fully static, it can be hosted anywhere that serves files: Vercel, Netlify, GitHub Pages, Cloudflare Pages or any plain web server. For Vercel, import the repository and deploy with the default settings. No build command or output directory is required.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push the branch (`git push origin feature/your-feature`)
5. Open a pull request

## Author

Built by [mahdipuya](https://github.com/mahdipuya).
