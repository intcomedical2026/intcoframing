"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const cumulativeSavings = [
  {
    value: "2.5",
    unit: "Million",
    label: "Tons Carbon Emissions",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability9.png",
  },
  {
    value: "3.75",
    unit: "Million",
    label: "Tons Crude Oil Resources",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability10.png",
  },
  {
    value: "25",
    unit: "Million",
    label: "Trees Were Protected",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability11.png",
  },
];

const annualSavings = [
  {
    value: "+150,000 Tons",
    suffix: "/Year",
    label: "r-PS, r-PET",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/save-icon-1.png",
  },
  {
    value: "-300,000 Tons",
    suffix: "/Year",
    label: "CO₂",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/save-icon-2.png",
  },
  {
    value: "-450,000 Tons",
    suffix: "/Year",
    label: "Oil",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/save-icon-3.png",
  },
  {
    value: "+1.2 Million Boxes",
    suffix: "/Year",
    label: "PS Mouldings",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/save-icon-4.png",
  },
  {
    value: "+2 Million",
    suffix: "/Year",
    label: "Trees Were Protected",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/save-icon-5.png",
  },
];

const savingsCopy: Record<Locale, {
  cumulativeTab: string;
  annualTab: string;
  cumulative: Array<Pick<(typeof cumulativeSavings)[number], "unit" | "label">>;
  annual: Array<Pick<(typeof annualSavings)[number], "value" | "suffix" | "label">>;
}> = {
  en: {
    cumulativeTab: "Cumulative Savings",
    annualTab: "Annual Savings",
    cumulative: cumulativeSavings.map(({ unit, label }) => ({ unit, label })),
    annual: annualSavings.map(({ value, suffix, label }) => ({ value, suffix, label })),
  },
  es: {
    cumulativeTab: "Ahorro acumulado",
    annualTab: "Ahorro anual",
    cumulative: [
      { unit: "millones", label: "toneladas de emisiones de carbono" },
      { unit: "millones", label: "toneladas de petróleo crudo" },
      { unit: "millones", label: "árboles protegidos" },
    ],
    annual: [
      { value: "+150,000 toneladas", suffix: "/año", label: "r-PS, r-PET" },
      { value: "-300,000 toneladas", suffix: "/año", label: "CO₂" },
      { value: "-450,000 toneladas", suffix: "/año", label: "Petróleo" },
      { value: "+1.2 millones de cajas", suffix: "/año", label: "Molduras de PS" },
      { value: "+2 millones", suffix: "/año", label: "Árboles protegidos" },
    ],
  },
  pt: {
    cumulativeTab: "Economia acumulada",
    annualTab: "Economia anual",
    cumulative: [
      { unit: "milhões", label: "toneladas de emissões de carbono" },
      { unit: "milhões", label: "toneladas de petróleo bruto" },
      { unit: "milhões", label: "árvores protegidas" },
    ],
    annual: [
      { value: "+150.000 toneladas", suffix: "/ano", label: "r-PS, r-PET" },
      { value: "-300.000 toneladas", suffix: "/ano", label: "CO₂" },
      { value: "-450.000 toneladas", suffix: "/ano", label: "Petróleo" },
      { value: "+1,2 milhão de caixas", suffix: "/ano", label: "Molduras de PS" },
      { value: "+2 milhões", suffix: "/ano", label: "Árvores protegidas" },
    ],
  },
  fr: {
    cumulativeTab: "Économies cumulées",
    annualTab: "Économies annuelles",
    cumulative: [
      { unit: "millions", label: "tonnes d'émissions carbone" },
      { unit: "millions", label: "tonnes de pétrole brut" },
      { unit: "millions", label: "arbres protégés" },
    ],
    annual: [
      { value: "+150 000 tonnes", suffix: "/an", label: "r-PS, r-PET" },
      { value: "-300 000 tonnes", suffix: "/an", label: "CO₂" },
      { value: "-450 000 tonnes", suffix: "/an", label: "Pétrole" },
      { value: "+1,2 million de cartons", suffix: "/an", label: "Moulures PS" },
      { value: "+2 millions", suffix: "/an", label: "Arbres protégés" },
    ],
  },
  de: {
    cumulativeTab: "Kumulierte Einsparungen",
    annualTab: "Jährliche Einsparungen",
    cumulative: [
      { unit: "Mio.", label: "Tonnen CO₂-Emissionen" },
      { unit: "Mio.", label: "Tonnen Rohöl" },
      { unit: "Mio.", label: "geschützte Bäume" },
    ],
    annual: [
      { value: "+150.000 Tonnen", suffix: "/Jahr", label: "r-PS, r-PET" },
      { value: "-300.000 Tonnen", suffix: "/Jahr", label: "CO₂" },
      { value: "-450.000 Tonnen", suffix: "/Jahr", label: "Öl" },
      { value: "+1,2 Mio. Kartons", suffix: "/Jahr", label: "PS-Leisten" },
      { value: "+2 Mio.", suffix: "/Jahr", label: "Geschützte Bäume" },
    ],
  },
  ja: {
    cumulativeTab: "累計削減量",
    annualTab: "年間削減量",
    cumulative: [
      { unit: "百万", label: "トンの炭素排出量" },
      { unit: "百万", label: "トンの原油資源" },
      { unit: "百万", label: "本の保護された木" },
    ],
    annual: [
      { value: "+150,000トン", suffix: "/年", label: "r-PS、r-PET" },
      { value: "-300,000トン", suffix: "/年", label: "CO₂" },
      { value: "-450,000トン", suffix: "/年", label: "石油" },
      { value: "+120万箱", suffix: "/年", label: "PSモールディング" },
      { value: "+200万", suffix: "/年", label: "保護された木" },
    ],
  },
};

