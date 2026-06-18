import { reviews, type Review } from "@/lib/reviews";
import { Stars } from "./Stars";
import { business } from "@/lib/business";

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="card-eos w-[300px] shrink-0 p-6 sm:w-[360px]">
      <span className="font-display text-4xl leading-none text-gold/60">“</span>
      <blockquote className="mt-1 text-sm leading-relaxed text-cream">
        {r.text}
      </blockquote>
      <figcaption className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-cream-muted">{r.author}</span>
        {r.localGuide && (
          <span className="text-[0.6rem] uppercase tracking-wider text-cream-dim">
            Local Guide
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function ReviewMarquee() {
  const half = Math.ceil(reviews.length / 2);
  const rowA = reviews.slice(0, half);
  const rowB = reviews.slice(half);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-center gap-3">
        <Stars value={business.rating} size={20} />
        <span className="text-cream">
          <span className="font-display text-2xl">
            {business.rating.toLocaleString("es-CL")}
          </span>{" "}
          <span className="text-sm text-cream-muted">
            · {business.reviews} reseñas en Google
          </span>
        </span>
      </div>

      <MarqueeRow items={[...rowA, ...rowA]} />
      <MarqueeRow items={[...rowB, ...rowB]} reverse />
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Review[];
  reverse?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {items.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}
