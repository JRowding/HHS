# Hester Home Services

Static website prototype with an animated logo opening, dust-cloud transition and illustrated toolbox navigation.

## Netlify
Connect this repository to Netlify, select the `main` branch, leave the build command empty and use `.` as the publish directory. The included `netlify.toml` configures that directory. No package installation or build is required.

## Current experience
The original logo is assembled and painted by its tools. A dust cloud reveals a cartoon toolbox with the logo attached. Services, About, Projects, Socials and Quote are tool-shaped tabs. The front folds down and exits on the first selection, and subsequent selections switch the content inside. Reduced-motion preferences are supported.

Page content is a starter draft. Business details, project photos, social links and the quote submission workflow still need to be added.

## Files
- `index.html`: main page and opening layout
- `loader.js`: logo animation
- `toolbox.js`: illustrated tools, custom lettering, dust transition and page navigation
- `toolbox.css`: toolbox styling and responsive layout
- `assets/`: transparent logo layers and toolbox badge
- `assets.js` and `pieces.json`: layer coordinates and asset paths

## Local preview
Serve this folder with any static web server. For example: `python -m http.server 8765`. Then open `http://localhost:8765`.

The `?toolbox` query skips to the toolbox for design review. `?frame=12.1` pauses the logo animation on a specific frame. Replay restarts the complete opening.
