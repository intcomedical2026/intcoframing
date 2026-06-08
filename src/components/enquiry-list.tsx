"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LEADSCLOUD_FORM_IDS, leadsCloudBuryClass } from "@/lib/leadscloud";

type CartItem = {
  slug: string;
  title: string;
  path: string;
  imageUrl?: string;
  quantity: number;
};

type LeadsCloudProductItem = {
  productId: string;
  productLink: string;
  productName: string;
  productImg: string;
  productQuantity: number;
  productColor: string | null;
  productItem: string;
  productSize: string | null;
  newcolor: Array<{ color: string; item: string }>;
  newsize: string[];
};

export function EnquiryList({ locale: _locale }: { locale: Locale }) {
  void _locale;
  const [items, setItems] = useState<LeadsCloudProductItem[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(readOriginalProductList());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function removeItem(productId: string) {
    const nextItems = items.filter((item) => item.productId !== productId);
    writeOriginalProductList(nextItems);
    setItems(nextItems);
    showNotice("successfully deleted");
  }

  function updateItem(index: number, patch: Partial<LeadsCloudProductItem>) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  }

  function updateCart() {
    const normalized = items.map((item) => ({
      ...item,
      productQuantity: Math.max(1, Number(item.productQuantity) || 1),
      productItem: item.productItem || item.newcolor[0]?.item || item.productName,
    }));
    writeOriginalProductList(normalized);
    setItems(normalized);
    showNotice("Successfully Updated");
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <section className="Bestsellers-index belog1-index belogDetail-index intco-enquiry-source">
      <div className="intco-source-container">
        <div className="intco-source-pad">
          <div className="flex-betwen gap50">
            <div className="wow fadeInUp leftBox rightBox">
              <div className="buy-btn-box">
                <div className="right-box-title">Enquiry List</div>
                <a
                  href="#!"
                  className="buy-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    updateCart();
                  }}
                >
                  Update Cart
                </a>
              </div>
              <ul className="q-list top_cars_list">
                {items.map((item, index) => (
                  <li key={item.productId || `${item.productName}-${index}`}>
                    <div className="belog1-index-item">
                      <div className="leftImg-item">
                        <div className="img-box">
                          <a href={item.productLink}>
                            {item.productImg ? <img src={item.productImg} alt={item.productName} /> : null}
                          </a>
                        </div>
                      </div>
                      <div className="index-item-right">
                        <div className="item-title">
                          Item#: <span className="pointLittle" />
                          <span className="item-name">{item.productItem}</span>
                        </div>
                        <div className="quoteLine">
                          <div>Color:</div>
                          <div className="quoteLineList colorList">
                            {item.newcolor.map((choice, choiceIndex) => (
                              <button
                                key={`${choice.color || "color"}-${choiceIndex}`}
                                type="button"
                                className={`materialItem colorItem choose ${choice.color === item.productColor ? "active" : ""}`}
                                style={choice.color ? { background: choice.color } : undefined}
                                data-item={choice.item}
                                data-color={choice.color}
                                onClick={() =>
                                  updateItem(index, {
                                    productColor: choice.color,
                                    productItem: choice.item,
                                  })
                                }
                                aria-label={`Color ${choiceIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="quoteLine">
                          <div>Size:</div>
                          <div className="quoteLineList quotesizeLineList">
                            {item.newsize.map((size, sizeIndex) => (
                              <button
                                key={`${size}-${sizeIndex}`}
                                type="button"
                                className={`materialItem sizeItem ${formatSize(size) === formatSize(item.productSize || "") ? "active" : ""}`}
                                data-value={size}
                                onClick={() => updateItem(index, { productSize: size })}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="quoteLine">
                          <div>Quantity:</div>
                          <div className="quantity-input">
                            <button
                              type="button"
                              className="minus-btn"
                              onClick={() => updateItem(index, { productQuantity: Math.max(1, Number(item.productQuantity) - 1) })}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="quantity-input-field"
                              value={item.productQuantity}
                              min={1}
                              onChange={(event) => updateItem(index, { productQuantity: Math.max(1, Number(event.target.value) || 1) })}
                            />
                            <button type="button" className="plus-btn" onClick={() => updateItem(index, { productQuantity: Number(item.productQuantity) + 1 })}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="item-desc">{item.productName}</div>
                      </div>
                    </div>
                    <button type="button" data-id={item.productId} className="remove-list" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.productName}`} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="wow fadeInDown rightBox">
              <div className="from-box wow fadeInDown">
                <div className={leadsCloudBuryClass("5d7b74d8ea0b4f4fb26aa05682c8ae4e")}>
                  <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.enquiryCart)} />
                </div>
                <EnquiryListFormFallback />
              </div>
            </div>
          </div>
        </div>
        {notice ? (
          <div className="intco-enquiry-toast" role="status" aria-live="polite">
            {notice}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EnquiryListFormFallback() {
  const fields = [
    { id: "xhl00", label: "姓名", placeholder: "Name ", required: true, className: "xhl-input-xlarge xhl-valtype a1009 choose" },
    { id: "xhl01", label: "邮箱", placeholder: "Email ", required: true, className: "xhl-input-xlarge xhl-valtype a10010 choose" },
    { id: "xhl02", label: "国家地区", placeholder: "Country ", required: true, className: "xhl-input-xlarge xhl-valtype a1003 choose" },
    { id: "xhl03", label: "电话", placeholder: "Phone", required: false, className: "xhl-input-xlarge xhl-valtype a10012" },
    { id: "xhl04", label: "WhatsApp", placeholder: "WhatsApp ", required: false, className: "xhl-input-xlarge xhl-valtype a10052" },
    { id: "xhl05", label: "公司名称", placeholder: "Company Name ", required: false, className: "xhl-input-xlarge xhl-valtype a1001" },
  ];

  return (
    <form className="intco-enquiry-form-fallback" aria-label="Enquiry form">
      <fieldset>
        {fields.map((field) => (
          <div key={field.id} className="usedComp xhl-control-group xhl-form-input component">
            <label className="xhl-control-label inpt" id={field.id}>
              {field.label}
            </label>
            <div className="xhl-controls">
              <input className={field.className} placeholder={field.placeholder} aria-labelledby={field.id} />
              {field.required ? <span className="xhl-form-tip">*</span> : null}
            </div>
          </div>
        ))}
      </fieldset>
      <div className="xhl-footer">
        <button type="button" className="xhl-submit ga_submit_bury_form intco-enquiry-fallback-submit">
          提交
        </button>
      </div>
    </form>
  );
}

function readOriginalProductList() {
  const sourceItems = parseJsonArray<LeadsCloudProductItem>(localStorage.getItem("productList"));
  if (sourceItems.length) return sourceItems.map(normalizeOriginalItem);

  return parseJsonArray<CartItem>(localStorage.getItem("intco-enquiry-cart")).map((item) =>
    normalizeOriginalItem({
      productId: item.slug,
      productLink: item.path,
      productName: item.title,
      productImg: item.imageUrl || "",
      productQuantity: item.quantity,
      productColor: null,
      productItem: item.title,
      productSize: null,
      newcolor: [],
      newsize: [],
    }),
  );
}

function writeOriginalProductList(items: LeadsCloudProductItem[]) {
  localStorage.setItem("productList", JSON.stringify(items));
  document.cookie = "withProduct=true; path=/; max-age=2592000";
}

function normalizeOriginalItem(item: LeadsCloudProductItem): LeadsCloudProductItem {
  const newcolor = Array.isArray(item.newcolor) ? item.newcolor : [];
  const newsize = Array.isArray(item.newsize) ? item.newsize : [];
  const firstColor = newcolor[0];
  const firstSize = newsize[0] || null;

  return {
    productId: String(item.productId || item.productName || ""),
    productLink: item.productLink || "#",
    productName: item.productName || "",
    productImg: item.productImg || "",
    productQuantity: Math.max(1, Number(item.productQuantity) || 1),
    productColor: item.productColor || firstColor?.color || null,
    productItem: item.productItem || firstColor?.item || item.productName || "",
    productSize: item.productSize ?? firstSize,
    newcolor,
    newsize,
  };
}

function parseJsonArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatSize(size: string) {
  return size.trim().replace(/"/g, "'").replace(/\\/g, "");
}
