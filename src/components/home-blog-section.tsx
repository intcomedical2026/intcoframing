"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { blogCategoryLabel, localizePath, t } from "@/lib/i18n";

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
  const title = t(locale, "blog").toUpperCase();

  return (
    <section className="BLOG intco-home-blog-source">
      <div className="intco-source-container">
        <div className="ipd-20 intco-home-blog-inner">
          <ul className="flex-betwen intco-home-blog-head">
            <li className="selefTitle leftTitle intco-home-blog-title" data-tit={title}>
              <div className="title_text">{title}</div>
            </li>
            <li className="DESC intco-home-blog-desc">
              {intro || "When it comes to home decor, we're the experts. As an interior decoration solutions provider, we design and implement our solutions to help you achieve the scene you expected."}
            </li>
          </ul>
          <ul className="flex-betwen topBtnUl intco-home-blog-tabs">
            {categories.map((category) => (
              <li key={category} className={`topBtnLi ${category === active ? "selectcurLi" : ""}`}>
                <button type="button" aria-pressed={category === active} onClick={() => setActive(category)}>
                  {blogCategoryLabel(locale, category)}
                </button>
              </li>
            ))}
          </ul>
          <div className="absolureContent intco-home-blog-content">
            <ul className="intco-home-blog-list">
              {visiblePosts.map((post) => (
                <li key={`${active}-${post.title}-${post.date}`}>
                  <HomeBlogTile post={post} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeBlogTile({ post, locale }: { post: HomeBlogPost; locale: Locale }) {
  return (
    <div className="fbhs-warp">
      <div className="relativeBox2-content">
        <div className="pic-box">
          <Link href={localizePath(locale, post.path)} aria-label={post.title}>
            <img src={post.imageUrl} alt={post.title} loading="eager" decoding="async" />
          </Link>
        </div>
        <div className="liBox">
          <Link href={localizePath(locale, post.path)} className="liTitle --f28">
            {post.title}
          </Link>
          {post.date ? <div className="titleBottom --16">{post.date}</div> : null}
          <div className="desc --f18">{post.description}</div>
          <div className="flexContentItem">
            <Link href={localizePath(locale, post.path)} className="selectBtn">
              {t(locale, "readMore")}
              <ArrowRight className="ml-[9px]" size={20} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
