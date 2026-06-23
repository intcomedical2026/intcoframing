export const HUBSPOT_PORTAL_ID = "242615166";
export const HUBSPOT_REGION = "na2";

export const HUBSPOT_FORM_IDS = {
  mainInquiry: "7cdd8f61-b3ef-40f3-93a9-a4fae80f666c",
  productEnquiryCart: "fbce0cf4-88bd-4c8a-bfa7-1d9af2ebb5bd",
  catalogDownload: "d5c533f1-ab45-4bcb-b797-1450518b48ee",
  newsletter: "78b45b76-8362-4532-804c-c2d1411faeda",
} as const;

export type HubSpotFormType = keyof typeof HUBSPOT_FORM_IDS;

export const HUBSPOT_LEAD_TYPES: Record<HubSpotFormType, string> = {
  mainInquiry: "main_inquiry",
  productEnquiryCart: "product_enquiry_cart",
  catalogDownload: "catalog_download",
  newsletter: "newsletter",
};

export const HUBSPOT_FIELD_NAMES = {
  name: "firstname",
  email: "email",
  country: "country",
  phone: "phone",
  whatsapp: "intco_whatsapp",
  companyName: "company",
  message: "intco_message",
  productList: "intco_product_list",
  leadType: "intco_lead_type",
  sourcePage: "intco_source_page",
  catalogName: "intco_catalog_name",
  catalogUrl: "intco_catalog_url",
} as const;

export function isHubSpotFormType(value: unknown): value is HubSpotFormType {
  return typeof value === "string" && value in HUBSPOT_FORM_IDS;
}
