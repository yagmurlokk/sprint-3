// js/event-detail.js
import { events } from "./data.js";

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

const container = document.querySelector("#detay");

if (container) {
  const id = new URLSearchParams(location.search).get("id");
  const event = events.find((e) => e.id === id);

  if (!event) {
    document.title = "Etkinlik Bulunamadı - Kampüs Etkinlikleri";
    container.innerHTML = `
      <div style="background-color: #ffebee; border: 1px solid #ef9a9a; border-radius: 8px; padding: 20px; color: #c62828;">
        <h2 style="color: #c62828; margin-top: 0;">Etkinlik Bulunamadı</h2>
        <p style="margin: 10px 0;">Aradığınız etkinlik bulunamadı veya geçersiz bir bağlantı kullandınız.</p>
        <a href="etkinlikler.html" class="btn-back" style="color: #c62828;">&larr; Listeye dön</a>
      </div>
    `;
  } else {
    document.title = `${event.title} - Kampüs Etkinlikleri`;
    const displayDate = formatDate(event.date);

    // js/event-detail.js dosyasındaki ilgili alt buton alanı:
container.innerHTML = `
  <h2>${event.title}</h2>

  <div class="detail-layout">
    <figure class="poster-box">
      <img src="resim1.jpg" alt="${event.title} afiş görseli">
      <figcaption>afiş görseli</figcaption>
    </figure>

    <div class="info-box">
      <dl>
        <dt>Kategori</dt>
        <dd>${event.category}</dd>

        <dt>Tarih & Saat</dt>
        <dd><time datetime="${event.date}">${displayDate}, ${event.time}</time></dd>

        <dt>Yer</dt>
        <dd>${event.location}</dd>

        <dt>Kontenjan</dt>
        <dd>${event.capacity} kişi</dd>
      </dl>
    </div>
  </div>

  <p class="detail-desc">${event.description}</p>

  <div style="display: flex; gap: 15px; margin-top: 20px; align-items: center;">
    <a href="etkinlikler.html" class="btn-back">&larr; Listeye dön</a>
    <!-- DÜZ METİN YERİNE BUTON SINIFI -->
    <a href="etkinlik-guncelle.html?id=${event.id}" class="btn-update">Bu etkinliği güncelle &rarr;</a>
  </div>
`;
  }
}