# YEVA MED — Healthcare Wear & Essentials Storefront

A modern Next.js storefront for YEVA medical scrubs, acoustic sedescopes, and course-wise care kits. The latest redesign removes heavy 3D WebGL animations and introduces a high-performance horizontal hero carousel inspired by CodePen, a 3-column clinical pillar ecosystem, a "Shop by Color" flat-lay showcase, a "Shop Bestsellers" studio collection with swatch pickers, a verified customer feedback section (10,615+ reviews), and comprehensive fabric & institutional details.

## Recent Storefront Redesign

1. **Top Hero Section — Horizontal Expanding Carousel**:
   - Replaced heavy 3D elements with an animated horizontal expanding card slider inspired by CodePen (`MDJAmin/pen/GgpdKPy`).
   - Staggered blur-to-focus animations for title, subtitle, and CTA actions.
   - Floating thumbnail previews on the right with direct click-to-slide navigation, auto-advance timer, and touch swipe gestures.

2. **Second Section — 3-Column Clinical Ecosystem**:
   - **Column 1 — Acoustic Sedescope**: Surgical-grade stainless steel chestpiece, tunable dual-frequency diaphragm, anatomical binaurals.
   - **Column 2 — Clinical Scrubs**: YEVA RYX™ 4-way stretch, SILV-SHIELD™ liquid-repellent and anti-microbial barrier, 5-8 functional pockets.
   - **Column 3 — Course-Wise CareKits**: Curated medical student kits for MBBS, Nursing, Physiotherapy & Allied Sciences.

3. **Third Section — Shop by Color**:
   - Folded studio flat-lay views on matching solid color fields: Espresso, Midnight Galaxy, Tuscan Olive, Royal Navy, Midnight Teal, Burgundy Wine, and Slate Charcoal.
   - Interactive Quick View modal with size selection (XS to XXL) and direct bag addition.

4. **Fourth Section — Shop Bestsellers**:
   - Studio model photography showcasing top-demanded scrubs, sedescopes, and care kits.
   - Interactive color swatches row beneath each product card.
   - Star ratings (4.80–4.98) and review counts.
   - Direct Quick Add action and category filters.

5. **Fifth Section — Customer Reviews & Feedback**:
   - Overall rating aggregate of 4.9/5 from 10,615+ verified healthcare reviews.
   - Role filters (Surgeons & Residents, ICU Nurses, Medical Students).
   - Real clinical testimonials with verified hero badges and helpful vote counters.
   - Interactive "Write a Review" submission modal.

6. **Balance Sections — Fabric Innovation & Care**:
   - Material science study: YEVA RYX™ (4-way stretch), YEVA LITE™ (featherlight air-flow), and YEVA CORE™ (hospital laundry certified).
   - Why Healthcare Heroes Choose YEVA: 6 core value pillars.
   - Institutional and Team Orders: Custom embroidery, department color-coding, student batch discounts, and direct helplines.
   - FAQ Accordion and Newsletter discount offer.
   - Luxury dark footer with site navigation, contact numbers, and pan-India locations (Delhi, Mangalore, Bangalore).

## What makes this version genuinely 3D

The opening experience is a 400vh scroll journey with a sticky full-screen WebGL canvas. Scrolling changes the 3D scene, camera, lighting and object scale:

1. **Volumetric showroom entrance** — a custom 3D mannequin wearing a sculpted scrub jacket and trousers stands on a circular product plinth, framed by repeated architectural arches.
2. **Fabric cathedral** — the camera flies forward through a large animated, vertex-deformed fabric curtain with dramatic grazing light.
3. **Construction gallery** — a second full-scale scrub model is staged with floating, physically lit colour-material blocks.
4. **Colour hall** — four independent scrub mannequins form a 3D collection lineup inside the showroom architecture.

The visitor controls the camera journey by scrolling. Mouse movement adds subtle camera parallax. Animated mannequins, procedural garment geometry, moving cloth vertices, a deep particle field, repeated architectural arches, studio lights, shadows, fog and continuous camera movement make this a spatial 3D experience rather than a stack of 3D-looking images. Adaptive device pixel ratio is enabled to help the scene scale to different GPU capabilities.

The scroll position drives the 3D scene continuously. The text overlay, progress line and scene indicator update as the visitor moves through the runway. This is not a static hero image with a decorative 3D object.

## Brochure content integrated

