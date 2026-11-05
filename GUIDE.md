# Diet Coke 3D Interactive Experience — Complete 15-Step Guide & Prompts

A complete step-by-step prompt engineering and implementation guide for building the **Diet Coke 3D Interactive Experience** (`https://diet-coke-inspired-experience.vercel.app/`), featuring Three.js procedural 3D modeling, dynamic 2D canvas texture generation, GSAP ScrollTrigger timeline scrubbing, fluid pouring simulation, Lenis smooth scrolling, and mobile haptic feedback.

---

## Step 1 of 15: Project Architecture & Dependencies Setup
```text
Initialize a modern, high-performance web project with Vite, Three.js, GSAP (including ScrollTrigger), and Lenis smooth scrolling. Set up the directory structure:
1. /public with high-res brand assets (diet-coke-mark.png, diet-coke-editorial.png, flavor lineup images, favicon.svg)
2. /src containing main.js, can.js, pour.js, feedback.js, and style.css
3. Configure package.json with dependencies: "three": "^0.170.0", "gsap": "^3.12.5", "lenis": "^1.1.18", and "vite": "^6.0.0".
4. Ensure ES modules and modern bundler target configurations are enabled.
```
*Establishes the foundation of the 3D scroll experience with Vite for zero-lag hot reloading, Three.js for procedural WebGL rendering, GSAP for timeline scrubbing, and Lenis for smooth scrolling.*

---

## Step 2 of 15: Base Design Tokens, Typography & Lenis CSS
```text
Implement the brand design tokens and typography:
1. Load Google Fonts DM Sans (400, 500, 600, 700) and Oswald (500, 600, 700).
2. Configure CSS custom properties: --red: #e5001b (Coke Red), --black: #181819, --silver: #d9dbdc, --bg: #ececeb.
3. Configure universal box-sizing, smooth scroll reset, and selection highlight in brand red.
4. Add Lenis smooth scroll CSS rules: html.lenis, html.lenis body { height: auto }, and .lenis.lenis-stopped { overflow: clip }.
```
*Defines the signature high-fashion aesthetic, contrasting condensed Oswald editorial headlines with crisp DM Sans body copy and brand color variables.*

---

## Step 3 of 15: Minimal Brand Header & Mobile Slide-Out Drawer
```text
Create the sticky/absolute header and mobile slide-out navigation:
1. Left: Diet Coke silver mark logo linking to top.
2. Center: Desktop navigation menu (THE EXPERIENCE, THE POUR, OUR STORY, THE LINEUP, THE DETAILS) with 10px uppercase tracking and hover color shifts.
3. Right: "FIND YOUR FIZZ ↗" pill CTA button with hover translation and mobile hamburger toggle button with morphing lines.
4. Mobile menu: Fullscreen slide-down drawer with large condensed Oswald links (numbered 01 to 05), backdrop blur, and smooth transition.
```
*Builds the responsive navigation shell that adapts between a high-fashion desktop navbar and an animated full-screen red drawer on mobile viewports.*

---

## Step 4 of 15: Hero Stage Layout, Red Stripe & Watermark Architecture
```text
Build the Hero Stage DOM structure and visual backdrop:
1. A 100svh pinned stage with radial lighting gradient (#f7f7f5 to #cbd0d1).
2. Subtle SVG fractal noise texture overlay with pointer-events: none.
3. Signature bold vertical red stripe positioned at 61% left with 13% width.
4. Concentric circular dashed orbits centered behind the can.
5. Massive outlined watermark text "TASTE" with -webkit-text-stroke: 1px rgba(23, 23, 25, 0.11).
6. Left editorial headline: "JUST FOR THE TASTE OF IT." with red italic accent and Discover pill button.
7. Right floating badge aside and bottom scroll cues ("SCROLL TO ROTATE", live progress line, "01 / 03" counter).
```
*Creates the editorial backdrop surrounding the 3D can, establishing depth, texture, and typographical tension before 3D rendering begins.*

---

## Step 5 of 15: Procedural Brushed Aluminum Can Label Generator
```text
Write a procedural canvas texture generator createCanLabelTexture() in src/can.js:
1. Create an offscreen 2048x2048 HTML5 canvas wrapped in a THREE.CanvasTexture with SRGBColorSpace and anisotropy = 8.
2. Render a multi-stop linear gradient replicating brushed aluminum reflection highlights (#b8bec0, #f4f4f1, #aeb4b6, #f8f8f5, #c2c7c7).
3. Draw the Diet Coke brand mark repeated at horizontal intervals [0, 1024, 2048] for seamless 360-degree cylinder wrapping.
4. Render sharp brand typography: "NO SUGAR", "NO CALORIES", and "12 FL OZ • 355 mL" in bold Arial/sans-serif.
5. Procedurally generate 180 condensation water droplets with translucent white radial fill and dark refractive rim strokes.
```
*Eliminates heavy image downloads by generating a photorealistic, ultra-crisp brushed aluminum texture with condensation directly in memory via 2D Canvas.*

