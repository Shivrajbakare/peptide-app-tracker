/**
 * The Peptide App: Scientific Peptide Library Data
 * Curated list of peptides, including mechanisms of action, recommended dosing, and safety sources.
 */
window.PEPTIDE_LIBRARY = [
  {
    id: "bpc-157",
    name: "BPC-157",
    fullName: "Body Protection Compound 157",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    tagline: "Accelerates tissue healing, tendon repair, and gut health.",
    vialSizes: [5, 10], // in mg
    defaultVialSize: 5,
    defaultBacWater: 2, // in ml
    typicalDoses: [
      { label: "Standard Healing Dose", value: 250, unit: "mcg" },
      { label: "Aggressive Recovery Dose", value: 500, unit: "mcg" }
    ],
    mechanism: "BPC-157 is a pentadecapeptide composed of 15 amino acids, derived from a protective protein found in human gastric juice. It works by accelerating angiogenic repair (building new blood vessels), modulating growth factor receptors (specifically EGR-1 and VEGFR2), and promoting collagen synthesis. It has been shown to counteract the inflammatory effects of NSAIDs and promote systemic healing.",
    benefits: [
      "Accelerates tendon, ligament, and muscle healing",
      "Reduces localized systemic inflammation",
      "Promotes angiogenesis (formation of new blood vessels)",
      "Protects and heals the gastric tract mucosal lining",
      "Alleviates symptoms of joint pain and arthritis"
    ],
    sideEffects: [
      "Mild headache upon initial injection",
      "Local skin redness or irritation at injection site",
      "Temporary fatigue or lethargy in sensitive individuals"
    ],
    reconstitution: "Reconstitute BPC-157 using Bacteriostatic (BAC) Water. A ratio of 2.0ml BAC water per 5mg vial is highly recommended for easy dosing calculations, producing a concentration of 2.5mg/ml (250mcg per 0.1ml / 10 units on a standard U-100 syringe). Store in the refrigerator immediately after reconstitution. Avoid shaking; gently swirl the vial instead.",
    sources: [
      "Sikiric, P., et al. (2018). 'Stable gastric pentadecapeptide BPC 157, novel therapy in gastrointestinal tract.' Current Pharmaceutical Design.",
      "Chang, C. H., et al. (2011). 'The promoting effect of pentadecapeptide BPC 157 on tendon healing.' Journal of Orthopaedic Research.",
      "Seiwerth, S., et al. (2014). 'BPC 157 and blood vessels.' Current Pharmaceutical Design."
    ]
  },
  {
    id: "tb-500",
    name: "TB-500",
    fullName: "Thymosin Beta-4 Active Fragment",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    tagline: "Promotes cell migration, muscle regeneration, and flexibility.",
    vialSizes: [5, 10],
    defaultVialSize: 5,
    defaultBacWater: 2,
    typicalDoses: [
      { label: "Maintenance Dose", value: 1000, unit: "mcg" },
      { label: "Loading Protocol (twice weekly)", value: 2500, unit: "mcg" }
    ],
    mechanism: "TB-500 is a synthetic version of the active region of Thymosin Beta-4, a naturally occurring peptide present in high concentrations in wound fluids. It up-regulates actin, a cellular protein critical for muscle contraction and cell mobility. By promoting actin polymerization and increasing cell migration, it accelerates tissue recovery and reduces scar tissue formation in injured muscle and connective tissues.",
    benefits: [
      "Promotes rapid wound and skin tissue repair",
      "Enhances muscle cell migration and regeneration",
      "Improves range of motion and joint flexibility",
      "Prevents adhesion and fibrous scar tissue formation",
      "Stimulates hair growth and counteracts follicle shrinking"
    ],
    sideEffects: [
      "Mild lethargy or fatigue shortly after administration",
      "Head rush or mild blood pressure drop during injection",
      "Itchiness or redness around the injection site"
    ],
    reconstitution: "Add 2.0ml of BAC Water to a 5mg vial. This creates a concentration of 2.5mg/ml. Since TB-500 is often dosed in milligrams (e.g. 2.5mg per dose), this ratio yields exactly 0.5ml or 50 units for a 2.5mg dose. Ensure it remains refrigerated.",
    sources: [
      "Philp, D., et al. (2003). 'Thymosin beta4 promotes angiogenesis, wound healing, and hair follicle development.' Annals of the New York Academy of Sciences.",
      "Sosne, G., et al. (2010). 'Thymosin beta4: A novel corneal wound healing agent.' Vitamins and Hormones."
    ]
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    fullName: "Mod GRF 1-29 (Growth Hormone Releasing Factor)",
    category: "longevity",
    categoryLabel: "Longevity & Growth",
    tagline: "Stimulates natural GH release for fat loss and muscle recovery.",
    vialSizes: [2, 5],
    defaultVialSize: 2,
    defaultBacWater: 2,
    typicalDoses: [
      { label: "Standard Anti-Aging Dose", value: 100, unit: "mcg" },
      { label: "Athletic Performance Dose", value: 150, unit: "mcg" }
    ],
    mechanism: "CJC-1295 (specifically without DAC, also known as Mod GRF 1-29) is a synthetic analogue of Growth Hormone-Releasing Hormone (GHRH). It acts on the pituitary gland to stimulate the release of endogenous growth hormone in a pulsatile manner. Because it preserves natural GH spikes, it avoids the safety issues associated with synthetic HGH administration.",
    benefits: [
      "Increases lean muscle mass and cellular recovery",
      "Promotes deep delta-wave sleep cycles",
      "Enhances metabolic rate and fat oxidation",
      "Improves bone mineral density and skin quality",
      "Supports immune system response and cell cellular repair"
    ],
    sideEffects: [
      "Facial flushing or sensation of warmth (lasts 10-20 mins)",
      "Mild fluid retention or finger stiffness",
      "Increased hunger shortly after injecting"
    ],
    reconstitution: "Reconstitute a 2mg vial with 2.0ml of BAC water. This yields a clean 1000mcg/ml concentration, meaning a standard 100mcg dose is exactly 0.1ml (10 units on a 100-unit syringe). Refrigerate and shield from direct sunlight.",
    sources: [
      "Teichman, S. L., et al. (2006). 'Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I (IGF-I) secretion by CJC-1295.' Journal of Clinical Endocrinology & Metabolism."
    ]
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    fullName: "Ipamorelin Acetate",
    category: "longevity",
    categoryLabel: "Longevity & Growth",
    tagline: "A selective GH secretagogue with virtually zero cortisol/prolactin side effects.",
    vialSizes: [2, 5, 10],
    defaultVialSize: 2,
    defaultBacWater: 2,
    typicalDoses: [
      { label: "Anti-Aging/Sleep Dose", value: 100, unit: "mcg" },
      { label: "Performance Recovery Dose", value: 200, unit: "mcg" }
    ],
    mechanism: "Ipamorelin is a selective Growth Hormone Secretagogue Receptor (GHSR) agonist. It mimics ghrelin to trigger a pulse of Growth Hormone (GH) from the pituitary. Unlike older GH-releasing peptides (like GHRP-2 or GHRP-6), Ipamorelin is highly selective and does not stimulate the secretion of cortisol, prolactin, or aldosterone, preventing unnecessary water retention and anxiety.",
    benefits: [
      "Triggers high-quality, targeted GH release pulses",
      "Improves collagen density, nail growth, and skin tightness",
      "Accelerates post-workout muscle and joint recovery",
      "Improves sleep efficiency and duration",
      "Aids in visceral fat reduction"
    ],
    sideEffects: [
      "Mild, transient dizziness upon injection",
      "Slight skin tingling at the injection site",
      "Dry mouth or transient hunger spikes"
    ],
    reconstitution: "Reconstitute a 2mg vial with 2.0ml of BAC water for 1000mcg/ml (100mcg = 10 units). Frequently stacked with CJC-1295 in a single syringe to maximize GH release synergy. Store in cold refrigeration.",
    sources: [
      "Raun, K., et al. (1998). 'Ipamorelin, the first selective growth hormone secretagogue.' European Journal of Endocrinology."
    ]
  },
  {
    id: "semaglutide",
    name: "Semaglutide",
    fullName: "Semaglutide GLP-1 Analogue",
    category: "fat-loss",
    categoryLabel: "Fat Loss & Metabolism",
    tagline: "Improves insulin sensitivity, suppresses appetite, and aids fat loss.",
    vialSizes: [2, 5],
    defaultVialSize: 2,
    defaultBacWater: 2,
    typicalDoses: [
      { label: "Starter Dose (Weeks 1-4)", value: 250, unit: "mcg" },
      { label: "Escalation Dose (Weeks 5-8)", value: 500, unit: "mcg" },
      { label: "Therapeutic Dose (Weeks 9+)", value: 1000, unit: "mcg" }
    ],
    mechanism: "Semaglutide is a Glucagon-Like Peptide-1 (GLP-1) receptor agonist. It works by mimicking the natural incretin hormone GLP-1 to enhance glucose-dependent insulin secretion, slow gastric emptying, and act on the brain's satiety centers to suppress appetite. It has been extensively studied for chronic weight management.",
    benefits: [
      "Significantly reduces systemic appetite and food cravings",
      "Slows gastric transit, leading to prolonged feelings of fullness",
      "Enhances baseline insulin sensitivity and glucose uptake",
      "Promotes sustained, clinically significant weight reduction",
      "Lowers cardiovascular risks associated with obesity"
    ],
    sideEffects: [
      "Nausea, especially in the first 48 hours post-injection",
      "Mild constipation or diarrhea",
      "Transient acid reflux and stomach cramps"
    ],
    reconstitution: "Reconstitute 2mg with 2.0ml BAC water (concentration: 1000mcg/ml). The weekly starter dose of 250mcg (0.25mg) corresponds to 25 units (0.25ml) on a 100U syringe. Standard protocol calls for once-weekly sub-Q injection on a consistent weekday.",
    sources: [
      "Wilding, J. P. H., et al. (2021). 'Once-Weekly Semaglutide in Adults with Overweight or Obesity.' New England Journal of Medicine (STEP 1 Trial)."
    ]
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    fullName: "Copper Peptide GHK-Cu",
    category: "skin",
    categoryLabel: "Skin & Hair",
    tagline: "Spars collagen growth, reduces wrinkles, and heals skin tissue.",
    vialSizes: [50, 100],
    defaultVialSize: 50,
    defaultBacWater: 5,
    typicalDoses: [
      { label: "Daily Cosmetic Dose", value: 2000, unit: "mcg" },
      { label: "Anti-Wrinkle Protocol", value: 4000, unit: "mcg" }
    ],
    mechanism: "GHK-Cu is a tripeptide (Glycyl-L-histidyl-L-lysine) with a strong affinity for copper. Copper is a trace element critical for enzymatic reactions that build bone, skin, and vascular tissue. GHK-Cu acts as a signal peptide, directing cells to produce glycosaminoglycans, decorin, and collagen. It also possesses anti-inflammatory properties, neutralizing free radicals and accelerating dermal recovery.",
    benefits: [
      "Significantly tightens loose skin and smooths fine wrinkles",
      "Improves dermal collagen density and elasticity",
      "Speeds up post-cosmetic procedure skin healing",
      "Protects skin cells from UV radiation DNA damage",
      "Strengthens hair follicles and encourages scalp blood flow"
    ],
    sideEffects: [
      "Sensation of stinging or burning at injection site (very common)",
      "Local swelling or slight bruising",
      "Mild headache if copper levels shift abruptly"
    ],
    reconstitution: "GHK-Cu vials are typically high-mass (e.g. 50mg). Reconstitute 50mg with 5.0ml BAC water (concentration: 10mg/ml, or 10,000mcg/ml). A daily dose of 2000mcg (2mg) is represented by 20 units (0.2ml) on a 100U syringe. GHK-Cu is notorious for causing temporary injection site burning; injecting slowly or diluting further with additional BAC water reduces this discomfort.",
    sources: [
      "Pickart, L., et al. (2018). 'Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data.' International Journal of Molecular Sciences."
    ]
  }
];

