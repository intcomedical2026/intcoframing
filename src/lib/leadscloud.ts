export const LEADSCLOUD_ENTERPRISE_ID = "200365";
export const LEADSCLOUD_PARENT_TEMPLATE_ID = "02376509567647f8b38260d65d403b72";

export const LEADSCLOUD_FORM_IDS = {
  main: "6189597577e948eca67e7bd73f903247",
  footerNewsletter: "5d1c229ef1f642eda662373b8f5dab11",
  catalogDownload: "07843196750e465ab3297ef006ca12e2",
  enquiryCart: "500882e169604e22811adcefebc5aac2",
} as const;

export const LEADSCLOUD_FORM_ID_LIST = [
  LEADSCLOUD_FORM_IDS.main,
  LEADSCLOUD_FORM_IDS.footerNewsletter,
  LEADSCLOUD_FORM_IDS.catalogDownload,
  LEADSCLOUD_FORM_IDS.enquiryCart,
] as const;

export function leadsCloudBuryClass(formId: string) {
  return `BURY_CODE_${formId}`;
}