export function SustainabilityVideoButton({
  src,
  label,
  title,
  closeLabel,
}: {
  src: string;
  label: string;
  title: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-[66px] w-[218px] items-center justify-center rounded-[33px] border-2 border-white text-lg font-semibold text-white transition duration-700 hover:scale-110"
      >
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5" role="dialog" aria-modal="true" aria-label={title}>
          <div className="relative w-full max-w-5xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-3 -top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white text-[#484653] shadow-lg"
              aria-label={closeLabel}
            >
              <X size={22} />
            </button>
            <iframe
              className="aspect-video w-full"
              src={src}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SustainabilitySavingsTabs({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<"cumulative" | "annual">("cumulative");
  const copy = savingsCopy[locale];
  const localizedCumulativeSavings = cumulativeSavings.map((item, index) => ({ ...item, ...copy.cumulative[index] }));
  const localizedAnnualSavings = annualSavings.map((item, index) => ({ ...item, ...copy.annual[index] }));

  return (
    <div className="relative h-[720px] overflow-hidden min-[1600px]:h-[810px] max-lg:h-auto">
      <Image src="https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Sustainability8.png" alt="" fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 max-lg:relative max-lg:bg-[rgba(0,0,0,0.25)] max-lg:px-5 max-lg:py-10">
        <div className="mx-auto mt-[100px] flex max-w-[943px] justify-center gap-[63px] max-lg:mt-0 max-lg:flex-col max-lg:gap-4">
          <button
            type="button"
            onClick={() => setActive("cumulative")}
            className={`h-[70px] w-full max-w-[440px] rounded-[35px] text-[34px] font-semibold leading-[70px] transition duration-500 max-lg:max-w-none max-lg:text-2xl ${
              active === "cumulative" ? "bg-white text-[#484653]" : "bg-black/30 text-white"
            }`}
          >
            {copy.cumulativeTab}
          </button>
          <button
            type="button"
            onClick={() => setActive("annual")}
            className={`h-[70px] w-full max-w-[440px] rounded-[35px] text-[34px] font-semibold leading-[70px] transition duration-500 max-lg:max-w-none max-lg:text-2xl ${
              active === "annual" ? "bg-white text-[#484653]" : "bg-black/30 text-white"
            }`}
          >
            {copy.annualTab}
          </button>
        </div>

        {active === "cumulative" ? (
          <ul className="mx-auto mt-[77px] flex max-w-[1394px] justify-center gap-[106px] max-lg:mt-8 max-lg:flex-col max-lg:gap-4">
            {localizedCumulativeSavings.map((item) => (
              <li key={item.label} className="flex min-h-[464px] max-w-[396px] flex-1 flex-col items-center bg-black/30 px-[57px] pb-[51px] pt-[129px] text-center text-white max-lg:max-w-none max-lg:px-8 max-lg:py-12">
                <div className="flex items-baseline font-bold leading-[0.8]">
                  <span className="text-[80px] font-black">{item.value}</span>
                  <span className="ml-[9px] text-[30px] font-semibold">{item.unit}</span>
                </div>
                <div className="mb-[67px] mt-[38px] whitespace-nowrap text-2xl font-medium leading-none max-lg:whitespace-normal">{item.label}</div>
                <div className="relative h-[112px] w-[150px]">
                  <Image src={item.imageUrl} alt={item.label} fill className="object-contain" sizes="150px" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-[77px] max-w-[1394px] bg-black/30 max-lg:mt-8">
            <ul className="grid grid-cols-5 max-lg:grid-cols-1">
              {localizedAnnualSavings.map((item) => (
                <li key={item.label} className="px-[5px] py-20 text-center text-white max-lg:py-10">
                  <div className="relative mx-auto h-[152px] w-[152px] max-lg:h-28 max-lg:w-28">
                    <Image src={item.imageUrl} alt={item.label} fill className="object-contain" sizes="152px" />
                  </div>
                  <div className="py-5 text-[26px] font-bold leading-tight">
                    {item.value}
                    <span className="ml-1 text-[22px] font-normal">{item.suffix}</span>
                  </div>
                  <div className="text-[22px] text-white">{item.label}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
