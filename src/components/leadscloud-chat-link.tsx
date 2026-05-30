"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type LeadsCloudChatApi = ((...args: unknown[]) => void) & {
  a?: unknown[] | { openChat?: () => void };
};

declare global {
  interface Window {
    _XHL?: LeadsCloudChatApi;
    __intcoLoadLeadsCloudChat?: () => void;
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
        const chatApi = window._XHL?.a as { openChat?: () => void } | undefined;
        const openChat = chatApi?.openChat;
        if (openChat) {
          event.preventDefault();
          openChat();
          return;
        }
        window.__intcoLoadLeadsCloudChat?.();
      }}
    >
      {children}
    </a>
  );
}
