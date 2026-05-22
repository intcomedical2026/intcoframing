"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

export type HomeBlogPost = {
  title: string;
  path: string;
  imageUrl: string;
  date: string;
  description: string;
  category: string;
};

export function HomeBlogSection({
  categories,
  intro,
  locale,
  posts,
}: {
  categories: string[];
  intro?: string;
  locale: Locale;
  posts: HomeBlogPost[];
}) {
  const [active, setActive] = useState(categories[0] || "All");
  const visiblePosts = useMemo(() => {
    const scoped = active === "All" ? posts : posts.filter((post) => post.category === active);
    return scoped.slice(0, 3);
  }, [active, posts]);

  return (
    <section className="overflow-hidden bg-white px-4 py-16 sm:px-6 lg:py-[99px]">
      <div className="intco-source-container px-5">
        <div className="flex flex-wrap justify-between gap-8">
          <BlogSourceTitle />
          <p className="max-w-[819px] text-pretty text-lg leading-8 text-[#363636]">{intro}</p>
        </div>
        <div className="my-12 flex flex-wrap items-center justify-between gap-3 lg:my-[70px]">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={category === active}
              onClick={() => setActive(category)}
              className="h-10 w-full rounded-md border border-white bg-white text-lg font-semibold text-[#484653] transition duration-500 hover:border-[#484653] hover:bg-[#484653] hover:text-white aria-pressed:border-[#484653] aria-pressed:bg-[#484653] aria-pressed:text-white sm:w-[183px]"
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <HomeBlogTile key={`${active}-${post.title}-${post.date}`} post={post} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSourceTitle() {
  return (
    <div className="relative text-left uppercase">
      <div className="pointer-events-none absolute left-0 top-0 -translate-x-5 whitespace-nowrap text-[70px] font-semibold leading-none text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px]">
        BLOG
      </div>
      <h2 className="relative z-10 inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl">
        BLOG
        <span className="absolute bottom-0 left-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653]" />
      </h2>
    </div>
  );
}

function HomeBlogTile({ post, locale }: { post: HomeBlogPost; locale: Locale }) {
  return (
    <Link href={localizePath(locale, post.path)} className="group block overflow-hidden bg-white shadow-[0_11px_12px_1px_rgba(101,101,101,0.08)]">
      <div className="relative aspect-[1.56] overflow-hidden bg-neutral-100">
        <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1280px) 33vw, 100vw" />
      </div>
      <div className="border border-t-0 border-[#f3f3f3] px-[37px] pb-[59px] pt-[52px]">
        <h3 className="truncate text-lg font-semibold leading-5 text-[#484653]">{post.title}</h3>
        <p className="text-base font-light leading-[39px] text-[#999]">{post.date}</p>
        {post.description ? <p className="line-clamp-2 min-h-12 text-lg leading-6 text-[#363636]">{post.description}</p> : <p className="min-h-12" />}
        <span className="mt-[39px] inline-flex h-[58px] w-[200px] items-center justify-center rounded-full border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-200 group-hover:bg-[#484653] group-hover:text-white">
          Read More <ArrowRight className="ml-[9px]" size={20} />
        </span>
      </div>
    </Link>
  );
}
