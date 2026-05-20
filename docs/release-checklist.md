# Controlled Public Release Checklist

- [ ] Confirm repo name and public branding: `LEONA by DLG Labs`.
- [ ] Configure GitHub Pages custom domain: `www.dlglabs.org`.
- [ ] Confirm DNS points `www.dlglabs.org` at GitHub Pages.
- [ ] Confirm no private core files are included.
- [ ] Confirm raw evidence is intentionally preserved and documented.
- [ ] Run `node tools/validate_public_evidence.js`.
- [ ] Run `node tools/render_summary.js`.
- [ ] Run `python tui/leona_tui.py --limit 5`.
- [ ] Review `docs/public-private-boundary.md`.
- [ ] Decide whether to keep source-available license or switch selected folders to MIT/Apache-2.0.
- [ ] Create a new public GitHub repository.
- [ ] Push only this controlled package, not the private development workspace.
