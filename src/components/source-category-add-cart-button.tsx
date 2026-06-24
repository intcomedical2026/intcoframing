"use client";

type SourceCategoryAddCartButtonProps = {
  productId: string;
  productLink: string;
  productName: string;
  productImg: string;
  productColor?: string;
};

type SourceCartItem = {
  productId: string;
  productLink: string;
  productName: string;
  productImg: string;
  productQuantity: number;
  productColor: string;
  productItem: string;
  productSize: string;
  newcolor: string;
  newsize: string;
};

const SOURCE_CART_STORAGE_KEY = "productList";

function readSourceCart() {
  try {
    const raw = window.localStorage.getItem(SOURCE_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SourceCartItem[]) : [];
  } catch {
    return [];
  }
}

export function SourceCategoryAddCartButton({ productId, productLink, productName, productImg, productColor = "" }: SourceCategoryAddCartButtonProps) {
  return (
    <a
      href="#!"
      className="che addcart"
      data-id={productId}
      aria-label={`Add ${productName} to enquiry list`}
      onClick={(event) => {
        event.preventDefault();
        const cart = readSourceCart();
        if (cart.some((item) => item.productId === productId)) {
          window.alert("The product already exists.");
          return;
        }
        const nextItem: SourceCartItem = {
          productId,
          productLink: new URL(productLink, window.location.origin).toString(),
          productName,
          productImg,
          productQuantity: 1,
          productColor,
          productItem: "",
          productSize: "",
          newcolor: productColor,
          newsize: "",
        };
        window.localStorage.setItem(SOURCE_CART_STORAGE_KEY, JSON.stringify([...cart, nextItem]));
        document.cookie = "withProduct=true; path=/";
      }}
    >
      <div />
    </a>
  );
}
