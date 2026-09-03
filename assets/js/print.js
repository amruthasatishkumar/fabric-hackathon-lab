// Print mode helpers - keeps the page clean when exporting to PDF
window.addEventListener("beforeprint", () => {
    document.querySelectorAll("details").forEach(d => d.setAttribute("open", ""));
});

// =============================================================
// Lab nav - sticky sidebar, injected on every page
// =============================================================
const LAB_NAV = [
    { group: "Get started",        items: [
        { href: "module-0-setup.html",                     label: "Welcome" },
        { href: "index.html",                              label: "Use Case" },
        { href: "module-1-workspace-tour.html",            label: "Data Estate" },
    ]},
    { group: "Goal 1 · Bronze",    items: [
        { href: "module-2-bronze-ingestion.html",          label: "Connect the Sources" },
    ]},
    { group: "Goal 2 · Silver",    items: [
        { href: "module-3-silver-transform.html",          label: "Silver Transform" },
    ]},
    { group: "Goal 3 · AI",        items: [
        { href: "module-4-ai-insights.html",               label: "AI on Appeal Narratives" },
    ]},
    { group: "Goal 4 · Gold",      items: [
        { href: "module-5-gold-marts.html",                label: "Gold Business Marts" },
        { href: "module-6-direct-lake.html",               label: "Direct Lake + Power BI" },
        { href: "module-7-ontologies.html",                label: "Fabric Ontology" },
        { href: "module-8-data-agents.html",               label: "Fabric Data Agent" },
    ]},
    { group: "Wrap-up",            items: [
        { href: "closing.html",                            label: "Closing" },
    ]},
    { group: "Appendices",         items: [
        { href: "appendix-learn-links.html",               label: "MS Reference Links" },
    ]},
];

document.addEventListener("DOMContentLoaded", () => {
    // ---- Build the sidebar ----
    const here = location.pathname.split("/").pop() || "index.html";

    const aside = document.createElement("aside");
    aside.className = "lab-nav";
    aside.setAttribute("aria-label", "Lab navigation");

    const headerBlock = document.createElement("div");
    headerBlock.className = "lab-nav-header";
    headerBlock.innerHTML = `
        <div class="lab-nav-eyebrow">Property Assessment Data Lab</div>
        <div class="lab-nav-title">Sudsberry</div>
    `;
    aside.appendChild(headerBlock);

    LAB_NAV.forEach(group => {
        const g = document.createElement("div");
        g.className = "lab-nav-group";

        const gh = document.createElement("div");
        gh.className = "lab-nav-group-title";
        gh.textContent = group.group;
        g.appendChild(gh);

        group.items.forEach(item => {
            const a = document.createElement("a");
            a.href = item.href;
            a.className = "lab-nav-link";
            if (item.href === here) a.classList.add("active");
            a.innerHTML = `<span class="lab-nav-label">${item.label}</span>`;
            g.appendChild(a);
        });

        aside.appendChild(g);
    });

    // Mobile-toggle button
    const toggle = document.createElement("button");
    toggle.className = "lab-nav-toggle";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.innerHTML = "☰ Lab navigation";
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("lab-nav-open");
    });

    document.body.appendChild(toggle);
    document.body.appendChild(aside);
    document.body.classList.add("has-lab-nav");

    // ---- Smooth-scroll active highlight for in-page TOCs (kept) ----
    const tocLinks = document.querySelectorAll(".toc a[href^='#']");
    if (tocLinks.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    tocLinks.forEach(l => l.classList.toggle(
                        "active", l.getAttribute("href") === `#${e.target.id}`
                    ));
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px" });
        document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
    }

    // ---- Copy + Download buttons on every code block ----
    const LANG_EXT = {
        "python": "py", "pyspark": "py", "py": "py",
        "t-sql": "sql", "tsql": "sql", "sql": "sql", "spark sql": "sql",
        "kql": "kql", "json": "json", "bash": "sh", "shell": "sh",
        "powershell": "ps1", "yaml": "yaml", "dax": "dax"
    };

    document.querySelectorAll(".code-block").forEach((block, i) => {
        const codeEl = block.querySelector("pre code, pre");
        if (!codeEl) return;

        // Derive a filename from the language badge, e.g. "PySpark" -> code.py
        const badge = (block.querySelector(".lang-badge")?.textContent || "").trim().toLowerCase();
        const ext = LANG_EXT[badge] || "txt";
        const fileName = `sudsberry-snippet-${i + 1}.${ext}`;

        // Copy
        if (!block.querySelector(".copy-btn")) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "copy-btn";
            btn.setAttribute("aria-label", "Copy code");
            btn.innerHTML = "<span class='copy-icon'>📋</span><span class='copy-label'>Copy</span>";
            btn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(codeEl.innerText);
                    btn.classList.add("copied");
                    btn.querySelector(".copy-label").textContent = "Copied";
                    setTimeout(() => {
                        btn.classList.remove("copied");
                        btn.querySelector(".copy-label").textContent = "Copy";
                    }, 1500);
                } catch (err) {
                    btn.querySelector(".copy-label").textContent = "Failed";
                    setTimeout(() => { btn.querySelector(".copy-label").textContent = "Copy"; }, 1500);
                }
            });
            block.appendChild(btn);
        }

        // Download
        if (!block.querySelector(".download-btn")) {
            const dl = document.createElement("button");
            dl.type = "button";
            dl.className = "download-btn";
            dl.setAttribute("aria-label", "Download code");
            dl.innerHTML = "<span class='dl-icon'>⬇</span><span class='dl-label'>Download</span>";
            dl.addEventListener("click", () => {
                const blob = new Blob([codeEl.innerText], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                dl.classList.add("downloaded");
                dl.querySelector(".dl-label").textContent = "Saved";
                setTimeout(() => {
                    dl.classList.remove("downloaded");
                    dl.querySelector(".dl-label").textContent = "Download";
                }, 1500);
            });
            block.appendChild(dl);
        }
    });

    // ---- Render screenshots: any .screenshot.placeholder whose target file
    //      exists on disk gets swapped for an <img>. No upload, no paste -- just
    //      "show the screenshot if it's there." ----
    (function renderScreenshots() {
        const SCREENSHOT_BASE = "assets/images/screenshots/";
        const placeholders = document.querySelectorAll(".screenshot.placeholder");
        placeholders.forEach(ph => {
            const metaEl = ph.querySelector(".ph-meta");
            if (!metaEl) return;
            const relPath = (metaEl.textContent || "").trim();
            if (!relPath) return;

            const captionText = (ph.querySelector(".placeholder-body > div:last-child")?.textContent || "").trim();
            const probe = new Image();
            probe.onload = () => {
                ph.classList.remove("placeholder");
                ph.classList.add("rendered");
                ph.innerHTML = "";
                const img = document.createElement("img");
                img.src = SCREENSHOT_BASE + relPath;
                img.alt = captionText || relPath;
                img.loading = "lazy";
                ph.appendChild(img);
                if (captionText) {
                    const cap = document.createElement("div");
                    cap.className = "caption";
                    cap.textContent = captionText;
                    ph.appendChild(cap);
                }
            };
            probe.onerror = () => { ph.remove(); };
            probe.src = SCREENSHOT_BASE + relPath;
        });
    })();
});
