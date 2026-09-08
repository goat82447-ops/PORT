/* script.js - complete interactive behavior (updated: pinned repos + stars/forks) */

/*
  Configuration - update these three variables only to configure links & resume filename
*/
const LINKEDIN_URL = "https://www.linkedin.com/in/krishna-bandoju-693453152/";
const GITHUB_URL = "https://github.com/goat82447-ops";
const RESUME_FILE = "assets/Krishna-Kumar-Bandoju-Resume.pdf";

/*
  PINNED REPOS - list the exact repo names you want pinned (order matters).
  Example: ["portfolio", "awesome-lib", "backend-service"]
  If empty, the sidebar will show the most recently updated public repos.
*/
const PINNED_REPOS = ["LowCode-v3", "ACD-Dynamics-Omnichannel"]; // <-- update these names to match your repos

/* Editable skills data - update as needed */
const SKILLS_DATA = {
  "Backend": ["C#", ".NET 8", ".NET Core", "ASP.NET Core", "ASP.NET MVC", "Web API", "REST APIs", "Microservices", "Dependency Injection", "Middleware"],
  "Frontend": ["Angular", "TypeScript", "JavaScript", "HTML5", "CSS3", "Responsive Design", "Form Validation"],
  "Database": ["MS SQL Server", "Stored Procedures", "Indexing", "Query Optimization", "Entity Framework Core", "LINQ"],
  "Cloud": ["Microsoft Azure", "Azure App Services", "Azure SQL", "Azure Storage", "Azure AD"],
  "DevOps": ["Azure DevOps", "GitHub Actions", "YAML Pipelines", "CI/CD", "Git", "Branch Protection", "PR Validation Gates", "TFS"],
  "Architecture": ["Microservices", "SOLID", "Design Patterns", "API Versioning", "HLD", "LLD"],
  "Testing": ["xUnit", "BDD", "Reqnroll", "Unit Testing", "End-to-End Automation"],
  "Security & Logging": ["JWT Authentication", "Azure AD", "Role-Based Authorization", "Serilog", "Exception Handling"],
  "AI / GenAI": ["GitHub Copilot", "Generative AI", "Agentic AI", "LLM Integration", "Skills / Plugins"],
  "Additional Exposure": ["CQRS", "MediatR", "gRPC", "Azure Service Bus", "Cosmos DB", "SignalR"]
};

/* Project case study content */
const PROJECT_CASES = {
  dynamics: {
    title: "Dynamics 365 Omnichannel",
    client: "Microsoft (Client)",
    role: "Senior .NET Developer",
    overview: "Enterprise contact center and omnichannel platform for global operations.",
    responsibilities: [
      "Backend development using C# and ASP.NET Core.",
      "Angular frontend integration with Dynamics 365 Omnichannel.",
      "CI/CD and release coordination using GitHub Actions and Azure DevOps.",
      "BDD-driven automation and production incident resolution."
    ],
    tech: [".NET", "C#", "ASP.NET Core", "Angular", "SQL Server", "Azure", "Azure DevOps", "GitHub Actions", "BDD", "GenAI"],
    challenges: ["Integrating with Dynamics pipelines and handling global deployment orchestration."],
    solutions: ["Modular microservices, strict API contracts, automated CI/CD and feature gating."],
    impact: ["Improved deployment consistency and reduced incident lead time."]
  },
  lowcode: { title: "LowCode v3.0", client: "AmpleLogic", role: "Senior Software Engineer", overview: "Low-code platform to build modular enterprise applications.", responsibilities: ["ASP.NET Core backend and Angular frontend development.", "API versioning, DI, middleware and logging using Serilog.", "BDD automation and Azure-based CI/CD pipelines."], tech: [ "ASP.NET Core", "Angular", "BDD", "Azure CI/CD"], challenges: ["Ensuring extensibility and plugin compatibility."], solutions: ["Clear extension points and strict contract tests."], impact: ["Enabled faster client delivery cycles."] },
  atwork: { title: "ATWORK", client: "AmpleLogic", role: "Senior Software Engineer", overview: "Workforce management and reporting system.", responsibilities: ["ASP.NET MVC backend, Angular frontend, SQL Server queries", "Performance and logging improvements"], tech: ["ASP.NET MVC", "Angular", "SQL Server", "LINQ"], challenges: ["Large reporting datasets."], solutions: ["Query optimization and indexed reporting tables."], impact: ["Better report performance and UX."] },
  elms: { title: "e-LMS", client: "AmpleLogic", role: "Senior Software Engineer", overview: "Enterprise learning management with approval workflows.", responsibilities: ["Frontend validation, backend workflows, reporting"], tech: ["ASP.NET MVC", "Angular", "SQL Server"], challenges: ["Complex approval chains"], solutions: ["Workflow engine improvements and UI validations"], impact: ["Reduced approval errors and improved traceability"] },
  hrbenefits: { title: "HR Benefits Management System", client: "Shell Info Technologies", role: "Software Engineer", overview: "Employee benefits and plan management solution.", responsibilities: ["Feature development, NuGet dependency maintenance, operational monitoring"], tech: ["ASP.NET", "SQL Server"], challenges: ["Keeping dependent packages up to date"], solutions: ["Automated dependency checks and monitoring"], impact: ["Improved stability and alerts."] }
};

