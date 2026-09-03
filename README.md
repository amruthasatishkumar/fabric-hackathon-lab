# Sudsberry Property Assessment Data Lab

A hands-on Microsoft Fabric workshop that builds an end-to-end property assessment
analytics and AI solution for the fictional municipality of **Sudsberry** — from three
operational sources through a Bronze → Silver → Gold medallion to a Direct Lake report,
a Fabric ontology, and an ontology-grounded data agent.

## View the site

Once GitHub Pages is enabled for this repo, the lab is served at:

**https://amruthasatishkumar.github.io/fabric-hackathon-lab/**

## Run locally

It's a static site — open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Structure

- `index.html` — lab overview / use case and module grid
- `module-0-setup.html` … `module-8-data-agents.html` — the goal modules
- `closing.html`, `appendix-learn-links.html` — wrap-up and references
- `assets/` — CSS, JS (sidebar nav + code copy/download), images

## Goals

1. **Bronze** — mirror Azure SQL & Cosmos DB and shortcut ADLS Gen2 into a Bronze Lakehouse
2. **Silver** — conform dimensions/facts, flatten profiles, ingest appeals
3. **AI** — enrich appeal narratives with Fabric AI functions and evaluate against ground truth
4. **Gold** — business marts, a Direct Lake semantic model + report, a Fabric ontology, and a data agent

Lab content is aligned to the
[Fabric Property Assessment Hackathon repository](https://github.com/nickTinMicrosoft/fabric-hackathon-attendee-accessor).
All data is synthetic.
