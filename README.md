# Charles Matthew Oliva - Video Portfolio

A static, responsive portfolio for an AI Video Specialist and Video Editor. It is designed for GitHub Pages and uses local profile and thumbnail assets with Google Drive click-to-play video embeds.

## Publish with GitHub Pages

1. Create a repository such as `ai-video-portfolio`.
2. Upload everything inside this folder to the repository root. Do not upload only the ZIP file, and do not nest this folder inside the repository.
3. Commit the files to the `main` branch.
4. Open **Settings > Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/(root)`, then save.

The published address will follow this pattern: `https://USERNAME.github.io/REPOSITORY-NAME/`

## Contact form activation

The contact form uses FormSubmit. The first real submission sends a one-time activation email to `matthewoliva29@gmail.com`. Open that email and confirm the form before relying on it publicly. No API keys or secrets are stored in this website.

## Adding another video

Add the thumbnail under `assets/thumbnails/`, then add one project object to `portfolio-data.js`. The project will automatically appear in the complete work archive and its category filter. The design, contact details, and playback behavior do not need to be rebuilt.

## Portfolio source

Videos remain hosted in the supplied public Google Drive folder. Static thumbnails are bundled locally for consistent loading; clicking a project opens its Google Drive preview.
