"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { HubSpotFormType } from "@/lib/hubspot";
import { COUNTRY_OPTIONS } from "@/lib/country-options";

type FieldKey = "name" | "email" | "country" | "phone" | "whatsapp" | "companyName" | "message";

type HubSpotFormCopy = {
  labels: Record<FieldKey, string>;
  placeholders: Record<FieldKey, string>;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  privacy: string;
};

type HubSpotFormValues = Partial<Record<FieldKey | "productList" | "catalogName" | "catalogUrl" | "sourcePage", string>>;

export type HubSpotEnquiryCartItem = {
  productName: string;
  productItem?: string;
  productColor?: string | null;
  productSize?: string | null;
  productQuantity?: number;
  productLink?: string;
};

const FIELD_CLASSES: Record<FieldKey, string> = {
  name: "a1009",
  companyName: "a1001",
  country: "a1003",
  email: "a10010",
  phone: "a10012",
  whatsapp: "a10052",
  message: "xhl-textarea",
};

const REQUIRED_INQUIRY_FIELDS = new Set<FieldKey>(["name", "email", "country"]);

const FORM_COPY: Record<Locale, HubSpotFormCopy> = {
  en: {
    labels: {
      name: "Name",
      companyName: "Company Name",
      country: "Country",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    placeholders: {
      name: "Name",
      companyName: "Company Name",
      country: "Country",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    submit: "Submit",
    submitting: "Submitting...",
    success: "Your message has been submitted successfully.",
    error: "Submission failed. Please try again.",
    privacy: "By submitting this form, you agree that INTCO Framing may contact you about your inquiry. Please refer to our Privacy Policy for more information.",
  },
  es: {
    labels: {
      name: "Nombre",
      companyName: "Nombre de la empresa",
      country: "País o región",
      email: "Correo electrónico",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      message: "Mensaje",
    },
    placeholders: {
      name: "Nombre",
      companyName: "Nombre de la empresa",
      country: "País o región",
      email: "Correo electrónico",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      message: "Mensaje",
    },
    submit: "Enviar",
    submitting: "Enviando...",
    success: "Su mensaje se ha enviado correctamente.",
    error: "No se pudo enviar. Inténtelo de nuevo.",
    privacy: "Al enviar este formulario, acepta que INTCO Framing pueda contactarle sobre su consulta. Consulte nuestra Política de privacidad para obtener más información.",
  },
  pt: {
    labels: {
      name: "Nome",
      companyName: "Nome da empresa",
      country: "País ou região",
      email: "E-mail",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      message: "Mensagem",
    },
    placeholders: {
      name: "Nome",
      companyName: "Nome da empresa",
      country: "País ou região",
      email: "E-mail",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      message: "Mensagem",
    },
    submit: "Enviar",
    submitting: "Enviando...",
    success: "Sua mensagem foi enviada com sucesso.",
    error: "Falha no envio. Tente novamente.",
    privacy: "Ao enviar este formulário, você concorda que a INTCO Framing possa entrar em contato sobre sua solicitação. Consulte nossa Política de Privacidade para mais informações.",
  },
  fr: {
    labels: {
      name: "Nom",
      companyName: "Nom de l'entreprise",
      country: "Pays ou région",
      email: "E-mail",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    placeholders: {
      name: "Nom",
      companyName: "Nom de l'entreprise",
      country: "Pays ou région",
      email: "E-mail",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    submit: "Envoyer",
    submitting: "Envoi...",
    success: "Votre message a bien été envoyé.",
    error: "L'envoi a échoué. Veuillez réessayer.",
    privacy: "En envoyant ce formulaire, vous acceptez qu'INTCO Framing vous contacte au sujet de votre demande. Consultez notre Politique de confidentialité pour plus d'informations.",
  },
  de: {
    labels: {
      name: "Name",
      companyName: "Firmenname",
      country: "Land oder Region",
      email: "E-Mail",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      message: "Nachricht",
    },
    placeholders: {
      name: "Name",
      companyName: "Firmenname",
      country: "Land oder Region",
      email: "E-Mail",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      message: "Nachricht",
    },
    submit: "Senden",
    submitting: "Wird gesendet...",
    success: "Ihre Nachricht wurde erfolgreich gesendet.",
    error: "Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    privacy: "Mit dem Absenden dieses Formulars erklären Sie sich damit einverstanden, dass INTCO Framing Sie zu Ihrer Anfrage kontaktieren darf. Weitere Informationen finden Sie in unserer Datenschutzerklärung.",
  },
  ja: {
    labels: {
      name: "氏名",
      companyName: "会社名",
      country: "国・地域",
      email: "メール",
      phone: "電話",
      whatsapp: "WhatsApp",
      message: "メッセージ",
    },
    placeholders: {
      name: "氏名",
      companyName: "会社名",
      country: "国・地域",
      email: "メール",
      phone: "電話",
      whatsapp: "WhatsApp",
      message: "メッセージ",
    },
    submit: "送信",
    submitting: "送信中...",
    success: "メッセージが正常に送信されました。",
    error: "送信に失敗しました。もう一度お試しください。",
    privacy: "このフォームを送信することで、INTCO Framing がお問い合わせについて連絡することに同意したものとみなされます。詳しくはプライバシーポリシーをご覧ください。",
  },
};

export function HubSpotMainInquiryForm({ locale }: { locale: Locale }) {
  return (
    <HubSpotLeadForm
      locale={locale}
      formType="mainInquiry"
      fields={["name", "email", "country", "phone", "whatsapp", "companyName", "message"]}
      requiredFields={REQUIRED_INQUIRY_FIELDS}
    />
  );
}

export function HubSpotCatalogDownloadForm({
  locale,
  catalogName,
  catalogUrl,
  downloadOnSuccess = false,
  onSuccess,
}: {
  locale: Locale;
  catalogName?: string;
  catalogUrl: string;
  downloadOnSuccess?: boolean;
  onSuccess?: () => void;
}) {
  return (
    <HubSpotLeadForm
      locale={locale}
      formType="catalogDownload"
      fields={["name", "email", "country", "phone", "whatsapp", "companyName"]}
      requiredFields={REQUIRED_INQUIRY_FIELDS}
      hiddenFields={{ catalogName: catalogName || catalogUrl, catalogUrl }}
      onSuccess={() => {
        if (downloadOnSuccess) downloadFile(catalogUrl);
        onSuccess?.();
      }}
    />
  );
}

export function HubSpotEnquiryCartForm({
  locale,
  items,
  onSuccess,
}: {
  locale: Locale;
  items: HubSpotEnquiryCartItem[];
  onSuccess?: () => void;
}) {
  const productList = useMemo(() => formatProductList(items), [items]);

  return (
    <HubSpotLeadForm
      locale={locale}
      formType="productEnquiryCart"
      fields={["name", "email", "country", "phone", "whatsapp", "companyName", "message"]}
      requiredFields={REQUIRED_INQUIRY_FIELDS}
      hiddenFields={{ productList }}
      onSuccess={onSuccess}
    />
  );
}

export function HubSpotNewsletterForm({ locale }: { locale: Locale }) {
  const copy = FORM_COPY[locale];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailId = useId();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    if (String(formData.get("website") || "").trim()) {
      setStatus("success");
      setMessage(copy.success);
      form.reset();
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      await submitHubSpotForm("newsletter", {
        email: String(formData.get("email") || "").trim(),
      });
      setStatus("success");
      setMessage(copy.success);
      form.reset();
    } catch {
      setStatus("error");
      setMessage(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="intco-footer-newsletter-fallback intco-hubspot-newsletter-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={emailId}>
          {copy.labels.email}
        </label>
        <input id={emailId} name="email" type="email" placeholder={copy.placeholders.email} required />
        <input name="website" type="text" tabIndex={-1} autoComplete="off" className="intco-hubspot-honeypot" aria-hidden="true" />
        <button type="submit" disabled={isSubmitting} aria-label={isSubmitting ? copy.submitting : copy.submit}>
          <Send size={20} aria-hidden="true" />
        </button>
      </form>
      {message ? (
        <p className={`intco-hubspot-newsletter-status intco-hubspot-form-status is-${status}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </>
  );
}

function HubSpotLeadForm({
  locale,
  formType,
  fields,
  requiredFields,
  hiddenFields,
  onSuccess,
}: {
  locale: Locale;
  formType: HubSpotFormType;
  fields: FieldKey[];
  requiredFields: Set<FieldKey>;
  hiddenFields?: HubSpotFormValues;
  onSuccess?: () => void;
}) {
  const copy = FORM_COPY[locale];
  const formId = useId();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    if (String(formData.get("website") || "").trim()) {
      setStatus("success");
      setMessage(copy.success);
      form.reset();
      return;
    }

    const values: HubSpotFormValues = { ...hiddenFields };
    fields.forEach((field) => {
      values[field] = String(formData.get(field) || "").trim();
    });

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      await submitHubSpotForm(formType, values);
      setStatus("success");
      setMessage(copy.success);
      form.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage(copy.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="xhl_form intco-hubspot-form" onSubmit={onSubmit}>
      <fieldset>
        {fields.map((field) => (
          <HubSpotField key={field} formId={formId} field={field} copy={copy} required={requiredFields.has(field)} />
        ))}
        <input name="website" type="text" tabIndex={-1} autoComplete="off" className="intco-hubspot-honeypot" aria-hidden="true" />
        <p className="intco-hubspot-privacy">{copy.privacy}</p>
        {message ? (
          <p className={`intco-hubspot-form-status is-${status}`} role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
        <div className="xhl-footer">
          <button type="submit" className="xhl-submit ga_submit_bury_form" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submit}
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function HubSpotField({
  formId,
  field,
  copy,
  required,
}: {
  formId: string;
  field: FieldKey;
  copy: HubSpotFormCopy;
  required: boolean;
}) {
  const id = `${formId}-${field}`;
  const wrapperClass = `usedComp xhl-control-group component ${field === "message" ? "xhl-form-text" : "xhl-form-input"}`;
  const inputClass = field === "message" ? `xhl-textarea xhl-valtype ${FIELD_CLASSES[field]}` : `xhl-input-xlarge xhl-valtype ${FIELD_CLASSES[field]}`;

  return (
    <div className={wrapperClass}>
      <label className="xhl-control-label inpt" htmlFor={id}>
        {copy.labels[field]}
      </label>
      <div className="xhl-controls">
        {field === "message" ? (
          <textarea id={id} name={field} className={inputClass} placeholder={copy.placeholders[field]} required={required} />
        ) : field === "country" ? (
          <select id={id} name={field} className={inputClass} required={required} defaultValue="">
            <option value="" disabled>
              {copy.placeholders.country}
            </option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={`${country.code}-${country.name}`} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        ) : (
          <input id={id} name={field} className={inputClass} placeholder={copy.placeholders[field]} type={field === "email" ? "email" : field === "phone" || field === "whatsapp" ? "tel" : "text"} required={required} />
        )}
        {required ? <span className="xhl-form-tip">*</span> : null}
      </div>
    </div>
  );
}

async function submitHubSpotForm(formType: HubSpotFormType, fields: HubSpotFormValues) {
  const response = await fetch("/api/hubspot/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formType,
      fields,
      context: {
        pageUri: window.location.href,
        pageName: document.title,
        hutk: readCookie("hubspotutk"),
      },
    }),
  });

  if (!response.ok) {
    throw new Error("HubSpot submission failed.");
  }
}

function readCookie(name: string) {
  const encodedName = `${encodeURIComponent(name)}=`;
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(encodedName))
    ?.slice(encodedName.length) || "";
}

function formatProductList(items: HubSpotEnquiryCartItem[]) {
  if (!items.length) return "";

  return items
    .map((item, index) =>
      [
        `#${index + 1}`,
        `Product: ${item.productName}`,
        item.productItem ? `Item#: ${item.productItem}` : "",
        item.productColor ? `Color: ${item.productColor}` : "",
        item.productSize ? `Size: ${item.productSize}` : "",
        `Quantity: ${Math.max(1, Number(item.productQuantity) || 1)}`,
        item.productLink ? `Link: ${item.productLink}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}

function downloadFile(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.download = "";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
