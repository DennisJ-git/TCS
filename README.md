# PartsTrack — Inventory & Lifecycle Demo

A responsive, interactive static website prototype for a multi-manufacturer parts inventory and lifecycle tracking system. Built with plain HTML, CSS and JavaScript so it can be hosted on GitHub Pages without a build step.

## Features
- Responsive dashboard with stock KPIs, lifecycle overview, and team circulation counts for in-use, not-in-use, donated, and broken parts
- Searchable part cards and inventory table
- Add, edit, remove, and adjust part records and stock quantities
- Lifecycle stage and location updates with per-part history
- Admin and Harris Racing demo users, switchable from the sidebar; admin sees all parts and Harris Racing sees its team parts
- Notifications for new inventory changes, with unread counts and read controls
- CSV import and export for loading verified inventory records
- Stock activity log
- Privacy notice, keyboard-accessible controls, reduced-motion support
- GitHub Pages deployment workflow

## Run locally
Open `index.html` in a modern browser. For a local server, run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a new repository on GitHub (for example `partstrack-demo`).
2. Upload the contents of this folder to the repository root, including `.github/workflows/deploy.yml`.
3. In the repository, open **Settings → Pages** and set the source to **GitHub Actions** if it is not already selected.
4. Open **Actions** and wait for the `Deploy static site to GitHub Pages` workflow to finish.
5. GitHub will show the public site URL under **Settings → Pages**.

The workflow publishes the repository's static files. A public Pages site should be treated as public; do not put confidential source data in the repository.

## Privacy and production readiness
This is a front-end prototype, not a secure multi-tenant production system. The demo user switcher is a UI demonstration, not authentication or an access-control boundary. Records are stored in the current browser's local storage and are not shared between users or devices. Do not enter real confidential, personal, or commercially sensitive information.

For production use, add a backend and database, authentication, server-side authorisation on every request, tenant isolation, secure file storage for CAD files, audit logging, backups, and a documented data-retention policy. Never put database credentials, API secrets, private keys, or passwords in browser JavaScript or a public repository. Use server-side environment variables/secrets for backend deployments.

## 3D model viewer
This demo currently uses simple part illustrations rather than loading actual CAD geometry. A production version can add a browser-based CAD viewer and securely store model files. Do not upload proprietary CAD models to a public repository.

## Licence
Source code: MIT License (see `LICENSE`). The name PartsTrack and the demo data are illustrative. Third-party assets/libraries, if added later, retain their own licences. “Creative Commons” and MIT are different licences; choose a Creative Commons licence for documentation/media if desired, and an OSI-approved software licence for source code.


## Loading real parts data

The sample records are illustrative; they are not claimed to be verified manufacturer part numbers or real team stock. Public manufacturer and distributor catalogs can help verify product descriptions and manufacturer part numbers, but team assignments and quantities on hand are private, organization-specific inventory data. This demo does not invent or download those quantities.

The inventory page accepts CSV files with a header row containing **Part ID** (or **Part Number**), **Part Name**, and **Quantity**. Optional columns include **Manufacturer**, **Team**, **Location**, **Category**, **Minimum**, **Condition**, **Lifecycle Stage**, and **Description**. Matching part IDs are updated; new IDs are added. Conditions are `In use`, `Not in use`, `Donated`, and `Broken`.

Public lookup starting points include [DigiKey's developer portal](https://developer.digikey.com/) and [Mouser's API hub](https://www.mouser.com/api-hub/). Distributor API access can require account registration and credentials; keep any credentials on a trusted server, never in this static site's JavaScript. Check the source's terms and verify each part number before importing it.
