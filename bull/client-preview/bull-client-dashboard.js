(function () {
  const repairs = [
    { id: "#482", repo: "acme/payment-service", title: "Null pointer in refund flow", status: "Fixed", files: 3, evidence: "12 / 12 passed", confidence: 92, time: "2m ago" },
    { id: "#371", repo: "acme/user-api", title: "Validation error on email update", status: "Pending Review", files: 2, evidence: "8 / 10 passed", confidence: 78, time: "9m ago" },
    { id: "#1289", repo: "acme/web-frontend", title: "Button disabled on modal open", status: "Fixed", files: 1, evidence: "15 / 15 passed", confidence: 95, time: "24m ago" },
    { id: "#903", repo: "acme/reporting-service", title: "Date range filter incorrect", status: "Needs Attention", files: 4, evidence: "5 / 11 passed", confidence: 42, time: "45m ago" },
    { id: "#556", repo: "acme/inventory-service", title: "Stock not reserved under load", status: "Pending Review", files: 5, evidence: "9 / 12 passed", confidence: 65, time: "1h ago" },
    { id: "#214", repo: "acme/checkout-api", title: "Retry counter not reset", status: "Fixed", files: 2, evidence: "18 / 18 passed", confidence: 94, time: "2h ago" },
  ];

  const activity = [
    ["Repair #482 was verified and marked as fixed", "2m ago"],
    ["Repair #371 is pending your review", "9m ago"],
    ["Repair #1289 was verified and marked as fixed", "24m ago"],
    ["Repair #903 needs attention", "45m ago"],
    ["Daily verification summary is ready", "1h ago"],
  ];

  const valueItems = [
    ["Bugs closed", "42"],
    ["Manual hours saved", "36.7 hrs"],
    ["Deployments unblocked", "7"],
    ["Estimated cost avoided", "$18,350"],
  ];

  const trustItems = [
    "Every repair includes an audit trail",
    "Source integrity verified",
    "Tests executed in isolated environment",
    "Evidence summaries are client-safe",
  ];

  const healthItems = [
    ["Repair intake", "Healthy"],
    ["Verification pipeline", "Healthy"],
    ["Evidence storage", "Healthy"],
    ["Approval delivery", "Healthy"],
  ];

  const rangeStats = {
    7: { fixed: 14, pending: 3, attention: 1, hours: 11.6, delta: "+4.1 hrs this week", trend: [2, 1, 3, 2, 2, 1, 3], value: [4, 12, 2, 5200] },
    30: { fixed: 42, pending: 8, attention: 3, hours: 36.7, delta: "+9.4 hrs this period", trend: [4, 6, 5, 8, 7, 12], value: [42, 36.7, 7, 18350] },
    90: { fixed: 118, pending: 15, attention: 6, hours: 104.5, delta: "+27.8 hrs this quarter", trend: [18, 22, 19, 25, 16, 18], value: [118, 104.5, 16, 52400] },
  };

  let currentRange = "30";
  let repairFilter = "all";
  let reportText = "";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setField(name, value) {
    document.querySelectorAll(`[data-field="${name}"]`).forEach((node) => {
      node.textContent = value;
    });
  }

  function showView(name) {
    document.querySelectorAll("[data-nav]").forEach((button) => button.classList.toggle("active", button.dataset.nav === name));
    document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("active", view.dataset.view === name));
  }

  function statusClass(status) {
    if (status === "Fixed") return "";
    if (status === "Pending Review") return "warn";
    return "bad";
  }

  function confidenceLabel(value) {
    if (value >= 90) return "High";
    if (value >= 65) return "Medium";
    return "Low";
  }

  function repairRow(repair) {
    return `
      <tr>
        <td><strong>${escapeHtml(repair.repo)}</strong><br><span class="muted">${escapeHtml(repair.id)} ${escapeHtml(repair.title)}</span></td>
        <td><span class="status-pill ${statusClass(repair.status)}">${escapeHtml(repair.status)}</span></td>
        <td class="numeric">${repair.files}</td>
        <td><span class="status-pill ${repair.status === "Needs Attention" ? "bad" : repair.status === "Pending Review" ? "warn" : ""}">${escapeHtml(repair.evidence)}</span></td>
        <td>${escapeHtml(confidenceLabel(repair.confidence))} <span class="muted">${repair.confidence}%</span></td>
        <td><button class="text-button" type="button" data-action="view-repair" data-id="${escapeHtml(repair.id)}">View</button></td>
      </tr>`;
  }

  function renderRepairs() {
    const visible = repairs.filter((repair) => repairFilter === "all" || repair.status === repairFilter);
    const recent = document.getElementById("recentRepairRows");
    const all = document.getElementById("repairRows");
    if (recent) recent.innerHTML = repairs.slice(0, 5).map(repairRow).join("");
    if (all) all.innerHTML = visible.map(repairRow).join("");
  }

  function renderValue() {
    const stat = rangeStats[currentRange];
    const labels = ["Bugs closed", "Manual hours saved", "Deployments unblocked", "Estimated cost avoided"];
    const formatted = [String(stat.value[0]), `${stat.value[1]} hrs`, String(stat.value[2]), `$${Number(stat.value[3]).toLocaleString()}`];
    const html = labels.map((label, index) => `
      <div class="list-row">
        <div><strong>${escapeHtml(label)}</strong><span>Verified this period</span></div>
        <strong>${escapeHtml(formatted[index])}</strong>
      </div>`).join("");
    document.querySelectorAll("#valueList, #billingValueList").forEach((node) => { node.innerHTML = html; });
  }

  function renderLists() {
    const trust = document.getElementById("trustList");
    if (trust) {
      trust.innerHTML = trustItems.map((item) => `
        <div class="list-row"><div><strong>${escapeHtml(item)}</strong></div><span class="good">Verified</span></div>`).join("");
    }

    const health = document.getElementById("healthList");
    if (health) {
      health.innerHTML = healthItems.map(([name, status]) => `
        <div class="list-row"><div><strong>${escapeHtml(name)}</strong></div><span class="good">${escapeHtml(status)}</span></div>`).join("");
    }

    const activityNode = document.getElementById("activityList");
    if (activityNode) {
      activityNode.innerHTML = activity.map(([text, time]) => `
        <div class="activity-row"><span>${escapeHtml(text)}</span><strong>${escapeHtml(time)}</strong></div>`).join("");
    }
  }

  function renderEvidence() {
    const node = document.getElementById("evidenceList");
    if (!node) return;
    node.innerHTML = repairs.map((repair) => `
      <div class="evidence-row">
        <div>
          <strong>${escapeHtml(repair.id)} ${escapeHtml(repair.repo)}</strong>
          <span>${escapeHtml(repair.evidence)}. Change summary and audit trail ready.</span>
        </div>
        <button class="text-button" type="button" data-action="view-repair" data-id="${escapeHtml(repair.id)}">Open</button>
      </div>`).join("");
  }

  function renderApprovals() {
    const node = document.getElementById("approvalList");
    if (!node) return;
    const pending = repairs.filter((repair) => repair.status !== "Fixed");
    node.innerHTML = pending.map((repair) => `
      <div class="approval-row">
        <div>
          <strong>${escapeHtml(repair.id)} ${escapeHtml(repair.title)}</strong>
          <span>${escapeHtml(repair.repo)} | ${escapeHtml(repair.evidence)} | ${repair.confidence}% confidence</span>
        </div>
        <div class="button-row">
          <button class="button primary" type="button" data-action="approve-repair" data-id="${escapeHtml(repair.id)}">Approve</button>
          <button class="button" type="button" data-action="request-changes" data-id="${escapeHtml(repair.id)}">Request Changes</button>
        </div>
      </div>`).join("") || `<div class="client-card">No repairs are waiting for approval.</div>`;
  }

  function drawLineChart(canvas, values, color = "#2563eb") {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(320, Math.floor(rect.width || canvas.width));
    const height = Math.max(220, Math.floor(rect.height || canvas.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const pad = 28;
    const max = Math.max(...values, 1);
    ctx.strokeStyle = "#dce3ec";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = pad + ((height - pad * 2) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(width - pad, y);
      ctx.stroke();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = pad + ((width - pad * 2) * index) / Math.max(values.length - 1, 1);
      const y = height - pad - (value / max) * (height - pad * 2);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = color;
    values.forEach((value, index) => {
      const x = pad + ((width - pad * 2) * index) / Math.max(values.length - 1, 1);
      const y = height - pad - (value / max) * (height - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawBarChart(canvas, values) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(320, Math.floor(rect.width || canvas.width));
    const height = Math.max(220, Math.floor(rect.height || canvas.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const max = Math.max(...values, 1);
    const labels = ["Fixed", "Hours", "Deploy", "Avoided"];
    const pad = 34;
    const gap = 18;
    const barW = (width - pad * 2 - gap * (values.length - 1)) / values.length;
    values.forEach((value, index) => {
      const h = (value / max) * (height - pad * 2);
      const x = pad + index * (barW + gap);
      const y = height - pad - h;
      ctx.fillStyle = ["#07945d", "#2563eb", "#7c3aed", "#c87500"][index];
      ctx.fillRect(x, y, barW, h);
      ctx.fillStyle = "#52627a";
      ctx.font = "12px Segoe UI, sans-serif";
      ctx.fillText(labels[index], x, height - 10);
    });
  }

  function buildReport() {
    const stat = rangeStats[currentRange];
    const lines = [];
    lines.push("BULL CLIENT PREVIEW SUMMARY");
    lines.push("");
    lines.push("Workspace: Acme Corp");
    lines.push(`Range: Last ${currentRange} days`);
    lines.push("Data: sample preview data");
    lines.push("");
    lines.push(`Fixed and verified: ${stat.fixed}`);
    lines.push(`Pending review: ${stat.pending}`);
    lines.push(`Needs attention: ${stat.attention}`);
    lines.push(`Manual time saved: ${stat.hours} hrs`);
    lines.push("");
    lines.push("Recent Repairs");
    repairs.slice(0, 5).forEach((repair) => {
      lines.push(`- ${repair.id} ${repair.repo}: ${repair.status}, ${repair.evidence}`);
    });
    lines.push("");
    lines.push("Trust");
    trustItems.forEach((item) => lines.push(`- ${item}`));
    return lines.join("\n");
  }

  function renderReport() {
    reportText = buildReport();
    const node = document.getElementById("clientReportText");
    if (node) node.textContent = reportText;
  }

  function renderStats() {
    const stat = rangeStats[currentRange];
    setField("fixedCount", stat.fixed);
    setField("pendingCount", stat.pending);
    setField("attentionCount", stat.attention);
    setField("timeSaved", `${stat.hours} hrs`);
    setField("fixedDelta", currentRange === "7" ? "+4 this week" : currentRange === "30" ? "+12 this period" : "+31 this quarter");
    setField("pendingDelta", currentRange === "7" ? "-1 this week" : currentRange === "30" ? "-2 this period" : "-6 this quarter");
    setField("attentionDelta", currentRange === "7" ? "0 this week" : currentRange === "30" ? "+1 this period" : "+2 this quarter");
    setField("timeDelta", stat.delta);
    setField("lastUpdated", `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    drawLineChart(document.getElementById("repairTrendChart"), stat.trend);
    drawBarChart(document.getElementById("valueChart"), stat.value);
    renderValue();
    renderReport();
  }

  function openModal(title, html) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = html;
    document.getElementById("clientModal").classList.add("open");
    document.getElementById("clientModal").setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    document.getElementById("clientModal").classList.remove("open");
    document.getElementById("clientModal").setAttribute("aria-hidden", "true");
  }

  function toast(message) {
    const node = document.getElementById("clientToast");
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("show"), 2200);
  }

  function viewRepair(id) {
    const repair = repairs.find((item) => item.id === id);
    if (!repair) return;
    openModal(`${repair.id} ${repair.repo}`, `
      <div class="evidence-row">
        <div>
          <strong>${escapeHtml(repair.title)}</strong>
          <span>Status: ${escapeHtml(repair.status)} | Evidence: ${escapeHtml(repair.evidence)} | Confidence: ${repair.confidence}%</span>
        </div>
      </div>
      <p class="muted">Client-safe summary: this repair includes an audit trail, test evidence, and a change summary suitable for review.</p>`);
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText);
    } catch {
      const area = document.createElement("textarea");
      area.value = reportText;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    toast("Summary copied");
  }

  function downloadReport() {
    const blob = new Blob([reportText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bull-client-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
    toast("Summary downloaded");
  }

  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (nav) showView(nav.dataset.nav);

    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = action.dataset.id;
    if (action.dataset.action === "view-repairs") showView("repairs");
    if (action.dataset.action === "view-audit") showView("evidence");
    if (action.dataset.action === "view-activity") openModal("Recent Activity", activity.map(([text, time]) => `<div class="activity-row"><span>${escapeHtml(text)}</span><strong>${escapeHtml(time)}</strong></div>`).join(""));
    if (action.dataset.action === "view-repair") viewRepair(id);
    if (action.dataset.action === "approve-repair") {
      const repair = repairs.find((item) => item.id === id);
      if (repair) repair.status = "Fixed";
      toast(`${id} approved`);
      renderAll();
    }
    if (action.dataset.action === "request-changes") toast(`${id} marked for follow-up`);
    if (action.dataset.action === "contact-support") openModal("Request Demo", `<p class="muted">This preview represents one private client workspace. A live setup would include only that client's repairs, approved evidence, and approval flow.</p><button class="button primary" type="button" data-action="close-modal">Done</button>`);
    if (action.dataset.action === "close-modal") closeModal();
    if (action.dataset.action === "copy-report") copyReport();
    if (action.dataset.action === "download-report") downloadReport();
  });

  document.getElementById("dateRange")?.addEventListener("change", (event) => {
    currentRange = event.target.value;
    renderStats();
  });

  document.getElementById("repairFilter")?.addEventListener("change", (event) => {
    repairFilter = event.target.value;
    renderRepairs();
  });

  document.getElementById("exportSummary")?.addEventListener("click", downloadReport);
  document.getElementById("accountMenu")?.addEventListener("click", () => openModal("Account", `<p class="muted">Acme Team sample workspace. No live client data is connected in this preview.</p>`));
  document.getElementById("saveClientSettings")?.addEventListener("click", () => {
    document.body.classList.toggle("compact", Boolean(document.getElementById("compactClientMode")?.checked));
    toast("Settings saved");
  });

  window.addEventListener("resize", () => {
    const stat = rangeStats[currentRange];
    drawLineChart(document.getElementById("repairTrendChart"), stat.trend);
    drawBarChart(document.getElementById("valueChart"), stat.value);
  });

  function renderAll() {
    renderRepairs();
    renderLists();
    renderEvidence();
    renderApprovals();
    renderStats();
  }

  showView("overview");
  renderAll();
})();
