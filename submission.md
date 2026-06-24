# Software Developer Task Submission - The Peptide App: Tracker MVP

Here are the deliverables for the software developer task submission for the MVP clone of **The Peptide App: Tracker**.

---

## 1. Live Deployment URL
* **MVP Hosted Link:** https://peptide-app-tracker.vercel.app


---

## 2. GitHub Repository
* **Codebase Link:** https://github.com/Shivrajbakare/peptide-app-tracker

---

## 3. Video Walkthrough
* **Walkthrough Video Link:** https://drive.google.com/file/d/14-anYR-1MGElMVC6vhjd3Pmxn8SzKOeS/view?usp=sharing



## MVP Technical Architecture Highlights

* **Desktop iPhone Bezel Simulator:** Responsive CSS frame that simulates a mobile environment on larger screens, automatically adapting to native screen viewport on actual mobile devices.
* **Out-of-Line Science Library:** All peptide profiles (BPC-157, TB-500, CJC-1295, Ipamorelin, Semaglutide, GHK-Cu) are separated into a modular data file (`data/peptides.js`) for cleanliness and extendability.
* **Confetti Engine:** Lightweight, custom-built canvas particle burst simulation, executing entirely locally without external script overhead.
* **Interactive SVG Syringe:** Plunger and fluid levels render dynamically using formula-derived units:
  $$\text{Units} = \frac{\text{Dose (mcg)}}{\text{Vial Size (mg)} \times 1000} \times \text{BAC Water (ml)} \times \text{Syringe capacity}$$
* **Local Storage State Engine:** Fully client-side state machine ensuring user data and metrics logs are private-by-default.
