import type { NextRequest } from "next/server";
import {
  HUBSPOT_FIELD_NAMES,
  HUBSPOT_FORM_IDS,
  HUBSPOT_LEAD_TYPES,
  HUBSPOT_PORTAL_ID,
  isHubSpotFormType,
  type HubSpotFormType,
} from "@/lib/hubspot";
import { COUNTRY_OPTIONS } from "@/lib/country-options";

type HubSpotSubmitPayload = {
  formType?: unknown;
  fields?: unknown;
  context?: unknown;
};

type HubSpotInputFields = {
  name?: string;
  email?: string;
  country?: string;
  phone?: string;
  whatsapp?: string;
  companyName?: string;
  message?: string;
  productList?: string;
  sourcePage?: string;
  catalogName?: string;
  catalogUrl?: string;
};

type HubSpotContext = {
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

const HUBSPOT_SUBMIT_ENDPOINT = "https://api.hsforms.com/submissions/v3/integration/submit";
const MAX_FIELD_LENGTH = 12000;
const VALID_COUNTRY_CODES: ReadonlySet<string> = new Set(COUNTRY_OPTIONS.map((country) => country.code));

const REQUIRED_FIELDS: Record<HubSpotFormType, Array<keyof HubSpotInputFields>> = {
  mainInquiry: ["name", "email", "country"],
  productEnquiryCart: ["name", "email", "country"],
  catalogDownload: ["name", "email", "country"],
  newsletter: ["email"],
};

export async function POST(request: NextRequest) {
  let payload: HubSpotSubmitPayload;

  try {
    payload = (await request.json()) as HubSpotSubmitPayload;
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  if (!isHubSpotFormType(payload.formType)) {
    return Response.json({ ok: false, message: "Unknown HubSpot form type." }, { status: 400 });
  }

  const inputFields = normalizeInputFields(payload.fields);
  const missingField = REQUIRED_FIELDS[payload.formType].find((fieldName) => !inputFields[fieldName]);

  if (missingField) {
    return Response.json({ ok: false, message: `Missing required field: ${missingField}.` }, { status: 400 });
  }

  if (inputFields.country && !VALID_COUNTRY_CODES.has(inputFields.country)) {
    return Response.json({ ok: false, message: "Invalid country code." }, { status: 400 });
  }

  const context = normalizeContext(payload.context, request);
  const hubSpotPayload = {
    submittedAt: Date.now(),
    fields: buildHubSpotFields(payload.formType, inputFields, context),
    context,
  };

  const endpoint = `${HUBSPOT_SUBMIT_ENDPOINT}/${encodeURIComponent(HUBSPOT_PORTAL_ID)}/${encodeURIComponent(
    HUBSPOT_FORM_IDS[payload.formType],
  )}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hubSpotPayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await safeReadText(response);
    return Response.json(
      {
        ok: false,
        message: "HubSpot submission failed.",
        details,
      },
      { status: response.status >= 400 && response.status < 500 ? 400 : 502 },
    );
  }

  return Response.json({ ok: true });
}

function normalizeInputFields(fields: unknown): HubSpotInputFields {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return {};

  return {
    name: readString(fields, "name"),
    email: readString(fields, "email"),
    country: readString(fields, "country"),
    phone: readString(fields, "phone"),
    whatsapp: readString(fields, "whatsapp"),
    companyName: readString(fields, "companyName"),
    message: readString(fields, "message"),
    productList: readString(fields, "productList"),
    sourcePage: readString(fields, "sourcePage"),
    catalogName: readString(fields, "catalogName"),
    catalogUrl: readString(fields, "catalogUrl"),
  };
}

function normalizeContext(context: unknown, request: NextRequest): HubSpotContext {
  const normalizedContext =
    context && typeof context === "object" && !Array.isArray(context)
      ? {
          pageUri: readString(context, "pageUri"),
          pageName: readString(context, "pageName"),
          hutk: readString(context, "hutk"),
        }
      : {};

  const hubSpotCookie = request.cookies.get("hubspotutk")?.value || "";

  return {
    pageUri: normalizedContext.pageUri || request.headers.get("referer") || undefined,
    pageName: normalizedContext.pageName || undefined,
    hutk: normalizedContext.hutk || hubSpotCookie || undefined,
  };
}

function buildHubSpotFields(formType: HubSpotFormType, fields: HubSpotInputFields, context: HubSpotContext) {
  const hubSpotFields: Array<{ name: string; value: string }> = [];

  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.name, fields.name);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.email, fields.email);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.country, fields.country);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.phone, fields.phone);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.whatsapp, fields.whatsapp);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.companyName, fields.companyName);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.message, fields.message);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.productList, fields.productList);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.catalogName, fields.catalogName);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.catalogUrl, fields.catalogUrl);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.leadType, HUBSPOT_LEAD_TYPES[formType]);
  addField(hubSpotFields, HUBSPOT_FIELD_NAMES.sourcePage, fields.sourcePage || context.pageUri);

  return hubSpotFields;
}

function addField(fields: Array<{ name: string; value: string }>, name: string, value?: string) {
  const trimmedValue = truncate(String(value || "").trim());
  if (!trimmedValue) return;
  fields.push({ name, value: trimmedValue });
}

function readString(source: object, key: string) {
  const value = (source as Record<string, unknown>)[key];
  return typeof value === "string" ? truncate(value.trim()) : "";
}

function truncate(value: string) {
  return value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value;
}

async function safeReadText(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
