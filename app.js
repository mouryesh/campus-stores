(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  // Minutes since Friday midnight, so a slip can be judged late against desk time.
  const dueAt = {
    "Fri 8 pm": 1200,
    "Sat 9 am": 1980,
    "Sat 10 am": 2040,
    "Sat noon": 2160,
  };
  const phaseAt = [945, 1170, 1980];
  const original = () => ({
    version: 1,
    checkin: null,
    holderEdit: 0,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, tone = "") =>
    '<span class="tag' + (tone ? " " + tone : "") + '">' + esc(t) + "</span>";
  const loanBadge = (l) => {
    if (l.back) return badge("Returned");
    const now = phaseAt[s.phase];
    if (now <= dueAt[l.due]) return badge("Out");
    if (l.expected && now <= dueAt[l.expected])
      return badge("Late · expected " + l.expected, "warn");
    return badge("Overdue", "bad");
  };
  const select = (label, key, options) =>
    "<label><span>" +
    label +
    '</span><select name="' +
    key +
    '" required><option value="">Select…</option>' +
    opts(options) +
    "</select></label>";
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf" ? "good" : ""),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html += checkinPanel();
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown) {
      // Only a partly returned kit can have a unit with someone other than the borrower.
      const split =
        !l.back && s.loans.some((x) => x.req === l.req && x.back);
      html += row(
        "L-" + l.num + " · " + l.asset + " · " + getAsset(l.asset).type,
        l.req + " · " + l.who + " · Due " + l.due + holderText(l),
        loanBadge(l) +
          (split ? " " + btn("Update holder", "holder", String(l.num)) : ""),
      );
      if (s.holderEdit === l.num)
        html +=
          '<form data-holder class="holderform"><div class="form">' +
          select("Now with", "holder", people.map((p) => [p, p])) +
          select(
            "Expected back",
            "expected",
            Object.keys(dueAt).map((d) => [d, d]),
          ) +
          '</div><div class="buttons"><button type="submit" class="primary">Save to slip</button>' +
          btn("Cancel", "holder", String(l.num)) +
          "</div></form>";
    }
    return html;
  }
  const holderText = (l) =>
    l.holder && !l.back ? " · Now with " + l.holder + ", expected " + l.expected : "";
  // A return starts from the tag on the unit in hand, never from a row in the list.
  function checkinPanel() {
    const c = s.checkin;
    if (c && c.num) {
      const l = s.loans.find((x) => x.num === c.num);
      const a = getAsset(l.asset);
      return (
        '<div class="record confirm" data-confirm><small>Slip L-' +
        l.num +
        " · " +
        esc(l.req) +
        " · " +
        esc(getReq(l.req).club) +
        "</small><h3>" +
        esc(a.id + " · " + a.type + " · " + a.model) +
        "</h3><p>" +
        esc("Issued to " + l.who + holderText(l) + " · Due " + l.due) +
        " " +
        loanBadge(l) +
        "</p><p>Put it back in bin <b>" +
        esc(a.bin) +
        '</b>.</p><div class="buttons">' +
        btn("Confirm return", "confirm", String(l.num), "primary") +
        btn("Not this one", "uncheck") +
        "</div></div>"
      );
    }
    return (
      '<form data-checkin class="record checkin"><div class="form"><label><span>Check in a returned unit: tag on the unit</span><input name="tag" placeholder="e.g. PR-04" autocomplete="off" required value="' +
      esc((c && c.tag) || "") +
      '"></label></div>' +
      (c && c.error
        ? '<p class="warnline" role="alert">' + esc(c.error) + "</p>"
        : "") +
      '<button type="submit">Find slip</button></form>'
    );
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.checkin = null;
        s.holderEdit = 0;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.holderEdit = 0;
        break;
      case "holder":
        s.holderEdit = s.holderEdit === Number(v) ? 0 : Number(v);
        break;
      case "uncheck":
        s.checkin = null;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "confirm": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back || !s.checkin || s.checkin.num !== l.num) return;
        l.back = true;
        s.checkin = null;
        s.notice =
          l.asset +
          " returned to stock in bin " +
          getAsset(l.asset).bin +
          ". Slip L-" +
          l.num +
          " closed.";
        break;
      }
    }
    commit();
    if (b.dataset.action === "confirm") q("[data-checkin] input").focus();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-checkin]")) {
      const tag = String(form.get("tag")).trim().toUpperCase();
      const a = getAsset(tag);
      const l = a && out(a.id);
      let error = "";
      if (!a) error = "No unit is tagged " + tag + ". Check the label.";
      else if (a.repair)
        error = a.id + " is a workshop unit and was never issued. Check the tag.";
      else if (!l)
        error =
          a.id +
          " (" +
          a.model +
          ") is not on any open slip. Check the tag before shelving it in bin " +
          a.bin +
          ".";
      s.checkin = error ? { tag, error } : { tag, num: l.num };
      commit(error ? "No open slip for that tag." : "Check the unit, then confirm.");
      q(error ? "[data-checkin] input" : "[data-confirm] .primary").focus();
      return;
    }
    if (f.matches("[data-holder]")) {
      const l = s.loans.find((x) => x.num === s.holderEdit);
      const [holder, expected] = [form.get("holder"), form.get("expected")];
      if (!l || l.back || !people.includes(holder) || !dueAt[expected]) return;
      if (dueAt[expected] < phaseAt[s.phase]) {
        q("[data-status]").textContent =
          "That time has already passed. Choose when it will actually be back.";
        return;
      }
      Object.assign(l, { holder, expected });
      s.holderEdit = 0;
      commit("Slip L-" + l.num + ": " + l.asset + " is with " + holder + ".");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (
      !r ||
      !unit ||
      unit.repair ||
      out(asset) ||
      !people.includes(who) ||
      !dueAt[due]
    )
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    if (dueAt[due] > dueAt[r.due]) {
      q("[data-status]").textContent =
        "This request must be back by " + r.due + ". Choose that time or earlier.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l &&
          getReq(l.req) &&
          getAsset(l.asset) &&
          Number.isInteger(l.num) &&
          dueAt[l.due] &&
          (!l.holder || (people.includes(l.holder) && dueAt[l.expected])),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
      checkin: null,
      holderEdit: 0,
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