// List of pre-configured curated protocols
window.CURATED_PROTOCOLS = [
  {
    id: "injury-repair",
    name: "Wolverine Joint & Tissue Recovery",
    description: "Designed to accelerate healing in tendons, ligaments, and muscle tears. Combines the localized repair signals of BPC-157 with the systemic tissue cell migration properties of TB-500.",
    duration: 6, // weeks
    difficulty: "Intermediate",
    goal: "healing",
    peptides: [
      {
        peptideId: "bpc-157",
        dose: 250,
        unit: "mcg",
        frequency: "daily",
        frequencyLabel: "Every morning",
        instructions: "Inject 250mcg subcutaneously near the site of injury or in the abdomen."
      },
      {
        peptideId: "tb-500",
        dose: 2500,
        unit: "mcg",
        frequency: "twice-weekly",
        frequencyLabel: "Tuesdays & Fridays",
        instructions: "Inject 2.5mg (2500mcg) subcutaneously in the abdomen."
      }
    ]
  },
  {
    id: "gh-longevity",
    name: "Youthful Sleep & Recovery Protocol",
    description: "The gold-standard growth hormone secretagogue combination. CJC-1295 and Ipamorelin act synergistically on the pituitary gland to encourage fat oxidation, skin rejuvenation, and deep sleep.",
    duration: 12, // weeks
    difficulty: "Beginner",
    goal: "longevity",
    peptides: [
      {
        peptideId: "cjc-1295",
        dose: 100,
        unit: "mcg",
        frequency: "cyclical",
        frequencyLabel: "Nightly (5 days on / 2 days off)",
        instructions: "Inject 100mcg subcutaneously before bed on an empty stomach (at least 2 hours post-meal)."
      },
      {
        peptideId: "ipamorelin",
        dose: 150,
        unit: "mcg",
        frequency: "cyclical",
        frequencyLabel: "Nightly (5 days on / 2 days off)",
        instructions: "Inject 150mcg subcutaneously alongside CJC-1295 before bed on an empty stomach."
      }
    ]
  },
  {
    id: "metabolic-slim",
    name: "Metabolic Control & Fat Loss",
    description: "A steady weight loss and insulin-sensitizing cycle utilizing Semaglutide. Features a slow titration schedule to manage appetite, enhance glycemic control, and reduce gastrointestinal side effects.",
    duration: 8,
    difficulty: "Advanced",
    goal: "fat-loss",
    peptides: [
      {
        peptideId: "semaglutide",
        dose: 250, // standard starting
        unit: "mcg",
        frequency: "weekly",
        frequencyLabel: "Once a week (e.g. Sunday mornings)",
        instructions: "Inject 250mcg (0.25mg) subcutaneously on the same day each week. Increase to 500mcg after 4 weeks if tolerated."
      }
    ]
  }
];
