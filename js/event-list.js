// js/event-list.js
import { events } from "./data.js";

// Tarihi "12 Ekim 2026" okunur formata çeviren yardımcı fonksiyon
function formatDate(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    return dateObj.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
  return dateStr;
}

// Görsele birebir uygun kart şablonu
function createCard(event) {
  const displayDate = formatDate(event.date);

  return `
    <article class="card">
      <h3>${event.title}</h3>
      <span class="category-badge">${event.category}</span>
      <p><strong>Tarih:</strong> ${displayDate}, ${event.time}</p>
      <p><strong>Yer:</strong> ${event.location}</p>
      <p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>
      <p class="card-desc">${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}" class="btn-detail">Detayları gör</a>
    </article>
  `;
}

// DOM Elemanları
const list = document.querySelector("#etkinlik-listesi");
const filtreFormu = document.querySelector("#filtre-formu");
const aramaInput = document.querySelector("#arama");
const kategoriSelect = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");

function render(dizi) {
  if (!list) return;

  if (dizi.length === 0) {
    list.innerHTML = `<p style="grid-column: 1 / -1; color: #666; font-style: italic;">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>`;
    return;
  }

  list.innerHTML = dizi.map(createCard).join("");
}

function kategoriSecenekleriniDoldur() {
  if (!kategoriSelect) return;
  const benzersizKategoriler = [...new Set(events.map((e) => e.category))];
  benzersizKategoriler.forEach((kategori) => {
    const opt = document.createElement("option");
    opt.value = kategori;
    opt.textContent = kategori;
    kategoriSelect.appendChild(opt);
  });
}

function filtrele() {
  if (!aramaInput || !kategoriSelect) return;

  const aranan = aramaInput.value.trim().toLocaleLowerCase("tr-TR");
  const secilenKategori = kategoriSelect.value;

  const sonuc = events.filter((e) => {
    const metinUyuyor =
      e.title.toLocaleLowerCase("tr-TR").includes(aranan) ||
      e.description.toLocaleLowerCase("tr-TR").includes(aranan);
    const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;
    return metinUyuyor && kategoriUyuyor;
  });

  render(sonuc);

  if (sonucSatiri) {
    sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
  }
}

// Sayfa Kontrolü
if (list) {
  // ANA SAYFA: Sadece yaklaşan 2 etkinlik
  if (list.dataset.limit) {
    const toISODate = (d) => d.split("-").reverse().join("-");
    const yaklasan = [...events]
      .sort((a, b) => toISODate(a.date).localeCompare(toISODate(b.date)))
      .slice(0, Number(list.dataset.limit));

    render(yaklasan);
  } else {
    // LİSTE SAYFASI (etkinlikler.html)
    kategoriSecenekleriniDoldur();
    render(events);

    if (sonucSatiri) {
      sonucSatiri.textContent = `${events.length} etkinlik listeleniyor.`;
    }

    if (aramaInput) aramaInput.addEventListener("input", filtrele);
    if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);
    if (filtreFormu) filtreFormu.addEventListener("submit", (e) => e.preventDefault());
  }
}