The storefront now includes content and image assets extracted from the supplied two-page YEVAMED brochure:
- Brand promise: “We engineer comfort. We design confidence. Premium medical wear, made for those who care.”
- Fabric ranges: YEVA RYX / YEVA FLEX, YEVA LITE and YEVA CORE, retaining the brochure's feature descriptions and wording.
- YEVA CAREKIT: course-wise collections for Nursing, Physiotherapy, Occupational Therapy, Medical Laboratory Technology, Radiology & Imaging, Medical Student and Pharmacy Student essentials.
- The brochure's listed kit contents for Nursing, Physiotherapy, Occupational Therapy, Medical Student and Paramedical kits.
- Why YEVAMED: all six brochure pillars.
- About YEVA MED, its mission and commitment.
- Contact details: 9544044266, 9633264851, info@yavamed.com, www.yevamed.com; Delhi, Mangalore & Bangalore.
- Original brochure product, scrub-colour and healthcare-team imagery extracted and optimized for the website.

## Storefront features

- YEVA wordmark and navy / white brand palette
- Men, Women and All collection filters
- Colour filtering and product search
- Shopify product catalogue through the Storefront API
- Product detail pages and variant selection
- Cart create / add / update / remove operations
- Shopify-hosted checkout
- Team-order enquiry and brand / fabric storytelling
- Responsive desktop and mobile layouts
- Supplied YEVA logo, scrub imagery and runway reference video retained in the project

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run lint
npm run build
npm start
```

## Shopify connection

Create a Shopify app with Storefront API access. Enable the Storefront API permissions needed to read products and collections and manage carts. Copy `.env.example` to `.env.local` and set:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2026-10
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Keep the Storefront API token on the server. Do not commit `.env.local` or expose private Admin API credentials in browser code.

The site falls back to the local demo catalogue when Shopify credentials are not configured. Demo product prices are placeholders and are not live inventory.

## Product imagery

The original supplied YEVA logo and product images are in `public/images/`. The attached runway inspiration video is preserved at `reference-assets/runway-style-reference.mp4`. The uploaded reference images are also retained in `public/images/` for design reference.

## Important production note

This is the complete editable website source, not a deployed live Shopify store. Real product data, variants, prices, shipping, taxes, payment settings, domain and policies must be configured in the merchant's Shopify admin before launch. The showroom people use the actual supplied YEVA product photographs, background-removed and mapped onto subdivided, gently curved 3D meshes. This preserves the real face, fit, fabric appearance and garment details from the supplied imagery while adding spatial depth and parallax. These are 2.5D photographic 3D meshes, not fully rigged 360-degree human models. For free camera orbit and physically simulated cloth, commission approved full-body human and garment GLB/GLTF assets.


## Updated immersive wardrobe runway

The original single-person hero has been replaced with a 3D medical-uniform hanger rack:
- Four full scrub sets in navy, charcoal, teal and burgundy.
- Each outfit has a 3D hanger, top, matching pants and a gently swinging garment animation.
- The rack rail and support frame are modeled in Three.js.
- Scroll progress moves the camera laterally along the rail, centering the next outfit in sequence.
- The hero scene headings now pair with the four scroll positions; the person cutout is no longer used in the hero scene.


## Newly added YEVA supplied images

Two additional user-supplied images are now included in the storefront under the “The YEVA Identity” section:
- `public/images/yeva-business-card-mockup.jpg` — navy and white YEVA business-card mockups.
- `public/images/yeva-shift-essentials-campaign.jpg` — “Your shift essentials” campaign image featuring two healthcare professionals.

The section is linked from the main navigation as “BRAND” and is responsive on desktop and mobile.


## Realistic 3D scrub garment update

The hanger runway scrub tops now use a more detailed tailored garment mesh instead of the earlier flat, extruded silhouette:
- Rounded, beveled body volume with subtle chest shaping and cloth drape.
- Procedural woven textile texture with bump detail and matte fabric response.
- More natural shoulder and sleeve silhouette with cuff facings.
- V-neck facing, chest utility pocket, lower side pocket, hem and seam stitching.
- The existing hanger swing and scroll-controlled runway camera remain in place.

This is a procedural Three.js garment model, not a photogrammetry scan or imported cloth simulation asset.


## Photorealistic one-by-one scrub runway (latest update)

The hero's previous low-detail procedural scrub mesh is no longer the primary visual. The hero now uses four close-up photographic garment crops derived from the newly supplied YEVA rack photograph:
- Navy Blue
- Stone Grey
- Emerald Green
- Burgundy Red

Each photographic garment is mapped to a subdivided Three.js plane, with:
- Scroll-driven crossfades so the four colourways appear one at a time.
- Gentle hanger-like sway and rotation.
- Subtle animated mesh ripples around the lower fabric area.
- A live colourway label and 01/04 scene indicator.
- A chrome rail detail in the 3D showroom.

The source photo remains the visual source of truth for the garment styling and YEVA sleeve marks. The current approach is a photo-textured 3D presentation with animated mesh deformation; it is not yet a full cloth-simulated, independently modeled 3D garment/GLB.


## Scroll-driven 3D rack-to-hero garment animation (latest interaction update)

The hero now uses actual Three.js scrub-uniform meshes rather than fading photographic planes:
- Opening state: all four colourways hang together on one continuous overhead rack, each with its own 3D hanger.
- Scroll chapters: Navy, Stone Grey, Emerald Green and Burgundy are selected in order.
- Each selected outfit physically travels from its rack position toward the camera/right-side hero area, grows from rack scale to hero scale, swings and rotates on its hanger, then returns to its original slot before the next outfit moves.
- The scrub top has a volumetric torso, rounded tapered sleeves, V-neck, pockets, seam details, woven textile material and subtle secondary fabric-fold deformation.
- Matching trousers have separate rounded leg volume and move as part of the same hanging outfit.
- The rack and all remaining outfits stay visible while one outfit is being presented.
- Navigation scene dots jump to the middle of each garment's pull-forward moment.

This is procedural real-time 3D geometry and animated mesh deformation. It is not a scanned garment or a full physics-based cloth simulation.


### Animation refinement: rail glide before pull-forward

The selected hanger now follows a two-part motion path:
1. It first glides sideways along the shared rack rail toward the presentation position.
2. It then moves forward toward the camera while the outfit scales up and swings.
3. It settles into the hero position for a clear product view, then reverses back to its original hanger slot as the next outfit is selected.

The first 12% of the scroll keeps all four colourways together in the opening rack view. The four following scroll chapters select one outfit at a time.


## Realistic YEVA scrub textile material update

The garment shader/material has been upgraded from a simple crosshatch bump texture to a layered procedural PBR textile:
- 512×512 woven warp-and-weft albedo texture with subtle yarn irregularity and fine fibre flecks.
- Generated tangent-space normal map derived from the weave relief.
- Per-pixel roughness map for a less plastic, more textile-like response.
- High-roughness poly-cotton / stretch-scrub finish with restrained fabric sheen.
- Neutral greyscale textile maps are multiplied by the four garment colourways so navy, stone grey, emerald and burgundy remain distinct.
- The normal and roughness maps use linear colour space; the albedo map uses sRGB.

This improves the material response under the showroom lights. It remains a procedural approximation rather than a scan of the actual YEVA fabric. For a one-to-one match to the real garment, provide a close-up, evenly lit fabric photograph (ideally showing a few centimetres of the weave) and use it as the albedo/normal/roughness source.


## Reference-video interaction update: hover, select, colourways and product focus

The 3D clothing rail now supports the key interaction pattern from the supplied 26-second reference video:
- All four YEVA scrub sets remain displayed on individual hangers along the rail.
- Hovering a hanging outfit rotates it toward a front-facing view and changes the cursor.
- Clicking an outfit moves that complete hanger + scrub top + trouser set forward into a larger product-presentation position.
- A focused product-detail overlay opens with previous/next product controls.
- Colour swatches update the selected 3D scrub material live (navy, stone grey, emerald and burgundy).
- Size controls (XS–2XL) and an Add to Bag interaction are included in the product panel.
- The product overlay can be closed to return to the full hanging rail.

The Add to Bag control is currently a front-end interaction/demo counter. It must be connected to the Shopify Storefront API/cart before accepting real orders. Product titles, sizes, colours and price/inventory should ultimately be loaded from the YEVA Shopify catalogue.


## Reference-video garment interaction update (latest)

The rack garments now use photoreal YEVA scrub-top product artwork instead of the low-poly extruded scrub meshes:
- A realistic navy scrub product render on a wooden hanger is used as the master product asset.
- Stone grey, emerald and burgundy colourways are generated by recolouring the scrub textile while preserving the image's lighting, shadows, folds, stitching and hanger.
- Transparent garment PNGs are mapped onto subdivided, gently curved Three.js surfaces.
- The garments drop into position on the shared rail with a staggered settling animation.
- Each garment hangs at an angled side view and turns toward the visitor on hover.
- Clicking a garment opens a reference-style product focus: blurred showroom background, large animated garment image, previous/next arrows, live colourway selection, size selection, price/stock presentation and Add to Bag demo.
- Colourway changes update the focused garment artwork and the corresponding rack item.

Important implementation detail: this is a photo-realistic product render mapped to a curved interactive Three.js surface (a 2.5D/3D product presentation), not a fully modeled volumetric cloth garment. A true all-angle garment model would require a garment-specific GLB/FBX model or a cloth-simulation asset. The current assets are visually much more realistic than the earlier primitive mesh garments and match the interaction shown in the supplied video more closely.
