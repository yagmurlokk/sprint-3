// js/event-form.js
import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const formMesaj = document.querySelector("#form-mesaj");

// GG-AA-YYYY formatını HTML date inputu için YYYY-AA-GG formatına çevirir
function toInputDateFormat(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

// ADIM 11: Güncelleme Modu Kontrolü ve Formu Doldurma
if (form && form.dataset.mode === "guncelle") {
  const id = new URLSearchParams(location.search).get("id");
  const etkinlik = events.find((e) => e.id === id);

  if (etkinlik) {
    // Alanları veriden doldur
    form.elements.ad.value = etkinlik.title || "";
    form.elements.kategori.value = etkinlik.category || "";
    form.elements.tarih.value = toInputDateFormat(etkinlik.date);
    form.elements.saat.value = etkinlik.time || "";
    form.elements.yer.value = etkinlik.location || "";
    form.elements.kontenjan.value = etkinlik.capacity || "";
    form.elements.aciklama.value = etkinlik.description || "";
  } else {
    // ID bulunamazsa veya eksikse formu gösterme, uyarı ve dönüş butonu bas
    form.outerHTML = `
      <div style="background-color: #ffebee; border: 1px solid #ef9a9a; border-radius: 8px; padding: 20px; color: #c62828;">
        <h3 style="margin-top: 0; color: #c62828;">Güncellenecek Etkinlik Bulunamadı</h3>
        <p style="margin: 10px 0;">Geçersiz veya eksik bir etkinlik bağlantısı ile giriş yaptınız.</p>
        <a href="etkinlikler.html" class="btn-detail" style="font-weight: bold;">&larr; Etkinliklere Git</a>
      </div>
    `;
  }
}

// Form Gönderim (Submit) ve Doğrulama
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const capacityVal = fd.get("kontenjan");

    const data = {
      title: (fd.get("ad") || "").trim(),
      category: fd.get("kategori") || "",
      date: fd.get("tarih") || "",
      time: fd.get("saat") || "",
      location: (fd.get("yer") || "").trim(),
      capacity: capacityVal !== "" ? Number(capacityVal) : null,
      description: (fd.get("aciklama") || "").trim()
    };

    // Doğrulama kuralları
    const errors = {};

    if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalıdır.";
    if (!data.category) errors.kategori = "Lütfen bir kategori seçiniz.";
    if (!data.date) errors.tarih = "Tarih alanı zorunludur.";
    if (!data.saat && !data.time) errors.saat = "Saat alanı zorunludur.";
    if (!data.location) errors.yer = "Yer alanı zorunludur.";
    if (data.capacity !== null && (data.capacity < 1 || data.capacity > 1000)) {
      errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalıdır.";
    }

    const alanlar = ["ad", "kategori", "tarih", "saat", "yer", "kontenjan", "aciklama"];

    alanlar.forEach((alanAdi) => {
      const inputElem = form.querySelector(`[name="${alanAdi}"]`);
      const spanElem = document.querySelector(`#${alanAdi}-hata`);

      if (errors[alanAdi]) {
        if (inputElem) inputElem.setAttribute("aria-invalid", "true");
        if (spanElem) spanElem.textContent = errors[alanAdi];
      } else {
        if (inputElem) inputElem.removeAttribute("aria-invalid");
        if (spanElem) spanElem.textContent = "";
      }
    });

    if (Object.keys(errors).length > 0) {
      if (formMesaj) {
        formMesaj.style.display = "block";
        formMesaj.style.backgroundColor = "#ffebee";
        formMesaj.style.color = "#c62828";
        formMesaj.style.border = "1px solid #ef9a9a";
        formMesaj.style.padding = "12px";
        formMesaj.style.borderRadius = "6px";
        formMesaj.textContent = "Formda hatalı alanlar var. Lütfen kontrol ediniz.";
      }
      return;
    }

    // Başarılı durumu
    const isGuncelle = form.dataset.mode === "guncelle";
    if (formMesaj) {
      formMesaj.style.display = "block";
      formMesaj.style.backgroundColor = "#e8f5e9";
      formMesaj.style.color = "#1b5e20";
      formMesaj.style.border = "1px solid #a5d6a7";
      formMesaj.style.padding = "14px";
      formMesaj.style.borderRadius = "6px";
      formMesaj.innerHTML = `
        <p style="margin-bottom: 8px; font-weight: bold;">
          ${isGuncelle ? "Etkinlik başarıyla güncellendi (Nesne):" : "Yeni etkinlik oluşturuldu (Nesne):"}
        </p>
        <pre style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 4px; overflow-x: auto; font-family: monospace;">${JSON.stringify(data, null, 2)}</pre>
      `;
    }
  });
}