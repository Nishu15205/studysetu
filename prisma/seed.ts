/**
 * Seed script — copyright-safe starter data.
 * - Boards, classes, subjects, real NCERT chapter NAMES (names/facts are not copyrightable)
 * - ORIGINAL AI-free seed notes written from scratch (no textbook text)
 * - Paper metadata linking to OFFICIAL board websites only (no paper files stored)
 * - ORIGINAL practice questions
 * Run: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ---------- data ----------
const BOARDS = [
  { code: "CBSE", name: "CBSE", fullName: "Central Board of Secondary Education", region: "Delhi · Noida · UP", website: "https://cbse.gov.in/cbsenew/question-paper.html" },
  { code: "HBSE", name: "HBSE", fullName: "Haryana Board of School Education (BSEH)", region: "Haryana", website: "https://bseh.org.in" },
  { code: "BSEB", name: "BSEB", fullName: "Bihar School Examination Board", region: "Bihar", website: "https://biharboardonline.bihar.gov.in" },
  { code: "KERALA", name: "Kerala Board", fullName: "DHSE Kerala / SCERT Kerala", region: "Kerala", website: "https://dhsekerala.gov.in" },
];

type SubDef = { name: string; slug: string; chapters: string[] };

const GENERIC_LANG = (cls: string): SubDef[] => [
  { name: "English", slug: "english", chapters: ["Reading Comprehension", "Writing Skills & Grammar", "Literature – Prose", "Literature – Poetry", "Vocabulary & Usage"] },
  { name: "Hindi", slug: "hindi", chapters: ["अपठित गद्यांश (Unseen Passage)", "व्याकरण (Grammar)", "पत्र व निबंध लेखन (Writing)", "काव्य खंड (Poetry)", "गद्य खंड (Prose)"] },
];

const CURRICULUM: Record<number, SubDef[]> = {
  9: [
    { name: "Maths", slug: "maths", chapters: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"] },
    { name: "Science", slug: "science", chapters: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Improvement in Food Resources"] },
    { name: "Social Science", slug: "social-science", chapters: ["India – Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "What is Democracy? Why Democracy?", "Constitutional Design", "Electoral Politics", "Democratic Rights", "The French Revolution", "Nazism and the Rise of Hitler"] },
    ...GENERIC_LANG("9"),
  ],
  10: [
    { name: "Maths", slug: "maths", chapters: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"] },
    { name: "Science", slug: "science", chapters: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"] },
    { name: "Social Science", slug: "social-science", chapters: ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "Print Culture and the Modern World", "Resources and Development", "Water Resources", "Agriculture", "Manufacturing Industries", "Power Sharing", "Federalism", "Political Parties", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"] },
    ...GENERIC_LANG("10"),
  ],
  11: [
    { name: "Physics", slug: "physics", chapters: ["Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"] },
    { name: "Chemistry", slug: "chemistry", chapters: ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry – Some Basic Principles and Techniques", "Hydrocarbons"] },
    { name: "Maths", slug: "maths", chapters: ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"] },
    { name: "Biology", slug: "biology", chapters: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Photosynthesis in Higher Plants", "Respiration in Plants", "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Neural Control and Coordination", "Chemical Coordination and Integration"] },
    { name: "Economics", slug: "economics", chapters: ["Introduction to Economics", "Collection & Organisation of Data", "Presentation of Data", "Measures of Central Tendency", "Correlation", "Index Numbers", "Indian Economy (1950-1990)", "Economic Reforms since 1991", "Poverty & Rural Development"] },
    ...GENERIC_LANG("11"),
  ],
  12: [
    { name: "Physics", slug: "physics", chapters: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"] },
    { name: "Chemistry", slug: "chemistry", chapters: ["Solutions", "Electrochemistry", "Chemical Kinetics", "The d- and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"] },
    { name: "Maths", slug: "maths", chapters: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"] },
    { name: "Biology", slug: "biology", chapters: ["Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"] },
    { name: "Economics", slug: "economics", chapters: ["National Income & Related Aggregates", "Money and Banking", "Determination of Income and Employment", "Government Budget", "Open Economy Macroeconomics", "Development Experience of India", "Employment & Infrastructure", "Sustainable Development"] },
    ...GENERIC_LANG("12"),
  ],
};

// ORIGINAL seed notes (written from scratch for this project — no textbook text)
const SEED_NOTES: Record<string, string> = {
  "10-maths-1": `# Real Numbers — Revision Notes

## Introduction
Real numbers combine every rational and irrational number into one family, and this chapter builds the number toolbox you will use all through Class 10 board maths. Two big ideas drive the exam: the **Fundamental Theorem of Arithmetic** (prime factorisation) and **irrationality proofs**.

## Key Concepts

### Euclid's Division Lemma
For any two positive integers a and b, there exist unique integers q (quotient) and r (remainder) such that a = bq + r, with 0 ≤ r < b. It is the formal way of saying "divide and write the remainder". It powers the **Euclid division algorithm**, a step-by-step method to compute the HCF of two numbers: keep dividing the divisor by the remainder until the remainder becomes 0; the last non-zero remainder is the HCF.

### Fundamental Theorem of Arithmetic
Every composite number can be written as a product of primes, and this factorisation is unique apart from the order of factors. For example, 84 = 2 × 2 × 3 × 7, no matter how you start. This uniqueness is why HCF and LCM can be computed from prime factorisations: HCF takes the **lowest power** of common primes, LCM takes the **highest power** of all primes present.

### HCF × LCM relation
For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b. Handy shortcut: find the HCF first, then divide a × b by it to get the LCM. Note this product rule is valid for **two** numbers only — for three numbers you must find each value separately.

### Irrational numbers
A number is irrational if it cannot be written as p/q with integers p, q (q ≠ 0). Their decimal expansions are non-terminating and non-repeating. The classic exam proof shows √2, √3 or √5 are irrational by contradiction: assume √2 = p/q in lowest terms, show both p and q must then be even, contradicting "lowest terms".

### Decimal expansion logic
For a rational p/q in lowest terms, the expansion terminates exactly when the prime factorisation of q contains only 2s and/or 5s; otherwise it repeats. This gives quick one-mark answers like "17/3125 terminates because 3125 = 5⁵".

## Example
Find HCF and LCM of 26 and 91.
- 26 = 2 × 13; 91 = 7 × 13.
- HCF = 13 (common prime, lowest power).
- LCM = 2 × 7 × 13 = 182 (all primes, highest power).
- Check: 13 × 182 = 2366 = 26 × 91 ✓

## Quick Revision
- HCF: product of common primes with lowest powers.
- LCM: product of all primes with highest powers.
- HCF × LCM = product of the two numbers.
- Every composite number has a unique prime factorisation.
- √2, √3, √5 are irrational; sums of rational + irrational are always irrational.
- p/q terminates ⇔ q (lowest form) has only 2s and 5s.
- Euclid's algorithm: last non-zero remainder = HCF.

## Exam Tips
- The 3-mark "prove √n is irrational" proof needs the "assume lowest terms → contradiction" structure; write every step.
- Word problems on bells/traffic lights/tanks circling together usually need **LCM**; splitting into groups needs **HCF**.
- Never skip writing the given/assumption lines in proofs — step marking rewards them.
- Practise mixed questions where HCF/LCM of three numbers is asked; the product shortcut fails there.
- Keep factorisation of numbers up to 100 memorised for speed.`,
  "10-science-1": `# Chemical Reactions and Equations — Revision Notes

## Introduction
This opening chapter trains you to read and write chemical equations correctly and to classify reactions — the skill behind almost every later chemistry chapter. Expect 3-5 marks from this chapter in boards, mostly as equation-based questions.

## Key Concepts

### Writing a balanced equation
A chemical equation must obey the **law of conservation of mass**: atoms of each element must be equal on both sides. Balancing is done by adjusting coefficients (the big numbers), never the subscripts. States are shown as (s), (l), (g), (aq). Conditions like heat are written above the arrow.

### Combination & decomposition
- **Combination**: two or more reactants form one product, e.g. CaO + H₂O → Ca(OH)₂ + heat. Quicklime slaking is strongly exothermic.
- **Decomposition**: one reactant breaks into several, needing energy: thermal (heat), electrolytic (electricity, e.g. water → H₂ + O₂), or photolytic (light, e.g. silver chloride greying in sunlight — used in photography).

### Displacement & double displacement
- **Displacement**: a more reactive metal pushes out a less reactive one from its salt solution, e.g. Fe + CuSO₄ → FeSO₄ + Cu (blue fades to green). The reactivity series decides who wins.
- **Double displacement**: ions swap partners. If an insoluble solid forms, it is a **precipitation reaction**; if heat is released between two solutions, it is a **neutralisation**.

### Redox idea
Oxidation = gain of oxygen / loss of electrons; reduction = loss of oxygen / gain of electrons. In ZnO + C → Zn + CO, carbon is the reducing agent and zinc oxide is reduced. In photosynthesis the reverse pairing happens.

### Exothermic vs endothermic
Exothermic reactions release heat (respiration, burning, slaking of lime). Endothermic reactions absorb heat (decomposition of limestone, photosynthesis). Both are common 1-mark "identify the type" questions.

### Corrosion & rancidity
Corrosion: metal surface is attacked by air/moisture (rust on iron, black coating on silver, green patina on copper). Prevention: painting, oiling, galvanisation, alloying. Rancidity: fats/oils oxidise giving bad smell; prevented by antioxidants, airtight packaging, nitrogen flushing (chip packets).

## Example
Balance: Fe + H₂O → Fe₃O₄ + H₂ (steam).
Balanced form: 3Fe + 4H₂O → Fe₃O₄ + 4H₂. Count: Fe 3=3, H 8=8, O 4=4 ✓ Type: displacement + redox.

## Quick Revision
- Balance by counting atoms element-by-element; smallest whole-number coefficients win.
- Combination: many → one. Decomposition: one → many.
- More reactive metal displaces less reactive metal from its salt.
- Precipitate = insoluble product in double displacement.
- Oxidation and reduction always happen together (redox).
- Silver chloride turns grey in light — photolytic decomposition.
- Rancid chips packets are flushed with nitrogen.

## Exam Tips
- Always write physical states when asked for a "complete" equation — marks are reserved for them.
- Name the type of reaction **and** justify in one line; naming alone often loses half marks.
- For balancing, tally atoms in a small table; it prevents silly slip-ups.
- Learn the reactivity series mnemonic up to copper — displacement questions depend on it.
- Practice converting word equations to formula equations first, then balance.`,
  "9-science-7": `# Motion — Revision Notes

## Introduction
Motion is the first formal physics chapter of Class 9: you learn to describe *how* things move using distance, displacement, velocity and acceleration, and to read motion graphs. It sets the language for Newton's laws in the next chapter.

## Key Concepts

### Distance vs displacement
Distance is the total path length — a scalar. Displacement is the straight-line shortest separation between start and end points with direction — a vector. On a closed round trip, distance is large but displacement is zero.

### Speed vs velocity
Speed = distance/time (scalar). Velocity = displacement/time (vector). Average velocity for uniform acceleration = (u + v)/2. Instantaneous velocity is what the speedometer shows at a moment.

### Acceleration
Acceleration a = (v − u)/t, unit m/s². Positive when speeding up, negative (retardation) when slowing down. Uniform acceleration means the velocity changes by equal amounts in equal times.

### Three equations of motion (uniform acceleration)
1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as
Here u = initial velocity, v = final velocity, s = displacement, t = time. Choose the equation that links the three quantities you know with the one you want.

### Graphs
- Distance-time: slope = speed. Straight sloping line = uniform speed; horizontal line = rest; curve = changing speed.
- Velocity-time: slope = acceleration; **area under the curve = displacement**. A horizontal v-t line means uniform velocity.

### Uniform circular motion
An object moving on a circle with constant speed is still accelerating, because its **direction** keeps changing. Velocity is tangential; acceleration points to the centre. Example: a stone whirled on a thread.

## Example
A bus slows from 20 m/s to rest in 5 s uniformly. Find acceleration and distance.
a = (0 − 20)/5 = −4 m/s² (retardation).
s = ut + ½at² = 20×5 + ½(−4)(25) = 100 − 50 = 50 m.
Or v² = u² + 2as → s = (0 − 400)/(2×(−4)) = 50 m ✓

## Quick Revision
- Displacement can be zero even when distance is not.
- Average velocity = (u + v)/2 only for uniform acceleration.
- Slope of s-t graph = speed; slope of v-t graph = acceleration.
- Area under v-t graph = distance travelled.
- Negative acceleration is retardation, not negative motion.
- Uniform circular motion has constant speed but changing velocity.

## Exam Tips
- Draw the v-t graph before solving long numericals; the area method often saves time.
- Always convert units first (km/h → m/s by dividing by 3.6).
- Write the equation number you are using — numericals are step-marked.
- In round-trip questions, compute distance and displacement separately.
- Remember "rest" appears as a horizontal line on BOTH graph types but at s = constant or v = 0 respectively.`,
  "12-physics-1": `# Electric Charges and Fields — Revision Notes

## Introduction
This chapter opens electrostatics: how charges behave at rest, the fields they create, and Gauss's law — the fastest tool for symmetric charge distributions. Boards regularly take 5-7 marks from here, including one derivation.

## Key Concepts

### Charge basics
Charge is quantised: q = ne, with e = 1.6 × 10⁻¹⁹ C. It is conserved in every isolated system and additive with sign. Like charges repel, unlike attract. Conductors let charges flow; insulators hold them fixed; charging by induction moves charge without contact.

### Coulomb's law
F = k q₁q₂/r², with k = 1/(4πε₀) ≈ 9 × 10⁹ N m²/C². The force acts along the line joining the point charges, obeys Newton's third law, and is valid for point charges. In a medium of dielectric constant K, the force divides by K.

### Electric field
E = F/q₀ (force per unit positive test charge), unit N/C or V/m. Field of a point charge: E = kq/r², radially outward for positive q. Field lines start on + and end on − charges, never cross, and their density shows strength.

### Electric dipole
Two equal, opposite charges separated by 2a. Dipole moment p = q × 2a, directed from − to +. Axial field: E = 2kp/r³; equatorial field: E = kp/r³ (opposite to p). Torque in uniform field: τ = pE sinθ. Net force on a dipole in a uniform field is zero.

### Gauss's law
Total flux through a closed surface Φ = q(enclosed)/ε₀. Flux counts field lines; charges outside contribute zero net flux. Standard results: infinite wire → E = λ/(2πε₀r); infinite sheet → E = σ/(2ε₀) (independent of distance); charged spherical shell → outside like a point charge, inside E = 0.

## Example
Two +2 μC charges sit 3 cm apart in air. Field at the midpoint?
Each charge is 1.5 cm = 0.015 m away; fields are equal and opposite → E = 0. Point-charge symmetry kills the field at the centre of two equal like charges.

## Quick Revision
- q = ne; e is the smallest free charge.
- Coulomb force in medium drops by factor K.
- E is force per unit test charge, pointing away from + charge.
- Field lines never intersect; they are dense where E is strong.
- Dipole: axial 2kp/r³, equatorial kp/r³, τ = pE sinθ.
- Gauss: Φ = q(in)/ε₀ — only enclosed charge matters.
- Inside a conductor/shell, electrostatic field is zero.

## Exam Tips
- State all symbols and units in derivations — step marking checks them.
- Use Gauss's law only when symmetry exists (sphere, wire, sheet); otherwise fall back to Coulomb summation.
- Draw the field-line diagram; labelled diagrams earn marks even in numericals.
- Memorise the three Gauss results with their distance dependence (1/r², 1/r, constant).
- In dipole torque questions, specify the angle θ between p and E clearly.`,
  "11-maths-1": `# Sets — Revision Notes

## Introduction
Sets is the language of Class 11 mathematics: every later topic (functions, probability, relations) is written in set notation. The chapter is mostly notation and logic, making it one of the easiest scoring chapters if you know the laws cold.

## Key Concepts

### Representing sets
A set is a well-defined collection. Roster form lists elements {2, 4, 6}; set-builder form describes a rule {x : x = 2n, n ∈ N, 1 ≤ n ≤ 3}. Order and repetition don't matter: {1, 2} = {2, 1, 1}.

### Types of sets
Empty set ∅ (no elements), singleton (one element), finite and infinite sets, equal sets (same elements), equivalent sets (same number/cardinality of elements). Note: ∅ has 0 elements but {∅} has 1.

### Subsets and power set
A ⊆ B if every element of A lies in B. Every set has 2ⁿ subsets (n = number of elements) and 2ⁿ − 1 proper subsets. Intervals like [a, b], (a, b) are subsets of R written in interval notation.

### Venn diagrams & operations
Union A ∪ B (in A or B), intersection A ∩ B (in both), difference A − B (in A, not B), complement A′ (in U, not A). Venn diagrams turn set problems into picture-counting problems — always draw them.

### Laws
- De Morgan: (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′.
- Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C); dual with ∩/∪ swapped.
- Idempotent, commutative, associative laws hold for ∪ and ∩.

### Cardinality formula
n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
Three sets: n(A ∪ B ∪ C) = n(A)+n(B)+n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C). This is the engine of every "survey/inclusion-exclusion" word problem.

## Example
In a class, 40 like maths, 25 like physics, 12 like both. How many like at least one subject?
n(M ∪ P) = 40 + 25 − 12 = 53 students.

## Quick Revision
- 2ⁿ subsets, 2ⁿ − 1 proper subsets for an n-element set.
- {∅} ≠ ∅; {0} is a singleton, not empty.
- De Morgan's two laws swap ∪↔∩ with a complement.
- n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
- Equivalent sets have equal cardinality; equal sets are identical.
- Complement is always taken relative to the universal set U.

## Exam Tips
- Write the law you are applying before each simplification step in proofs.
- For word problems, define sets with letters first (let M = students who like maths…).
- Draw a three-circle Venn diagram with the innermost overlap filled first.
- Watch words: "only maths" means n(A) − n(A ∩ B), not n(A).
- Check subset questions for the empty set and the set itself — both always count.`,
  "12-biology-4": `# Principles of Inheritance and Variation — Revision Notes

## Introduction
This genetics chapter carries one of the highest weightages in Class 12 biology. It builds from Mendel's pea experiments to chromosome theory, linkage, and human genetic disorders — conceptual clarity here also powers the Molecular Basis of Inheritance chapter.

## Key Concepts

### Mendel's laws
- **Law of Dominance**: in a monohybrid cross, only the dominant trait shows in F₁ (tall × dwarf → all tall).
- **Law of Segregation**: alleles separate cleanly during gamete formation; F₂ shows 3 : 1 phenotype and 1 : 2 : 1 genotype. This is the only law without exceptions among Mendel's three.
- **Law of Independent Assortment**: allele pairs for different traits separate independently in a dihybrid cross, giving the 9 : 3 : 3 : 1 F₂ ratio. Valid only for genes on different chromosomes or far apart on the same one.

### Test cross & back cross
Test cross mates a dominant-phenotype individual with the recessive parent type: a 1 : 1 ratio reveals a heterozygote. It is the standard "find the genotype" tool.

### Incomplete & codominance
- Incomplete dominance: heterozygote is intermediate (snapdragon: red × white → pink, F₂ 1 : 2 : 1).
- Codominance: both alleles express together (AB blood group; ABO alleles Iᴬ, Iᴮ codominant, i recessive).

### Chromosome theory & linkage
Sutton and Boveri united Mendel's factors with chromosomes. Genes on the same chromosome show **linkage**; recombinant frequency depends on distance (closer = fewer recombinants). Drosophila linkage maps came from these ratios.

### Sex determination & disorders
Humans: XX female, XY male; the father's gamete decides the child's sex. Mendelian disorders include haemophilia (X-linked recessive), sickle-cell anaemia (autosomal recessive codominant), phenylketonuria. Chromosomal disorders: Down syndrome (trisomy 21), Turner's syndrome (XO female), Klinefelter's syndrome (XXY male).

## Example
Cross a carrier mother (XᴴXʰ) with a normal father (XᴴY) for haemophilia.
Gametes: Xᴴ, Xʰ × Xᴴ, Y → daughters: ½ carrier; sons: ½ affected. So 25% of children (only boys) are expected haemophiliacs.

## Quick Revision
- F₂ monohybrid: 3 : 1 phenotype, 1 : 2 : 1 genotype.
- Dihybrid F₂: 9 : 3 : 3 : 1 needs independent assortment.
- Test cross reveals heterozygosity (1 : 1 result).
- Blood group AB shows codominance; pink snapdragon shows incomplete dominance.
- Recombination frequency ↑ with gene distance on a chromosome.
- Father determines the sex of the child in humans.
- Down = trisomy 21; Turner = XO; Klinefelter = XXY.

## Exam Tips
- Always draw a Punnett square with gametes labelled — it carries step marks.
- Name the ratio AND the law behind it when answering "identify the cross" questions.
- Keep a one-line mnemonic for chromosomal disorders: Down-21, Turner-XO, Klinefelter-XXY.
- In pedigree problems, eliminate X-linked recessive if father-to-son transmission appears.
- Practise writing gametes in one line before the square; most errors start there.`,
  "12-chemistry-1": `# Solutions — Revision Notes

## Introduction
Solutions is the first physical-chemistry chapter of Class 12 and a favourite for numericals: concentration terms, Raoult's law, colligative properties and their anomalies (abnormal molar mass) together account for 5-7 board marks.

## Key Concepts

### Types & concentration terms
Binary solutions have solute + solvent. Key expressions: molarity M = mol solute/L solution (temperature-dependent); molality m = mol solute/kg solvent (temperature-independent); mole fraction x; parts per million for trace amounts. Know when each is preferred.

### Solubility ideas
"Like dissolves like": polar solvents dissolve polar solutes. Gases dissolve less as temperature rises but more under high pressure — **Henry's law**: p = K_H x. High K_H means low solubility; this law explains soda fizzing out when opened and the bends in scuba divers.

### Raoult's law
Vapour pressure of a component = mole fraction × pure-component vapour pressure: p₁ = x₁ p₁°. Ideal solutions obey it across all ranges (benzene–toluene). Positive deviation (A–B attractions weaker) gives higher p than ideal; negative deviation (stronger A–B, e.g. acetone+chloroform) gives lower p. Azeotropes boil at constant composition and cannot be split by simple distillation.

### Colligative properties
Depend only on the NUMBER of solute particles: (1) relative lowering of vapour pressure, (2) elevation of boiling point ΔT_b = K_b·m, (3) depression of freezing point ΔT_f = K_f·m, (4) osmotic pressure π = CRT (best for polymers/proteins). These give molar masses; isotonic solutions have equal π.

### Abnormal molar mass
Dissociation (NaCl → 2 particles) makes properties larger → observed molar mass lower. Association (benzoic acid dimerises in benzene) does the reverse. The **van't Hoff factor** i = normal molar mass / abnormal molar mass corrects every colligative formula.

## Example
0.1 m NaCl solution: i ≈ 2, so effective particle molality = 0.2 m. Its freezing point drops about twice as much as 0.1 m glucose (i = 1) — dissociation doubles the particle count, not the moles.

## Quick Revision
- Molality & mole fraction don't change with temperature; molarity does.
- Henry: p = K_H x — higher K_H, less soluble gas.
- Ideal solution obeys Raoult at every composition.
- Colligative = "count of particles", not their identity.
- π = CRT; isotonic solutions share equal osmotic pressure.
- i > 1 dissociation, i < 1 association, i = 1 ideal nonelectrolyte.
- ΔT_f and ΔT_b scale with molality × i.

## Exam Tips
- State units of K_b, K_f and K_H — numericals lose marks on unit slips.
- Write "i = 2 (assuming complete dissociation)" before NaCl/CaCl₂ calculations.
- Choose osmotic pressure for macromolecules: other methods need large measurable amounts.
- In deviation questions, first compare A–B attraction strength with A–A and B–B.
- Practise interconversion of molarity ↔ molality using density; it appears every few years.`,
  "9-maths-1": `# Number Systems — Revision Notes

## Introduction
Number Systems extends your number family from rationals to the full real line: you classify numbers, meet irrational roots, and locate them on the number line. It is the base for every algebra chapter that follows.

## Key Concepts

### Number family
Natural (N) ⊂ whole (W) ⊂ integers (Z) ⊂ rational (Q) ⊂ real (R). Rationals are expressible as p/q (q ≠ 0); irrationals are not. Every real number has a unique position on the number line.

### Decimal expansions
Rational numbers give terminating decimals (7/8 = 0.875) or repeating decimals (1/3 = 0.333…). Irrational numbers give non-terminating, non-repeating decimals like √2 = 1.41421356… The q-test: p/q (lowest terms) terminates iff q = 2ᵐ5ⁿ.

### Irrational numbers
√2, √3, π, 0.101101110… are irrational. Key closure facts: sum/product of two irrationals **may** be rational (√2 × √2 = 2) — check, don't assume. Rational + irrational is always irrational.

### Locating √n on the number line
Spiral/semicircle construction: for √2, draw a right triangle with legs 1 and 1 (hypotenuse √2), transfer the length to the number line with a compass. Repeating with hypotenuse as a leg builds √3, √4, … — the "spiral of roots".

### Laws of exponents (real bases)
aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1 (a ≠ 0); a⁻ᵐ = 1/aᵐ. Fractional index n√a = a^(1/n), and a^(p/q) = (q√a)ᵖ. Rationalisation removes surds from denominators by multiplying with the conjugate.

## Example
Simplify (√5 + √3)(√5 − √3).
= (√5)² − (√3)² = 5 − 3 = 2. The conjugate pair turns surds into a clean rational — this pattern is asked repeatedly.

## Quick Revision
- p/q terminates ⇔ q has only 2s and 5s (lowest terms).
- Rational + irrational = always irrational.
- √2 × √2 = 2 shows irrational × irrational can be rational.
- √n construction: right triangle + compass transfer.
- a^(1/n) = nth root; a^(p/q) = q√(aᵖ).
- Rationalise by multiplying numerator and denominator by the conjugate.

## Exam Tips
- For "classify the number" questions, show the p/q test or the non-repeating decimal argument, not just the label.
- Practise compass constructions neatly — construction marks carry marks.
- In rationalisation, conjugate of a + √b is a − √b; write both multiplications.
- Convert recurring decimals to fractions with 10ˣ/9…9 subtraction once; it reappears in Class 10.
- Never write √(a+b) = √a + √b — it is wrong; expand squares instead.`,
};

// ORIGINAL seed questions
const SEED_QUESTIONS: Array<{
  grade: number; subject: string; text: string; options: string[]; answer: string; explanation: string; difficulty: string; chapterName: string;
}> = [
  { grade: 10, subject: "Maths", chapterName: "Real Numbers", difficulty: "EASY",
    text: "The HCF of 12 and 18 is 6. Using the relation HCF × LCM = a × b, what is their LCM?",
    options: ["A) 36", "B) 24", "C) 216", "D) 30"], answer: "A) 36",
    explanation: "LCM = (12 × 18)/6 = 216/6 = 36.", },
  { grade: 10, subject: "Maths", chapterName: "Real Numbers", difficulty: "MEDIUM",
    text: "Which of these decimal expansions must be terminating?",
    options: ["A) 22/7", "B) 13/3125", "C) 4/11", "D) 1/6"], answer: "B) 13/3125",
    explanation: "3125 = 5⁵ contains only 5s, so the fraction terminates; the others have 7, 11 or 2×3 factors.", },
  { grade: 10, subject: "Maths", chapterName: "Quadratic Equations", difficulty: "MEDIUM",
    text: "For x² − 6x + k = 0 to have two equal real roots, k must equal:",
    options: ["A) 6", "B) 9", "C) 12", "D) 3"], answer: "B) 9",
    explanation: "Equal roots need discriminant 0: 36 − 4k = 0 ⇒ k = 9.", },
  { grade: 10, subject: "Maths", chapterName: "Introduction to Trigonometry", difficulty: "HARD",
    text: "If sinθ = 3/5 (θ acute), then tanθ equals:",
    options: ["A) 4/5", "B) 5/4", "C) 3/4", "D) 4/3"], answer: "C) 3/4",
    explanation: "cosθ = 4/5 by Pythagoras, so tanθ = sinθ/cosθ = 3/4.", },
  { grade: 10, subject: "Maths", chapterName: "Arithmetic Progressions", difficulty: "MEDIUM",
    text: "The 10th term of the AP 3, 7, 11, … is:",
    options: ["A) 40", "B) 39", "C) 43", "D) 37"], answer: "B) 39",
    explanation: "a = 3, d = 4 ⇒ a₁₀ = 3 + 9×4 = 39.", },
  { grade: 10, subject: "Science", chapterName: "Chemical Reactions and Equations", difficulty: "EASY",
    text: "Respiration in living cells is an example of which type of reaction?",
    options: ["A) Endothermic decomposition", "B) Exothermic oxidation", "C) Photochemical reduction", "D) Neutralisation"], answer: "B) Exothermic oxidation",
    explanation: "Glucose is oxidised to CO₂ and water, releasing energy as heat — exothermic oxidation.", },
  { grade: 10, subject: "Science", chapterName: "Acids, Bases and Salts", difficulty: "MEDIUM",
    text: "A solution turns phenolphthalein pink. Its pH is most likely:",
    options: ["A) 2", "B) 5", "C) 7", "D) 10"], answer: "D) 10",
    explanation: "Phenolphthalein is pink in basic solutions (pH above ~8.2); pH 10 is basic.", },
  { grade: 10, subject: "Science", chapterName: "Light – Reflection and Refraction", difficulty: "MEDIUM",
    text: "An object placed at the principal focus of a concave mirror forms an image that is:",
    options: ["A) Virtual and erect at focus", "B) Real, inverted and highly diminished at focus", "C) Real, inverted and highly enlarged at infinity", "D) Same size at centre of curvature"], answer: "C) Real, inverted and highly enlarged at infinity",
    explanation: "When the object is at F, reflected rays become parallel, so the image forms at infinity, real, inverted and highly enlarged.", },
  { grade: 10, subject: "Science", chapterName: "Electricity", difficulty: "HARD",
    text: "Two 6 Ω resistors are connected in parallel and the combination in series with a 3 Ω resistor. Total resistance is:",
    options: ["A) 6 Ω", "B) 9 Ω", "C) 4 Ω", "D) 15 Ω"], answer: "A) 6 Ω",
    explanation: "Parallel pair: 3 Ω. In series with 3 Ω: 3 + 3 = 6 Ω.", },
  { grade: 10, subject: "Science", chapterName: "Life Processes", difficulty: "EASY",
    text: "Which structure increases the absorptive surface of the human small intestine?",
    options: ["A) Nephrons", "B) Villi", "C) Alveoli", "D) Neurons"], answer: "B) Villi",
    explanation: "Villi are finger-like folds of the intestinal lining that absorb digested food; alveoli belong to lungs, nephrons to kidneys.", },
  { grade: 9, subject: "Maths", chapterName: "Number Systems", difficulty: "MEDIUM",
    text: "Which of the following is an irrational number?",
    options: ["A) 0.252525…", "B) √16", "C) 0.1011011101110…", "D) 22/7 ÷ (22/7)"], answer: "C) 0.1011011101110…",
    explanation: "The pattern is non-terminating and non-repeating, hence irrational. 0.252525… repeats, √16 = 4, and (22/7)÷(22/7) = 1.", },
  { grade: 9, subject: "Maths", chapterName: "Polynomials", difficulty: "EASY",
    text: "If p(x) = x³ − 3x² + 2, then p(1) equals:",
    options: ["A) 0", "B) 1", "C) −1", "D) 2"], answer: "A) 0",
    explanation: "p(1) = 1 − 3 + 2 = 0, so (x − 1) is a factor.", },
  { grade: 9, subject: "Maths", chapterName: "Linear Equations in Two Variables", difficulty: "MEDIUM",
    text: "The graph of x = −3 is a line:",
    options: ["A) Parallel to x-axis", "B) Parallel to y-axis", "C) Passing through origin", "D) At 45° to both axes"], answer: "B) Parallel to y-axis",
    explanation: "x = constant fixes the x-coordinate everywhere, giving a vertical line parallel to the y-axis, 3 units left of origin.", },
  { grade: 9, subject: "Maths", chapterName: "Triangles", difficulty: "HARD",
    text: "In triangles ABC and PQR, AB = QR, BC = PR and CA = PQ. Then:",
    options: ["A) △ABC ≅ △PQR", "B) △ABC ≅ △QRP", "C) △ABC ≅ △RPQ", "D) Not congruent"], answer: "B) △ABC ≅ △QRP",
    explanation: "Match corresponding equal sides: A↔Q, B↔R, C↔P, so △ABC ≅ △QRP by SSS.", },
  { grade: 9, subject: "Maths", chapterName: "Statistics", difficulty: "EASY",
    text: "The mean of first five prime numbers is:",
    options: ["A) 5.2", "B) 5.6", "C) 6", "D) 4.6"], answer: "B) 5.6",
    explanation: "Primes: 2, 3, 5, 7, 11. Sum = 28, mean = 28/5 = 5.6.", },
  { grade: 9, subject: "Science", chapterName: "Motion", difficulty: "MEDIUM",
    text: "A car accelerates uniformly from rest to 20 m/s in 8 s. Its acceleration is:",
    options: ["A) 2.5 m/s²", "B) 2 m/s²", "C) 1.6 m/s²", "D) 4 m/s²"], answer: "A) 2.5 m/s²",
    explanation: "a = (v − u)/t = (20 − 0)/8 = 2.5 m/s².", },
  { grade: 9, subject: "Science", chapterName: "Gravitation", difficulty: "MEDIUM",
    text: "If the distance between two masses is doubled, the gravitational force between them becomes:",
    options: ["A) Double", "B) Half", "C) One-fourth", "D) Four times"], answer: "C) One-fourth",
    explanation: "Force ∝ 1/r²; doubling r multiplies force by 1/4.", },
  { grade: 9, subject: "Science", chapterName: "Atoms and Molecules", difficulty: "MEDIUM",
    text: "The number of molecules in 2 moles of CO₂ is approximately:",
    options: ["A) 6.022 × 10²³", "B) 1.2044 × 10²⁴", "C) 3.011 × 10²³", "D) 6.022 × 10²⁴"], answer: "B) 1.2044 × 10²⁴",
    explanation: "1 mole has 6.022 × 10²³ molecules, so 2 moles have 1.2044 × 10²⁴.", },
  { grade: 9, subject: "Science", chapterName: "Sound", difficulty: "EASY",
    text: "Sound waves in air are:",
    options: ["A) Transverse and mechanical", "B) Longitudinal and mechanical", "C) Longitudinal and electromagnetic", "D) Transverse and electromagnetic"], answer: "B) Longitudinal and mechanical",
    explanation: "Air particles vibrate along the direction of propagation, and a material medium is required — longitudinal mechanical wave.", },
  { grade: 9, subject: "Science", chapterName: "Tissues", difficulty: "MEDIUM",
    text: "Which tissue transports water and minerals upward in plants?",
    options: ["A) Phloem", "B) Xylem", "C) Parenchyma", "D) Cambium"], answer: "B) Xylem",
    explanation: "Xylem carries water and minerals from roots upward; phloem transports food both ways.", },
  { grade: 12, subject: "Physics", chapterName: "Electric Charges and Fields", difficulty: "MEDIUM",
    text: "The electric field inside a uniformly charged conducting spherical shell is:",
    options: ["A) kq/r²", "B) Zero", "C) Constant non-zero", "D) 2kq/r²"], answer: "B) Zero",
    explanation: "Charges reside on the surface; by Gauss's law no flux is enclosed by an interior surface, so E = 0 inside.", },
  { grade: 12, subject: "Physics", chapterName: "Current Electricity", difficulty: "MEDIUM",
    text: "Drift velocity of electrons in a conductor is of the order of:",
    options: ["A) 10⁸ m/s", "B) 10³ m/s", "C) 10⁻⁴ m/s", "D) 10⁻¹⁹ m/s"], answer: "C) 10⁻⁴ m/s",
    explanation: "Despite the huge random thermal speeds, the slow net drift is around fractions of a mm/s, i.e. ~10⁻⁴ m/s.", },
  { grade: 12, subject: "Physics", chapterName: "Moving Charges and Magnetism", difficulty: "HARD",
    text: "A charged particle enters a magnetic field parallel to B. Its path will be:",
    options: ["A) Circle", "B) Helix", "C) Straight line", "D) Parabola"], answer: "C) Straight line",
    explanation: "Magnetic force qv × B is zero when v is parallel to B, so the particle continues undeflected.", },
  { grade: 12, subject: "Physics", chapterName: "Ray Optics and Optical Instruments", difficulty: "MEDIUM",
    text: "Power of a convex lens of focal length 25 cm is:",
    options: ["A) +2.5 D", "B) +4 D", "C) −4 D", "D) +0.25 D"], answer: "B) +4 D",
    explanation: "P = 1/f(in metres) = 1/0.25 = +4 dioptre; convex lenses have positive power.", },
  { grade: 12, subject: "Physics", chapterName: "Alternating Current", difficulty: "EASY",
    text: "In a pure inductive AC circuit, current:",
    options: ["A) Leads voltage by π/2", "B) Lags voltage by π/2", "C) In phase with voltage", "D) Lags voltage by π"], answer: "B) Lags voltage by π/2",
    explanation: "For an inductor, current lags the applied voltage by 90°; in a capacitor it leads by 90°.", },
  { grade: 12, subject: "Chemistry", chapterName: "Solutions", difficulty: "MEDIUM",
    text: "Which concentration term does NOT change with temperature?",
    options: ["A) Molarity", "B) Molality", "C) Normality", "D) Volume percentage"], answer: "B) Molality",
    explanation: "Molality uses mass of solvent (mass is temperature-independent); the others involve volume, which expands on heating.", },
  { grade: 12, subject: "Chemistry", chapterName: "Electrochemistry", difficulty: "HARD",
    text: "For a spontaneous cell reaction, which must be true?",
    options: ["A) E°cell < 0", "B) ΔG° > 0", "C) E°cell > 0", "D) log K < 0"], answer: "C) E°cell > 0",
    explanation: "Spontaneity needs ΔG° = −nFE°cell < 0, which requires E°cell > 0 and hence log K > 0.", },
  { grade: 12, subject: "Chemistry", chapterName: "Chemical Kinetics", difficulty: "MEDIUM",
    text: "For a first-order reaction, the half-life is:",
    options: ["A) Proportional to initial concentration", "B) Inversely proportional to rate constant", "C) Independent of initial concentration", "D) Doubled when concentration doubles"], answer: "C) Independent of initial concentration",
    explanation: "t½ = 0.693/k for first order — a defining feature; zero-order half-life does depend on concentration.", },
  { grade: 12, subject: "Chemistry", chapterName: "Coordination Compounds", difficulty: "MEDIUM",
    text: "The coordination number of cobalt in [Co(NH₃)₄Cl₂]⁺ is:",
    options: ["A) 4", "B) 5", "C) 6", "D) 7"], answer: "C) 6",
    explanation: "Four NH₃ plus two Cl⁻ ligands bind to Co, giving coordination number 6 (octahedral).", },
  { grade: 12, subject: "Chemistry", chapterName: "Alcohols, Phenols and Ethers", difficulty: "EASY",
    text: "Phenol is more acidic than ethanol because:",
    options: ["A) It has more carbon atoms", "B) The phenoxide ion is resonance stabilised", "C) It contains two oxygen atoms", "D) Ethanol is aromatic"], answer: "B) The phenoxide ion is resonance stabilised",
    explanation: "The negative charge of phenoxide delocalises into the aromatic ring, stabilising it far more than ethoxide.", },
  { grade: 11, subject: "Maths", chapterName: "Sets", difficulty: "EASY",
    text: "If A = {1, 2, 3}, how many subsets does A have?",
    options: ["A) 6", "B) 7", "C) 8", "D) 9"], answer: "C) 8",
    explanation: "A set with n elements has 2ⁿ subsets: 2³ = 8 (including ∅ and A itself).", },
  { grade: 11, subject: "Maths", chapterName: "Trigonometric Functions", difficulty: "MEDIUM",
    text: "The value of sin²30° + cos²30° is:",
    options: ["A) 1/2", "B) 1", "C) 3/4", "D) 0"], answer: "B) 1",
    explanation: "sin²θ + cos²θ = 1 for every θ — the identity holds regardless of the angle.", },
  { grade: 11, subject: "Maths", chapterName: "Permutations and Combinations", difficulty: "MEDIUM",
    text: "In how many ways can 4 students be seated in a row of 4 chairs?",
    options: ["A) 12", "B) 16", "C) 24", "D) 8"], answer: "C) 24",
    explanation: "Arrangements = 4! = 4×3×2×1 = 24.", },
  { grade: 11, subject: "Maths", chapterName: "Limits and Derivatives", difficulty: "HARD",
    text: "The derivative of sin 2x with respect to x is:",
    options: ["A) cos 2x", "B) 2cos 2x", "C) −2cos 2x", "D) 2sin 2x"], answer: "B) 2cos 2x",
    explanation: "Chain rule: d/dx[sin(2x)] = cos(2x) × d/dx(2x) = 2cos 2x.", },
  { grade: 11, subject: "Physics", chapterName: "Laws of Motion", difficulty: "MEDIUM",
    text: "Newton's third law explains:",
    options: ["A) Why a gun recoils when fired", "B) Why planets orbit the sun", "C) Why satellites stay in orbit", "D) Why bodies float"], answer: "A) Why a gun recoils when fired",
    explanation: "The bullet's forward momentum produces an equal backward push on the gun — action-reaction pair.", },
  { grade: 11, subject: "Physics", chapterName: "Work, Energy and Power", difficulty: "MEDIUM",
    text: "A force does zero work on a moving body when the angle between force and displacement is:",
    options: ["A) 0°", "B) 45°", "C) 90°", "D) 180°"], answer: "C) 90°",
    explanation: "W = Fs cosθ; at θ = 90°, cosθ = 0, so no work is done (e.g. centripetal force in circular motion).", },
  { grade: 11, subject: "Physics", chapterName: "Units and Measurements", difficulty: "EASY",
    text: "Which of the following is a dimensionless quantity?",
    options: ["A) Strain", "B) Stress", "C) Pressure", "D) Force"], answer: "A) Strain",
    explanation: "Strain = change/original (same units cancel), so it has no dimensions; stress and pressure are N/m².", },
  { grade: 11, subject: "Biology", chapterName: "Cell: The Unit of Life", difficulty: "EASY",
    text: "Which organelle is called the 'suicidal bag' of the cell?",
    options: ["A) Ribosome", "B) Lysosome", "C) Mitochondria", "D) Golgi body"], answer: "B) Lysosome",
    explanation: "Lysosomes hold digestive enzymes that can break down the cell itself if the membrane ruptures.", },
  { grade: 11, subject: "Biology", chapterName: "Photosynthesis in Higher Plants", difficulty: "MEDIUM",
    text: "The primary CO₂ acceptor in the C4 pathway is:",
    options: ["A) RuBP", "B) PEP", "C) OAA", "D) PGA"], answer: "B) PEP",
    explanation: "Phosphoenolpyruvate (PEP) fixes CO₂ in mesophyll cells forming OAA; RuBP is the C3 acceptor.", },
  { grade: 12, subject: "Biology", chapterName: "Molecular Basis of Inheritance", difficulty: "MEDIUM",
    text: "In a DNA double helix, one complete turn covers a distance of about:",
    options: ["A) 0.34 nm", "B) 3.4 nm", "C) 20 nm", "D) 2 nm"], answer: "B) 3.4 nm",
    explanation: "One turn = 10 base pairs × 0.34 nm rise per pair ≈ 3.4 nm; 2 nm is the helix diameter.", },
  { grade: 12, subject: "Biology", chapterName: "Human Health and Disease", difficulty: "EASY",
    text: "Malaria is transmitted by the bite of:",
    options: ["A) Culex mosquito", "B) Female Anopheles mosquito", "C) Aedes mosquito", "D) Housefly"], answer: "B) Female Anopheles mosquito",
    explanation: "Female Anopheles carries Plasmodium; Aedes spreads dengue and chikungunya.", },
];

const SUBJECT_FIX: Record<string, string> = { "social-science": "Social Science" };

async function main() {
  console.log("Seeding StudySetu data…");

  // boards
  const boards: Record<string, string> = {};
  for (const b of BOARDS) {
    const row = await db.board.upsert({ where: { code: b.code }, create: b, update: b });
    boards[b.code] = row.id;
  }

  // classes + subjects + chapters
  const subjectIds: Record<string, string> = {}; // `${grade}-${slug}` -> id
  const chapterIds: Record<string, { id: string; name: string }> = {}; // `${grade}-${slug}-${num}` -> id
  for (const grade of [9, 10, 11, 12]) {
    const cls = await db.classLevel.upsert({
      where: { grade },
      create: { grade, label: `Class ${grade}` },
      update: { label: `Class ${grade}` },
    });
    for (const sub of CURRICULUM[grade]) {
      const s = await db.subject.upsert({
        where: { classId_slug: { classId: cls.id, slug: sub.slug } },
        create: { name: sub.name, slug: sub.slug, classId: cls.id },
        update: {},
      });
      subjectIds[`${grade}-${sub.slug}`] = s.id;
      let num = 1;
      for (const chName of sub.chapters) {
        const ch = await db.chapter.upsert({
          where: { subjectId_number: { subjectId: s.id, number: num } },
          create: { number: num, name: chName, subjectId: s.id },
          update: { name: chName },
        });
        chapterIds[`${grade}-${sub.slug}-${num}`] = { id: ch.id, name: chName };
        num++;
      }
    }
  }

  // original seed notes
  let noteCount = 0;
  for (const [key, content] of Object.entries(SEED_NOTES)) {
    const [grade, slug, num] = key.split("-");
    const ch = chapterIds[`${grade}-${slug}-${num}`];
    if (!ch) continue;
    const keyPoints: string[] = [];
    const revMatch = content.match(/## Quick Revision[\s\S]*?(?=\n## |$)/);
    if (revMatch) {
      keyPoints.push(...revMatch[0].split("\n").filter((l) => l.trim().startsWith("-")).map((l) => l.replace(/^[\s\-]+/, "").trim()).slice(0, 8));
    }
    const titleMatch = content.match(/^# (.+)$/m);
    const words = content.split(/\s+/).length;
    await db.note.upsert({
      where: { chapterId: ch.id },
      create: { title: titleMatch ? titleMatch[1] : `${ch.name} — Revision Notes`, content, keyPoints: JSON.stringify(keyPoints), readMins: Math.max(4, Math.round(words / 130)), chapterId: ch.id, origin: "original-seed" },
      update: {},
    });
    noteCount++;
  }

  // original seed questions
  let qCount = 0;
  for (const q of SEED_QUESTIONS) {
    const sid = subjectIds[`${q.grade}-${q.subject.toLowerCase().replace(/\s+/g, "-")}`];
    if (!sid) continue;
    const exists = await db.question.findFirst({ where: { text: q.text, subjectId: sid } });
    if (exists) continue;
    await db.question.create({
      data: {
        text: q.text, options: JSON.stringify(q.options), answer: q.answer, explanation: q.explanation,
        difficulty: q.difficulty, marks: 1, subjectId: sid, chapterName: q.chapterName, origin: "original-seed",
      },
    });
    qCount++;
  }

  // PYQ paper metadata with OFFICIAL board links only
  const years = [2021, 2022, 2023, 2024, 2025];
  const officialMap: Record<string, string> = {
    CBSE: "https://cbse.gov.in/cbsenew/question-paper.html",
    HBSE: "https://bseh.org.in/home?page=question-papers",
    BSEB: "https://biharboardonline.bihar.gov.in",
    KERALA: "https://dhsekerala.gov.in",
  };
  let paperCount = 0;
  for (const b of BOARDS) {
    for (const grade of [9, 10, 11, 12]) {
      for (const sub of CURRICULUM[grade]) {
        const sid = subjectIds[`${grade}-${sub.slug}`];
        const gradeLabel = SUBJECT_FIX[sub.slug] || sub.name;
        for (const y of years) {
          await db.paper.upsert({
            where: { boardId_classId_subjectId_year_kind: { boardId: boards[b.code], classId: (await db.classLevel.findUnique({ where: { grade } }))!.id, subjectId: sid, year: y, kind: "PYQ" } },
            create: {
              title: `${b.name} Class ${grade} ${gradeLabel} Question Paper ${y}`,
              year: y, kind: "PYQ", officialUrl: officialMap[b.code],
              note: "Open the official board portal to download the original paper. Use our original practice sets to test yourself.",
              boardId: boards[b.code], classId: (await db.classLevel.findUnique({ where: { grade } }))!.id, subjectId: sid,
            },
            update: {},
          }).catch(() => {});
          paperCount++;
        }
      }
    }
    // CBSE official sample papers (2025) — linked, not stored
    for (const grade of [10, 12]) {
      for (const sub of CURRICULUM[grade]) {
        const sid = subjectIds[`${grade}-${sub.slug}`];
        const clsId = (await db.classLevel.findUnique({ where: { grade } }))!.id;
        await db.paper.upsert({
          where: { boardId_classId_subjectId_year_kind: { boardId: boards.CBSE, classId: clsId, subjectId: sid, year: 2025, kind: "SAMPLE" } },
          create: {
            title: `CBSE Class ${grade} ${SUBJECT_FIX[sub.slug] || sub.name} Official Sample Paper 2025-26`,
            year: 2025, kind: "SAMPLE", officialUrl: "https://cbseacademic.nic.in/SQP_CLASSX_2025-26.html",
            note: "Official sample paper & marking scheme published by CBSE Academic — always free and legal to download there.",
            boardId: boards.CBSE, classId: clsId, subjectId: sid,
          },
          update: {},
        }).catch(() => {});
      }
    }
  }

  // question of the day
  const anyQ = await db.question.findFirst();
  if (anyQ) {
    await db.siteStat.upsert({ where: { key: "qotd" }, create: { key: "qotd", value: anyQ.id }, update: {} });
  }

  const totals = {
    boards: await db.board.count(),
    chapters: await db.chapter.count(),
    notes: await db.note.count(),
    questions: await db.question.count(),
    papers: await db.paper.count(),
  };
  console.log(`Seeded: +${noteCount} notes, +${qCount} questions, ${paperCount} paper entries`, totals);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
