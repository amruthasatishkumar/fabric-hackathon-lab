# ESRI Workshop - Change Log

This lab guide (a copy of `lab-guide/`) is aligned to the **Fabric Property Assessment Hackathon**
attendee repo ([nickTinMicrosoft/fabric-hackathon-attendee-accessor](https://github.com/nickTinMicrosoft/fabric-hackathon-attendee-accessor)).
The visual theme/CSS is unchanged.

## Use case

Replaced the interim **UrbanPulse** smart-city scenario with the repo's **Sudsberry Property
Assessment** use case (synthetic property valuation, inspection documents, and appeal narratives for
the fictional municipality of Sudsberry). Site rebranded to **"Property Assessment Data Lab"**.

## Goal mapping (repo -> this lab)

| Repo goal | This lab |
|-----------|----------|
| Goal 1 - Connect the sources (Bronze) | Module 2 - mirror Azure SQL + mirror Cosmos + ADLS `appeals` shortcut |
| Goal 2 - Build Silver | Module 3 - notebooks 1 & 2 (conform SQL dims/facts, flatten Cosmos, explode inspections) |
| Goal 3 - Apply AI | Module 4 - notebook 3 (`ai.*` on appeal narratives + evaluation vs ground truth) |
| Goal 4 - Build Gold and serve | Modules 5-8 - four marts, Direct Lake semantic model + report, ontology, data agent |

## Bronze ingestion method

Reverted from the earlier notebook ingestion back to the repo's **mirroring + shortcut** approach:
Azure SQL and Cosmos DB **mirrored** into OneLake, ADLS Gen2 appeal files reached via a OneLake
**shortcut**. Notebooks start at Silver.

## Sources & tables

- **Azure SQL** (mirror): Jurisdiction, Neighborhood, PropertyClass, Parcel, Building, Assessment, Sale, TaxRate.
- **Cosmos DB** (mirror): `properties` container (nested `inspections[]`).
- **ADLS Gen2** (shortcut `appeals`): `assessment_appeals.json` + `.parquet`.
- **Silver**: dim_jurisdiction/neighborhood/property_class/parcel/building, fact_assessment, fact_sale, tax_rate, property_profile, fact_inspection, fact_appeal, fact_appeal_ai.
- **Gold marts**: property_assessment_mart, comparable_sales_mart, appeal_intelligence_mart, neighborhood_equity_mart.
- Lakehouse names: `BronzeLakehouse`, `SilverLakehouse`, `GoldLakehouse` (match repo notebook parameters).

## Modules

All pages re-themed to Sudsberry: `index.html`, `module-0` through `module-8`, both appendices,
`closing.html`, and the sidebar nav/brand in `assets/js/print.js`. Module 7 (Ontology) is now a
**required** Goal 4 module aligned to the repo's `Goal 4 - Ontology` guide: `PropertyAssessmentOntology`
bound directly from OneLake Gold with four entities (Property, Neighborhood, ComparableSale, Appeal)
and four relationships (locatedIn, recordsFor, submittedFor, occursIn). Module 8's Data Agent
(`Property Assessment Agent`) is **grounded on the ontology as its only source** (with "Support group by
in GQL"), not the Gold marts.

## Repo-alignment updates (final pass)

- Gold marts (Module 5) emit the exact columns the ontology binds; Silver (Module 3) adds
  `parcel_number`, `synthetic_address`, `market_area`, `building_type`, `condition_code`, `sale_type`, `sale_date`.
- AI (Module 4) emits `ai_follow_up` + `urgent_follow_up`; notes the Foundry alternate path
  (notebook `3a` -> `fact_appeal_foundry_ai`, Variable Library `HackathonVariables`, Gold `appeal_ai_source_table`).
- Naming reconciled to the repo: semantic model `Property Assessment Model`, report
  `Property Assessment Insights`, agent `Property Assessment Agent`, ontology `PropertyAssessmentOntology`,
  mirrors `Property Assessment SQL Mirror` / `Property Profiles Mirror`.
- Module 0 adds the Ontology + Data Agent tenant-setting prerequisites.

## Screenshots

Reused where still relevant (mirror/lakehouse/semantic-model/ontology shots, now applicable again
since Bronze uses mirroring). Placeholders added for the new mirror/shortcut, Silver notebook,
appeals-AI, and Gold-mart steps via the existing `.screenshot.placeholder` auto-render mechanism.

## UI / theme

- **No visual theme change.** `assets/css/data-lab.css` colors/fonts/spacing/layout are untouched.
- Code blocks keep the **Copy** and **Download** buttons injected by `print.js`.
