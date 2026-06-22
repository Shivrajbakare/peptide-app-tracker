# The Peptide App: Tracker MVP

A premium, high-fidelity responsive Single Page Application (SPA) clone of **The Peptide App: Tracker** iOS health tracking application.

Designed using the app's official organic color scheme (warm cream, deep forest pine, and warm terracotta accents). When loaded on desktop browsers, the application is presented inside a simulated high-fidelity iPhone 14 frame, which automatically scales to a native, edge-to-edge view on mobile screens.

---

## Key Features

1. **3-Step Onboarding Flow**
   * **Goal Matcher:** Selects primary health targets (Healing, Longevity, Fat Loss, Skin) to automatically pre-configure recommended starting protocols.
   * **Experience Profiles:** Adapts instructions and ranges for *Beginners*, *Intermediates*, or *Advanced* users.
   * **Private Setup:** Saves user details and confirms that data is stored 100% locally and privately in the browser's storage (`LocalStorage`).

2. **Today Dashboard (Command Center)**
   * **Weekly Progress Ring:** An interactive SVG circular progress ring indicating daily routine completion percentage.
   * **Streak Tracking:** Displays active consecutive daily logging streaks with flame animations.
   * **Regimen Checklist:** Real-time scheduling showing doses due today (e.g. daily, weekly, twice-weekly, cyclical 5-on/2-off schedules).
   * **Confetti Engine:** Custom HTML5 canvas physics particle burst upon checking off a dose.

3. **Explore Protocols & Custom Stack Builder**
   * **Curated Regimens:** Standard clinical stack outlines (e.g., *Wolverine Joint/Tissue Recovery*, *Youthful sleep cycle*, *Metabolic control*).
   * **Custom Builder:** Create tailored cycles by specifying compound, dose size, custom frequency, duration, and reminders.

4. **Reconstitution & Syringe Draw Calculator**
   * **Interactive Formula:**
     $$\text{Units to Draw} = \left(\frac{\text{Desired Dose (mcg)}}{\text{Peptide vial size (mg)} \times 1000}\right) \times \text{BAC water (ml)} \times \text{Syringe Units (Capacity)}$$
   * **Dynamic Syringe SVG Guide:** Visually draws a syringe barrel, needle, rubber seal, and plunger. The plunger and liquid level animate to show the exact fill line.
   * **Warnings:** Triggers indicators if calculated dose volume exceeds current syringe capacity.

5. **Science & Peptide Library**
   * Instant search across scientific profiles (BPC-157, TB-500, CJC-1295, Ipamorelin, Semaglutide, GHK-Cu, NAD+).
   * Detailed breakdown sheets covering Cellular Mechanism, Dosing Ranges, Reconstitution, Side Effects, and PubMed clinical trial sources.

6. **Profile, Settings & Interactive History Calendar**
   * Monthly compliance grid showing days where all doses were successfully checked. Tapping a day displays historic details.
   * **Outcome Metric Logs:** Track body weight, energy metrics, and pain levels over the cycle duration.
   * Toggle Light/Dark themes and perform secure Local Storage data dumps (Export/Wipe database).

---

## File Structure

```
peptide-app-tracker/
├── index.html            # Main entry point & screen templates
├── style.css             # Premium CSS Design System (Light/Dark themes)
├── app.js                # State machine, Router, Confetti, and SVG Syringe math
├── data/
│   └── peptides.js       # Curated scientific library & protocols database
├── assets/
│   └── app-icon.png      # Generated application logo
└── README.md             # Project documentation
```

---

## Local Verification & Launch

To test the application locally, start a static web server:

1. Using **Python**:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your web browser.

2. Using **Node.js (http-server)**:
   ```bash
   npx -y http-server -p 8000
   ```

---

## Production Deployment (Vercel)

Deploy the MVP to Vercel instantly:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy directly:
   ```bash
   vercel --prod
   ```