/* Utility selectors */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  setupTopLinks();
  buildSkills();
  setupNav();
  setupMobileMenu();
  setupSkillAccordion();
  setupExperienceExpandables();
  setupProjectModals();
  setupModalCloseHandlers();
  setupScrollReveal();
  setupActiveNavHighlight();
  setupStatsAnimation();
  setupBackToTop();
  wireResumeAndEmail();
  animateBadges();
  // GitHub sidebar fetch/render with pinned support
  fetchAndRenderGitHubSidebar();
});

/* Link wiring */
function setupTopLinks(){
  const linkedinButtons = [$("#linkedinBtn"), $("#linkedinSecondary"), $("#contactLinkedIn"), $("#footerLinkedIn"), $("#sidebarLinkedIn")].filter(Boolean);
  const githubButtons = [$("#githubBtn"), $("#githubSecondary"), $("#contactGitHub"), $("#footerGitHub"), $("#sidebarGitHub")].filter(Boolean);

  linkedinButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>window.open(LINKEDIN_URL, "_blank", "noopener"));
  });

  githubButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>window.open(GITHUB_URL, "_blank", "noopener"));
  });

  const downloadBtns = [$("#downloadResumeBtn"), $("#downloadResumeHero"), $("#downloadResumeFooter")].filter(Boolean);
  downloadBtns.forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const a = document.createElement("a");
      a.href = RESUME_FILE;
      a.download = RESUME_FILE.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  });
}

