"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mockData } from "../../../mockData";
import { apiBase } from "../../lib/api";
import ServiceIcon from "../ServiceIcon";
import styles from "./add-company.module.css";

const storageKey = "servicehub-company-draft-v1";
const initialForm = {
  id: "",
  categoryId: "",
  name: "",
  logo: "",
  shortDesc: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  prices: [{ service: "", price: "" }],
};
const steps = ["Unternehmen", "Kontakt", "Leistungen", "Prüfen"];

function validate(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.categoryId) errors.categoryId = "Wählen Sie eine Dienstleistungskategorie.";
    if (form.name.trim().length < 2) errors.name = "Geben Sie einen Firmennamen mit mindestens 2 Zeichen ein.";
    if (form.shortDesc.trim().length < 20) errors.shortDesc = "Beschreiben Sie Ihr Unternehmen mit mindestens 20 Zeichen.";
  }
  if (step === 1) {
    if (form.address.trim().length < 5) errors.address = "Geben Sie Ihre Geschäftsadresse oder Ihr Einsatzgebiet ein.";
    if (!/^\+?[\d\s().-]{7,}$/.test(form.phone.trim())) errors.phone = "Geben Sie eine gültige Telefonnummer ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Geben Sie eine gültige E-Mail-Adresse ein.";
    if (form.website.trim()) {
      try {
        const url = new URL(form.website.trim());
        if (!["http:", "https:"].includes(url.protocol)) errors.website = "Verwenden Sie eine Webadresse mit http oder https.";
      } catch { errors.website = "Geben Sie eine vollständige Webadresse ein, zum Beispiel https://example.com."; }
    }
  }
  if (step === 2) {
    form.prices.forEach((item, index) => {
      if (!item.service.trim()) errors[`service-${index}`] = "Geben Sie die Leistung ein.";
      if (!item.price.trim()) errors[`price-${index}`] = "Geben Sie einen Preis oder Einstiegspreis ein.";
    });
  }
  return errors;
}

function Field({ id, label, hint, error, children }) {
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{hint && <small id={`${id}-hint`}>{hint}</small>}{children}{error && <span id={`${id}-error`} className={styles.error}>{error}</span>}</div>;
}

function CategoryPicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selected = mockData.categories.find((item) => item.id === value);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event) {
      if (!pickerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  function focusOption(index) {
    optionRefs.current[index]?.focus();
  }

  function openAndFocus(index) {
    setOpen(true);
    requestAnimationFrame(() => focusOption(index));
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const selectedIndex = mockData.categories.findIndex((item) => item.id === value);
      openAndFocus(selectedIndex >= 0 ? selectedIndex : event.key === "ArrowDown" ? 0 : mockData.categories.length - 1);
    }
  }

  function handleOptionKeyDown(event, index) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const last = mockData.categories.length - 1;
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? last : event.key === "ArrowDown" ? (index + 1) % mockData.categories.length : (index + last) % mockData.categories.length;
      focusOption(nextIndex);
    }
  }

  return (
    <div className={styles.categoryPicker} ref={pickerRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button
        id="category"
        ref={triggerRef}
        type="button"
        className={styles.categoryTrigger}
        aria-expanded={open}
        aria-controls="category-options"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "category-error" : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={selected ? "" : styles.categoryPlaceholder}>{selected?.title || "Kategorie wählen"}</span>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div id="category-options" className={styles.categoryOptions} role="group" aria-label="Dienstleistungskategorien">
          {mockData.categories.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => { optionRefs.current[index] = node; }}
              type="button"
              className={styles.categoryOption}
              aria-pressed={value === item.id}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onClick={() => { onChange(item.id); setOpen(false); triggerRef.current?.focus(); }}
            >
              <span>{item.title}</span>
              {value === item.id && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddCompanyForm() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingFromReview, setEditingFromReview] = useState(false);
  const errorSummaryRef = useRef(null);
  const stepHeadingRef = useRef(null);
  const successHeadingRef = useRef(null);

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (draft && typeof draft === "object" && Array.isArray(draft.prices)) {
        setForm({ ...initialForm, ...draft, logo: "" });
        setNotice("Ihr gespeicherter Entwurf wurde wiederhergestellt. Wählen Sie das Logo erneut aus.");
      }
    } catch { /* Ignore a damaged local draft. */ }
  }, []);

  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }, [logoPreview]);

  useEffect(() => {
    if (showSuccess) successHeadingRef.current?.focus();
  }, [showSuccess]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setNotice("");
  }

  function updatePrice(index, name, value) {
    setForm((current) => ({ ...current, prices: current.prices.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
    setErrors((current) => ({ ...current, [`${name}-${index}`]: undefined }));
  }

  function changePrices(prices) {
    setForm((current) => ({ ...current, prices }));
    setErrors({});
    setNotice("");
  }

  function saveDraft() {
    try {
      const draft = { ...form, id: form.id || `draft-${crypto.randomUUID()}` };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setForm(draft);
      setNotice("Ihr Entwurf wurde auf diesem Gerät gespeichert.");
    } catch {
      setNotice("Der Entwurf konnte nicht gespeichert werden. Prüfen Sie die Speichereinstellungen Ihres Browsers.");
    }
  }

  async function submitCompany() {
    const nextErrors = Object.assign({}, ...[0, 1, 2].map((item) => validate(form, item)));
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStep(nextErrors.categoryId || nextErrors.name || nextErrors.shortDesc ? 0 : nextErrors.address || nextErrors.phone || nextErrors.email || nextErrors.website ? 1 : 2);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      const { id, logo, ...data } = form;
      const payload = new FormData();
      payload.set("data", JSON.stringify(data));
      if (logoFile) payload.set("logo", logoFile);
      const response = await fetch(`${apiBase}/api/company-submissions`, { method: "POST", body: payload });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Der Eintrag konnte nicht gesendet werden.");
      localStorage.removeItem(storageKey);
      setShowSuccess(true);
    } catch (error) {
      setNotice(error.message || "Der Eintrag konnte nicht gesendet werden. Versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  function startAgain() {
    setForm(initialForm);
    setStep(0);
    setErrors({});
    setNotice("");
    setLogoPreview("");
    setLogoName("");
    setLogoFile(null);
    setEditingFromReview(false);
    setShowSuccess(false);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function next() {
    const nextErrors = validate(form, step);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setErrors({});
    setNotice("");
    setStep((current) => editingFromReview ? steps.length - 1 : Math.min(current + 1, steps.length - 1));
    setEditingFromReview(false);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function changeStep(target) {
    setErrors({});
    setNotice("");
    setEditingFromReview(true);
    setStep(target);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function chooseLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/webp", "image/png", "image/jpeg"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, logo: "Wählen Sie ein WebP-, PNG- oder JPEG-Bild unter 2 MB." }));
      event.target.value = "";
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    setLogoName(file.name);
    setLogoFile(file);
    setForm((current) => ({ ...current, logo: file.name }));
    setErrors((current) => ({ ...current, logo: undefined }));
    setNotice("");
  }

  const category = mockData.categories.find((item) => item.id === form.categoryId);
  const initials = form.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SH";
  const fieldIds = { categoryId: "category" };
  const fieldLabels = { categoryId: "Dienstleistungskategorie", name: "Firmenname", shortDesc: "Kurzbeschreibung", logo: "Firmenlogo", address: "Adresse oder Einsatzgebiet", phone: "Telefonnummer", email: "E-Mail-Adresse", website: "Webseite" };
  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));

  if (showSuccess) {
    return (
      <main className={styles.page}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <span className={styles.successIcon} aria-hidden="true">✓</span>
            <h1 ref={successHeadingRef} tabIndex={-1}>Anfrage erfolgreich gesendet</h1>
            <p>Ihr Unternehmenseintrag wurde an ServiceHub gesendet und wartet auf die Freigabe.</p>
            <button type="button" className={styles.startAgain} onClick={startAgain}>Neuen Eintrag vorbereiten <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <Link href="/services" className={styles.backLink}>← Dienstleistungen entdecken</Link>
          <h1>Unternehmenseintrag vorbereiten</h1>
          <p>Bereiten Sie Ihren Eintrag vor und senden Sie ihn zur Prüfung. Nach Freigabe durch unser Team wird er veröffentlicht.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <div className={styles.progressLabel}>Schritt {step + 1} von {steps.length}</div>
            <div className={styles.progressTrack}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <ol className={styles.steps} aria-label="Formularschritte">{steps.map((item, index) => <li key={item} className={index === step ? styles.currentStep : index < step ? styles.doneStep : ""} aria-current={index === step ? "step" : undefined}>{item}</li>)}</ol>

            {errorEntries.length > 0 && <div id="form-error-summary" ref={errorSummaryRef} className={styles.errorSummary} role="alert" tabIndex={-1}><strong>Bitte prüfen Sie diese Angaben:</strong><ul>{errorEntries.map(([key, message]) => <li key={key}><a href={`#${fieldIds[key] || key}`}>{fieldLabels[key] || (key.startsWith("service-") ? "Leistungsname" : "Preis oder Satz")}: {message}</a></li>)}</ul></div>}
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            {step === 0 && <section className={styles.formSection} aria-labelledby="company-heading">
              <h2 id="company-heading" ref={stepHeadingRef} tabIndex={-1}>Unternehmen</h2><p>Alle Felder außer dem Logo sind erforderlich.</p>
              <Field id="category" label="Dienstleistungskategorie" error={errors.categoryId}><CategoryPicker value={form.categoryId} onChange={(value) => update("categoryId", value)} error={errors.categoryId} /></Field>
              <Field id="name" label="Firmenname" error={errors.name}><input id="name" type="text" autoComplete="organization" maxLength="80" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="z. B. ColorPro Painters" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} /></Field>
              <Field id="shortDesc" label="Kurzbeschreibung" hint="Beschreiben Sie Ihr Angebot in 20 bis 220 Zeichen." error={errors.shortDesc}><textarea id="shortDesc" rows="4" maxLength="220" value={form.shortDesc} onChange={(event) => update("shortDesc", event.target.value)} placeholder="z. B. Innen- und Außenanstriche für Wohngebäude" aria-invalid={Boolean(errors.shortDesc)} aria-describedby={`shortDesc-hint${errors.shortDesc ? " shortDesc-error" : ""}`} /><span className={styles.counter}>{form.shortDesc.length}/220</span></Field>
              <Field id="logo" label="Firmenlogo (optional)" hint="Ohne Logo zeigen wir das Symbol Ihrer Dienstleistung. PNG, JPEG oder WebP, maximal 2 MB." error={errors.logo}><div className={styles.logoUpload}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="Vorschau des Firmenlogos" /> : form.categoryId ? <ServiceIcon type={form.categoryId} className={styles.previewIcon} /> : initials}</div><div><input id="logo" type="file" accept="image/webp,image/png,image/jpeg" onChange={chooseLogo} aria-invalid={Boolean(errors.logo)} aria-describedby={`logo-hint${errors.logo ? " logo-error" : ""}`} /><span>{logoName || "Bild auswählen"}</span></div></div></Field>
            </section>}

            {step === 1 && <section className={styles.formSection} aria-labelledby="contact-heading">
              <h2 id="contact-heading" ref={stepHeadingRef} tabIndex={-1}>Kontakt</h2><p>Die Webseite ist optional.</p>
              <Field id="address" label="Geschäftsadresse oder Einsatzgebiet" hint="Sie können auch nur den Ort oder die Region angeben." error={errors.address}><input id="address" type="text" autoComplete="street-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="z. B. 10115 Berlin" aria-invalid={Boolean(errors.address)} aria-describedby={`address-hint${errors.address ? " address-error" : ""}`} /></Field>
              <div className={styles.twoColumns}><Field id="phone" label="Telefonnummer" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+49 30 0000 0001" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} /></Field><Field id="email" label="Geschäftliche E-Mail-Adresse" error={errors.email}><input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="kontakt@beispiel.de" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /></Field></div>
              <Field id="website" label="Webseite (optional)" hint="Beginnen Sie die Adresse mit https://." error={errors.website}><input id="website" type="url" autoComplete="url" value={form.website} onChange={(event) => update("website", event.target.value)} placeholder="https://beispiel.de" aria-invalid={Boolean(errors.website)} aria-describedby={`website-hint${errors.website ? " website-error" : ""}`} /></Field>
            </section>}

            {step === 2 && <section className={styles.formSection} aria-labelledby="services-heading">
              <h2 id="services-heading" ref={stepHeadingRef} tabIndex={-1}>Leistungen und Preise</h2><p>Geben Sie mindestens eine Leistung mit Preis oder Stundensatz an.</p>
              {form.prices.map((item, index) => <div className={styles.priceRow} key={index}><div className={styles.priceHeading}><strong>Leistung {index + 1}</strong>{form.prices.length > 1 && <button type="button" onClick={() => changePrices(form.prices.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Leistung ${index + 1} entfernen`}>Entfernen</button>}</div><div className={styles.twoColumns}><Field id={`service-${index}`} label="Leistungsname" error={errors[`service-${index}`]}><input id={`service-${index}`} type="text" value={item.service} onChange={(event) => updatePrice(index, "service", event.target.value)} placeholder="z. B. Innenwände streichen" aria-invalid={Boolean(errors[`service-${index}`])} aria-describedby={errors[`service-${index}`] ? `service-${index}-error` : undefined} /></Field><Field id={`price-${index}`} label="Preis oder Satz" error={errors[`price-${index}`]}><input id={`price-${index}`} type="text" value={item.price} onChange={(event) => updatePrice(index, "price", event.target.value)} placeholder="z. B. ab 10 € / m²" aria-invalid={Boolean(errors[`price-${index}`])} aria-describedby={errors[`price-${index}`] ? `price-${index}-error` : undefined} /></Field></div></div>)}
              <button type="button" className={styles.addService} onClick={() => changePrices([...form.prices, { service: "", price: "" }])}>+ Leistung hinzufügen</button>
            </section>}

            {step === 3 && <section className={styles.formSection} aria-labelledby="review-heading">
              <h2 id="review-heading" ref={stepHeadingRef} tabIndex={-1}>Angaben prüfen</h2><p>Änderungen sind in jedem Abschnitt möglich.</p>
              <div className={styles.reviewCard}>
                <div className={styles.reviewGroup}><div className={styles.reviewGroupHeading}><h3>Unternehmen</h3><button type="button" onClick={() => changeStep(0)} aria-label="Unternehmen ändern">Ändern</button></div><div className={styles.reviewHeader}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="" /> : form.categoryId ? <ServiceIcon type={form.categoryId} className={styles.previewIcon} /> : initials}</div><div><strong>{form.name}</strong><span>{category?.title}</span></div></div><p>{form.shortDesc}</p></div>
                <div className={styles.reviewGroup}><div className={styles.reviewGroupHeading}><h3>Kontakt</h3><button type="button" onClick={() => changeStep(1)} aria-label="Kontakt ändern">Ändern</button></div><dl><div><dt>Adresse oder Einsatzgebiet</dt><dd>{form.address}</dd></div><div><dt>Telefon</dt><dd>{form.phone}</dd></div><div><dt>E-Mail</dt><dd>{form.email}</dd></div><div><dt>Webseite</dt><dd>{form.website || "Nicht angegeben"}</dd></div></dl></div>
                <div className={styles.reviewGroup}><div className={styles.reviewGroupHeading}><h3>Leistungen und Preise</h3><button type="button" onClick={() => changeStep(2)} aria-label="Leistungen und Preise ändern">Ändern</button></div><ul>{form.prices.map((item, index) => <li key={index}><span>{item.service}</span><strong>{item.price}</strong></li>)}</ul></div>
              </div>
              <div className={styles.draftWarning}><strong>Prüfung vor Veröffentlichung</strong><p>Mit „Zur Prüfung einreichen“ senden Sie den Eintrag an ServiceHub. Er erscheint erst nach Freigabe. „Entwurf speichern“ speichert ihn nur auf diesem Gerät.</p></div>
            </section>}

            <div className={styles.actions}>
              {step > 0 && <button type="button" className={styles.secondaryButton} onClick={() => { setErrors({}); setStep(editingFromReview ? steps.length - 1 : step - 1); setEditingFromReview(false); requestAnimationFrame(() => stepHeadingRef.current?.focus()); }}>{editingFromReview ? "Zur Übersicht" : "Zurück"}</button>}
              <button type="button" className={styles.saveButton} onClick={saveDraft} disabled={submitting}>Entwurf speichern</button>
              {step < steps.length - 1 ? <button type="button" className={styles.primaryButton} onClick={next}>{editingFromReview ? "Zur Übersicht" : "Weiter"} <span aria-hidden="true">→</span></button> : <button type="button" className={styles.primaryButton} onClick={submitCompany} disabled={submitting}>{submitting ? "Wird gesendet…" : "Zur Prüfung einreichen"}</button>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
