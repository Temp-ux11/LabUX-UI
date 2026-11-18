/* ==========================================================================
   HOLLYWOOD REVUE — main.js
   Announcements: sort buttons and search.
   The page works without this file; the controls stay hidden and every
   card is listed.
   ========================================================================== */

function initNews(tools) {
  const section = tools.closest("section");
  const list = section.querySelector("[data-news-list]");
  const items = [...list.querySelectorAll(".news")];
  const search = tools.querySelector("[data-news-search]");
  const sortButtons = [...tools.querySelectorAll("[data-sort]")];
  const empty = section.querySelector("[data-news-empty]");
  const status = section.querySelector("[data-news-status]");
  const text = (item, selector) => item.querySelector(selector).textContent.trim();

  const compare = {
    date: (a, b) => b.querySelector("time").dateTime.localeCompare(a.querySelector("time").dateTime),
    name: (a, b) => text(a, ".news__title").localeCompare(text(b, ".news__title")),
    topic: (a, b) => text(a, ".news__tag").localeCompare(text(b, ".news__tag")),
  };

  function sortBy(key) {
    sortButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.sort === key)));
    items.sort(compare[key]).forEach((item) => list.append(item));
  }

  let announceTimer;
  function filter() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;

    items.forEach((item) => {
      const match = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !match;
      if (match) shown++;
    });

    empty.hidden = shown > 0;

    // Wait for a pause in typing before telling screen readers
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      status.textContent = query ? `${shown} of ${items.length} announcements shown` : "";
    }, 500);
  }

  sortButtons.forEach((button) => button.addEventListener("click", () => sortBy(button.dataset.sort)));
  search.addEventListener("input", filter);
  tools.addEventListener("submit", (event) => event.preventDefault());

  sortBy("date");
  tools.hidden = false;
}

document.querySelectorAll("[data-news-tools]").forEach(initNews);