/* Build skills dynamically into DOM */
function buildSkills(){
  const container = $("#skillsContainer");
  container.innerHTML = "";
  Object.keys(SKILLS_DATA).forEach((category)=>{
    const card = document.createElement("div");
    card.className = "skill-card reveal";
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <div class="skill-title">${category}</div>
      <div class="skill-sub">Click to expand</div>
      <div class="skill-panel" data-open="false" aria-hidden="true"></div>
    `;
    const panel = card.querySelector(".skill-panel");
    SKILLS_DATA[category].forEach(t=>{
      const p = document.createElement("div");
      p.className = "skill-pill";
      p.textContent = t;
      panel.appendChild(p);
    });
    container.appendChild(card);
  });
}

/* Nav & Menu */
function setupNav(){
  const navLinks = $$("#nav-list a");
  navLinks.forEach(a=>{
    a.addEventListener("click", (e)=>{
      e.preventDefault();
      const target = a.getAttribute("data-target") || a.getAttribute("href");
      if(target && target.startsWith("#")){
        document.querySelector(target).scrollIntoView({behavior:"smooth", block:"start"});
        const navList = $("#nav-list");
        if(navList.classList.contains("open")){
          navList.classList.remove("open");
          $("#menuToggle").setAttribute("aria-expanded","false");
        }
      }
    });
  });
}
function setupMobileMenu(){
  const toggle = $("#menuToggle");
  if(!toggle) return;
  toggle.addEventListener("click", ()=>{
    const navList = $("#nav-list");
    const open = !navList.classList.contains("open");
    navList.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* Skill accordion (single open) */
function setupSkillAccordion(){
  let openCard = null;
  const cards = $$(".skill-card");
  cards.forEach(card=>{
    card.addEventListener("click", ()=>{
      const panel = card.querySelector(".skill-panel");
      const isOpen = panel.getAttribute("data-open") === "true";
      if(openCard && openCard !== card){
        closeSkillCard(openCard);
      }
      if(isOpen){
        closeSkillCard(card);
        openCard = null;
      } else {
        openSkillCard(card);
        openCard = card;
      }
    });
  });

  function openSkillCard(card){
    const p = card.querySelector(".skill-panel");
    p.style.display = "flex";
    p.style.maxHeight = p.scrollHeight + "px";
    p.setAttribute("data-open", "true");
    p.setAttribute("aria-hidden", "false");
    card.classList.add("open");
  }
  function closeSkillCard(card){
    const p = card.querySelector(".skill-panel");
    p.style.maxHeight = "0px";
    p.setAttribute("data-open", "false");
    p.setAttribute("aria-hidden", "true");
    card.classList.remove("open");
    setTimeout(()=>{ if(p.getAttribute("data-open")==="false") p.style.display = "none"; }, 350);
  }

  cards.forEach(c=>{
    const p = c.querySelector(".skill-panel");
    p.style.display = "none";
    p.style.maxHeight = "0px";
  });
}

/* Experience expandables */
function setupExperienceExpandables(){
  $$(".expand-experience").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const target = btn.getAttribute("data-target");
      const panel = document.getElementById(target);
      const expanded = btn.getAttribute("aria-expanded")==="true";
      if(expanded){
        panel.hidden = true;
        btn.setAttribute("aria-expanded","false");
      } else {
        panel.hidden = false;
        btn.setAttribute("aria-expanded","true");
        panel.scrollIntoView({behavior:"smooth", block:"nearest"});
      }
    });
  });
}

/* Project modal */
function setupProjectModals(){
  $$(".view-case").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-project");
      openProjectModal(id);
    });
  });
}
function openProjectModal(id){
  const data = PROJECT_CASES[id];
  if(!data) return;
  const modal = $("#modal");
  const modalContent = $("#modalContent");
  modalContent.innerHTML = buildProjectHTML(data);
  modal.setAttribute("aria-hidden","false");
  const panel = modal.querySelector(".modal-panel");
  panel.focus();
  document.body.style.overflow = "hidden";
}
function buildProjectHTML(data){
  return `
    <div class="modal-body">
      <h3 id="modalTitle">${data.title}</h3>
      <div class="meta">${data.role} • ${data.client || ""}</div>
      <p style="margin-top:.6rem;color:var(--muted)">${data.overview}</p>
      <h4 style="margin-top:1rem">Responsibilities</h4>
      <ul>${data.responsibilities.map(r=>`<li>${r}</li>`).join("")}</ul>
      <h4>Technology Stack</h4>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0">${data.tech.map(t=>`<span class="pill">${t}</span>`).join("")}</div>
      <h4>Challenges</h4>
      <ul>${(data.challenges||[]).map(c=>`<li>${c}</li>`).join("")}</ul>
      <h4>Solutions & Impact</h4>
      <ul>${(data.solutions||[]).map(s=>`<li>${s}</li>`).join("")}</ul>
      <div style="margin-top:1rem;display:flex;gap:.6rem"><button class="btn btn-primary" id="modalCloseAction">Close</button></div>
    </div>
  `;
}

/* Modal close */
function setupModalCloseHandlers(){
  const modal = $("#modal");
  const backdrop = $("#modalBackdrop");
  const closeBtn = $("#modalClose");
  backdrop && backdrop.addEventListener("click", closeModal);
  closeBtn && closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && modal.getAttribute("aria-hidden")==="false"){
      closeModal();
    }
  });
  document.body.addEventListener("click", (e)=>{
    if(e.target && e.target.id === "modalCloseAction"){
      closeModal();
    }
  });
}
function closeModal(){
  const modal = $("#modal");
  if(!modal) return;
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  setTimeout(()=>{ $("#modalContent").innerHTML = ""; }, 250);
}

/* Scroll reveal */
function setupScrollReveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  $$(".reveal").forEach(el=>obs.observe(el));
  $$("section").forEach(s=>{
    if(!s.classList.contains("reveal")) s.classList.add("reveal");
    obs.observe(s);
  });
}

/* Active nav highlighting */
function setupActiveNavHighlight(){
  const sections = $$("main section[id]");
  const navLinks = $$("#nav-list a");
  const map = {};
  navLinks.forEach(a => {
    const target = a.getAttribute("href") || a.getAttribute("data-target");
    if(target && target.startsWith("#")) map[target.substring(1)] = a;
  });
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      const link = map[id];
      if(entry.isIntersecting){
        navLinks.forEach(n=>n.classList.remove("active"));
        if(link) link.classList.add("active");
      }
    });
  }, {threshold: 0.38});
  sections.forEach(s => observer.observe(s));
}

/* Stats animation */
function setupStatsAnimation(){
  const statEls = $$(".stat-card .stat-value");
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = el.getAttribute("data-target");
        if(target && !isNaN(Number(target))){
          animateCount(el, Number(target));
        }
        obs.unobserve(el);
      }
    });
  }, {threshold:0.5});
  statEls.forEach(el=> obs.observe(el));
  function animateCount(el, to){
    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    function step(now){
      const progress = Math.min(1, (now - startTime)/duration);
      el.textContent = Math.floor(progress * (to - start) + start) + (to >= 7 ? "+" : "");
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

/* Back to top */
function setupBackToTop(){
  const btn = $("#backToTop");
  window.addEventListener("scroll", ()=>{
    if(window.scrollY > 600) btn.classList.add("visible");
    else btn.classList.remove("visible");
  });
  btn.addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));
}

/* Mail & resume wiring */
function wireResumeAndEmail(){
  const email = "your.email@example.com"; // update to your email
  const emailAnchors = $$("a[href^='mailto:'], #emailBtn, #footerEmail");
  emailAnchors.forEach(a=>{
    if(a.id === "emailBtn" || a.id === "footerEmail"){
      a.setAttribute("href", `mailto:${email}`);
    } else {
      a.setAttribute("href", `mailto:${email}`);
    }
  });
  ["contactLinkedIn","contactGitHub","footerLinkedIn","footerGitHub","sidebarLinkedIn","sidebarGitHub"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener("click", ()=>{
      if(id.toLowerCase().includes("linkedin")) window.open(LINKEDIN_URL, "_blank", "noopener");
      else window.open(GITHUB_URL, "_blank", "noopener");
    });
  });
  const downloadBtns = [$("#downloadResumeBtn"), $("#downloadResumeHero"), $("#downloadResumeFooter")].filter(Boolean);
  downloadBtns.forEach(b => b.setAttribute("href", RESUME_FILE));
}

/* Badge float */
function animateBadges(){
  const badgeList = $("#badgeList");
  if(!badgeList) return;
  const badges = Array.from(badgeList.children);
  badges.forEach((b,i)=>{
    const delay = (i%3) * 300;
    b.animate([
      {transform: 'translateY(0px)'},
      {transform: `translateY(${(i%2?6:-6)}px)`},
      {transform: 'translateY(0px)'}
    ], {duration: 4000 + (i*120), iterations: Infinity, easing: 'ease-in-out', delay});
  });
}

/* --- GitHub profile & repo sidebar rendering (pinned + stars/forks) --- */
async function fetchAndRenderGitHubSidebar(){
  const githubUsername = (function(){
    try{
      const u = new URL(GITHUB_URL);
      return u.pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || null;
    } catch(e){
      return null;
    }
  })();

  const repoListEl = document.getElementById('repoList');
  const profileStatsEl = document.getElementById('profileStats');
  const repoMetaEl = document.getElementById('repoMeta');

  if(!githubUsername) {
    repoListEl.innerHTML = '<div class="repo-fallback"><p class="muted">GitHub username not configured. Update GITHUB_URL in script.js.</p></div>';
    return;
  }

  try {
    // fetch up to 100 repos to find pinned ones if specified
    const perPage = 100;
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`),
      fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${perPage}`)
    ]);

    if(!profileRes.ok) throw new Error('Profile fetch failed');
    if(!reposRes.ok) throw new Error('Repos fetch failed');

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    profileStatsEl.textContent = `${profile.login}${profile.company ? ' • ' + profile.company : ''}`;
    repoMetaEl.textContent = `${profile.followers} followers • ${profile.public_repos} repos`;

    repoListEl.innerHTML = '';

    let displayRepos = [];

    if(Array.isArray(PINNED_REPOS) && PINNED_REPOS.length > 0){
      // try to resolve pinned names from fetched repos (keep order from PINNED_REPOS)
      PINNED_REPOS.forEach(p => {
        const found = repos.find(r => r.name.toLowerCase() === p.toLowerCase());
        if(found) displayRepos.push(found);
      });
      // if some pinned names not found, fill with recent repos
      if(displayRepos.length < PINNED_REPOS.length){
        // add additional recent repos not already included
        repos.forEach(r => {
          if(displayRepos.length >= Math.min(PINNED_REPOS.length, 6)) return;
          if(!displayRepos.some(d => d.id === r.id)) displayRepos.push(r);
        });
      }
      // ensure at least some repos shown
      if(displayRepos.length === 0 && repos.length > 0) displayRepos = repos.slice(0, Math.min(6, repos.length));
    } else {
      // no pinned list — show recent repos
      displayRepos = repos.slice(0, Math.min(6, repos.length));
    }

    if(!displayRepos || displayRepos.length === 0){
      repoListEl.innerHTML = '<div class="repo-fallback"><p class="muted">No public repos found.</p></div>';
      return;
    }

    displayRepos.forEach(r => {
      const card = document.createElement('a');
      card.className = 'repo-card';
      card.href = r.html_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.innerHTML = `
        <div class="repo-title">${escapeHtml(r.name)}</div>
        <div class="repo-desc">${escapeHtml(r.description || '')}</div>
        <div class="repo-meta-row">
          ${r.language ? `<span class="pill">${escapeHtml(r.language)}</span>` : ''}
          <span class="meta-item"><svg class="icon" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M10 2l2.6 5.3L18 8l-4 3.6.9 5L10 14.8 5.1 16.6 6 11.6 2 8l5.4-.7L10 2z"></path></svg> ${r.stargazers_count}</span>
          <span class="meta-item"><svg class="icon" viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 6v9a2 2 0 0 0 2 2h10v-2H5V6H3zM7 2h6v4H7V2z"></path></svg> ${r.forks_count}</span>
          <span class="meta-item">${new Date(r.updated_at).toLocaleDateString()}</span>
        </div>
      `;
      repoListEl.appendChild(card);
    });

  } catch (err) {
    console.warn('GitHub fetch failed', err);
    repoListEl.innerHTML = '<div class="repo-fallback"><p class="muted">Unable to fetch GitHub repos (rate limit or offline). You can add static repo cards in script.js fallback.</p></div>';
    repoMetaEl.textContent = '';
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