---

## Step 6 of 15: 3D Diet Coke Can Procedural Geometry & Materials
```text
Implement createCanMesh() in src/can.js:
1. Create THREE.MeshStandardMaterial instances: brushed metal (metalness: 0.68, roughness: 0.29), rim metal, and label body material with the procedural canvas texture.
2. Main body: THREE.CylinderGeometry(0.76, 0.76, 3.42, 128, 1, true).
3. Tapered neck & beveled chine: stack CylinderGeometry and TorusGeometry rings for the realistic double-rolled top rim and recessed bottom dome.
4. Mouth aperture: THREE.CircleGeometry(0.12, 32) placed at (0, 2.008, -0.25) with dark interior material, initially hidden.
5. Articulated pull-tab: THREE.Group with TorusGeometry pull ring and SphereGeometry rivet positioned at (0, 2.025, -0.06).
6. Return { can, tabPivot, aperture }.
```
*Builds an authentic 3D soda can from mathematical primitives, complete with realistic rim contours and a mechanical pull-tab ready to animate.*

---

## Step 7 of 15: Hero WebGL Canvas, Studio Lighting & Viewport Sync
```text
Implement initHeroExperience() in src/can.js:
1. Select #can-canvas inside .can-wrap and instantiate THREE.WebGLRenderer with alpha: true, antialias: true, and high-performance power preference.
2. Set toneMapping to THREE.ACESFilmicToneMapping with exposure 1.35 and SRGBColorSpace.
3. Setup THREE.PerspectiveCamera (FOV 32) and studio lighting:
   - HemisphereLight(0xffffff, 0x7d8388, 2.4)
   - DirectionalLight key light (intensity 3.3) at (-4, 6, 8)
   - DirectionalLight fill light (intensity 2.2) at (4, 2, -3)
4. Add the 3D can at initial rotation (0.05, Math.PI, -0.12).
5. Attach a ResizeObserver to .can-wrap to update renderer dimensions, aspect ratio, and camera distance dynamically.
```
*Sets up studio-grade photographic lighting and ACES Filmic tone mapping so the aluminum can looks tactile, crisp, and metallic across all screen resolutions.*

---

## Step 8 of 15: Apple-Style Scroll Scrubbing & 3D Can Rotation Engine
```text
Connect the 3D can to GSAP ScrollTrigger:
1. Pin .hero-stage for 220% scroll distance with scrub: 1 and invalidateOnRefresh: true.
2. Scrub can.rotation.y smoothly across 3.9 * PI (full multi-angle spin).
3. Add gentle sine.inOut wobble to can.rotation.x and can.rotation.z, plus a subtle vertical bobbing on can.position.y.
4. Parallax the background: scrub .hero-watermark by -12% xPercent, .red-stripe by +28% xPercent, and fade .hero-copy.
5. In onUpdate, scale the scroll progress bar (scaleX) and increment the step indicator (01 to 03).
6. Attach an IntersectionObserver to pause the render loop whenever the stage is scrolled out of view.
```
*Converts the user's scroll gestures into silky, scrubbable 3D choreography, giving the impression of an Apple or Nike interactive product showcase.*

---

## Step 9 of 15: Marquee Ticker & Quick Nutrition Fact Counters
```text
Add the transition marquee and quick facts section:
1. .ticker: 58px red ribbon with infinitely scrolling text ("STAY EXTRAORDINARY ✳ JUST FOR THE TASTE OF IT") driven by CSS keyframe transform: translate(-50%).
2. .quick-facts: 3-column banner with border dividers:
   - 0g SUGAR (large Oswald condensed 100px red font)
   - 0 CALORIES
   - 1982 THE YEAR IT ALL BEGAN
3. Responsive rules collapsing to single/double columns on mobile devices.
```
*Provides dynamic typographical momentum between the hero experience and the pour simulation, highlighting Diet Coke's zero-calorie credentials.*

---

## Step 10 of 15: 3D Glassware Lathe Geometry & Liquid Materials
```text
Create createGlassware() in src/pour.js:
1. Generate a glassware lathe using THREE.LatheGeometry(points, 96) from 2D profile coordinates defining a tapered highball cocktail glass.
2. Use THREE.MeshPhongMaterial with opacity: 0.2, specular highlights, and DoubleSide for glass transparency.
3. Add top and base rim TorusGeometry meshes with white specular shine and vertical edge reflection lines.
4. Liquid cylinder: THREE.CylinderGeometry(0.6, 0.46, 1, 80) with dark amber cola material (#4a190a, specular: 0xa65822), anchored at base.
```
*Constructs mathematically accurate glassware and liquid volumes ready to receive cola poured from the 3D can.*

