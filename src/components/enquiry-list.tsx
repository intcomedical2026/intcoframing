"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { HubSpotEnquiryCartForm } from "@/components/hubspot-forms";

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

export function EnquiryList({ locale }: { locale: Locale }) {
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
                <HubSpotEnquiryCartForm
                  locale={locale}
                  items={items}
                  onSuccess={() => {
                    clearOriginalProductList();
                    setItems([]);
                    showNotice("Successfully Submitted");
                  }}
                />
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

function clearOriginalProductList() {
  localStorage.removeItem("productList");
  localStorage.removeItem("intco-enquiry-cart");
  document.cookie = "withProduct=; path=/; max-age=0";
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
