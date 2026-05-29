"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

declare global {
  interface Window {
    _XHL?: {
      a?: {
        openChat?: () => void;
      };
    };
  }
}

type LeadsCloudChatLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  fallbackHref?: string;
};

export function LeadsCloudChatLink({
  children,
  fallbackHref = "#chat",
  ...props
}: LeadsCloudChatLinkProps) {
  return (
    <a
      {...props}
      href={fallbackHref}
      onClick={(event) => {
        const openChat = window._XHL?.a?.openChat;
        if (openChat) {
          event.preventDefault();
          openChat();
        }
      }}
    >
      {children}
    </a>
  );
}