---

## Step 11 of 15: Dynamic Foam Head & Rising Carbonation Bubbles
```text
Add foam and carbonation bubbles in src/pour.js:
1. Foam head: THREE.CylinderGeometry(0.59, 0.59, 0.1, 64) with creamy froth material (#d7b2ab, opacity: 0.88), positioned to rise on top of the cola cylinder.
2. Carbonation fizz: create 28 THREE.SphereGeometry(0.025) bubbles distributed within the soda volume with translucent pinkish-white material.
3. Write an animation update loop that raises bubble positions with phase cycling: (i * 0.371 + phase * 3) % 1 to create realistic rising fizz.
```
*Simulates the effervescence of freshly poured carbonated soda with rising micro-bubbles and an expanding foam surface.*

---

## Step 12 of 15: Interactive 3D Pour Stream & ScrollTrigger Orchestration
```text
Implement initPourExperience() in src/pour.js:
1. Connect 3D can and glassware in a second pinned stage (.pour-stage, 320% scroll distance).
2. Pour stream: generate a dynamic THREE.TubeGeometry along a 3D CatmullRomCurve3 connecting the can mouth aperture to the glass center.
3. Master GSAP timeline:
   - 0.12s: pull-tab rotates open (tabPivot.rotation.x = -0.85) and aperture reveals
   - 0.8s: can translates and tilts down into pouring angle
   - 1.75s: stream mesh scales into visibility and flow reaches 1
   - 1.95s: cola liquid level and foam disc rise from 0 to 0.98
   - 3.75s: stream cuts off, can rights itself and recedes
4. Update step text: "01 CRACK IT OPEN" -> "02 THE PERFECT POUR" -> "03 MAKE IT YOURS".
```
*The showstopper interactive feature: user scrolling directly pulls the tab, tilts the can, and pours soda into the glass with dynamic fluid physics.*

---

## Step 13 of 15: Editorial Brand Story & Heritage Milestone Timeline
```text
Build the Story & Heritage sections:
1. .intro: "YOUR TASTE. YOUR RULES." with editorial cards ("The Everyday Icon" with pour.jpg, "The Classics" with moment.png), hover image zooms, and chip badges.
2. .heritage: dark-themed section (#19191b) with header "AN ICON IN ITS OWN RIGHT." and 3-column milestone timeline:
   - 1982: A NEW KIND OF ICON (debut in New York)
   - 2018: AN ICON, REMIXED (refresh of signature silver & red)
   - TODAY: STILL YOUR TASTE (caffeine-free, cherry, and original)
3. Attach GSAP ScrollTrigger batch reveals on .reveal elements with subtle translateY and opacity transitions.
```
*Celebrates the historical milestones and cultural heritage of Diet Coke using clean magazine-style editorial layouts.*

---

## Step 14 of 15: Parallax Break Section & Interactive Flavor Lineup
```text
Implement the Break Banner, Moments Grid, and Flavor Lineup:
1. .break-section: Full-width photographic banner with scrubbed GSAP background parallax, white condensed headline, and white pill button.
2. .moments: 3-column photo grid highlighting "The First Sip", "A Little Twist", and "Your Kind of Break".
3. .lineup: Interactive product cards for the 3 iconic flavors:
   - 01 Diet Coke Original (Silver background)
   - 02 Diet Coke Cherry (Dusty Rose background #e8dce0)
   - 03 Caffeine Free (Warm Cream background #e9e3d4)
   Hover effects scale and subtly tilt the product cans with smooth CSS transitions.
```
*Engages users with product discovery and photography, showcasing the different flavors in a clean, modern grid.*

---

## Step 15 of 15: Nutrition Facts Card, Haptic Feedback & Accessibility Controls
```text
Finalize with Nutrition Facts, FAQ Accordion, Haptics, and Accessibility:
1. .details: Nutrition facts grid (0 Calories, 0g Sugars, 46mg Caffeine, 40mg Sodium).
2. .faq: Native accessible <details> accordion with animated plus-to-cross icons.
3. initScrollFeedback() in src/feedback.js: supports navigator.vibrate([100, 25, 100]) on touch devices and pulsing border flash on scroll.
4. Reduced Motion: detect prefers-reduced-motion media query, offer an on-screen toggle button to enable/disable 3D motion, persist choice to localStorage, and display fallback photography when motion is disabled.
```
*Delivers production-grade polish, tactile mobile haptics, full WCAG accessibility, and responsive fallbacks for users with motion sensitivity.*
