'use client';

import React from 'react';

interface FormattedProductDescriptionProps {
  description?: string;
  productName?: string;
  mode?: 'full' | 'compact';
  className?: string;
}

interface SpecItem {
  key: string;
  value: string;
}

/**
 * Helper to render inline markdown like **bold**, *italic*, and clean text
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split on bold syntax (**bold**)
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-[#1c1510]">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Intelligent luxury parser for jewellery product descriptions
 * Detects:
 * 1. Intro narrative paragraphs
 * 2. Specifications / key-value bullets (- **Metal:** 9ct Gold)
 * 3. Gift / celebratory callout notes
 * 4. General bullet lists
 */
export default function FormattedProductDescription({
  description = '',
  productName = '',
  mode = 'full',
  className = '',
}: FormattedProductDescriptionProps) {
  if (!description || !description.trim()) {
    return (
      <p className={`text-xs text-[#8c7d6c] italic ${className}`}>
        No description provided for this exquisite jewellery piece.
      </p>
    );
  }

  // Normalize line endings
  const rawLines = description
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim());

  const narrativeParagraphs: string[] = [];
  const specItems: SpecItem[] = [];
  const generalBullets: string[] = [];
  let giftNote = '';
  let standalonePrice = '';

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line) continue;

    // 1. Check if line is repeating the product name/title at the very beginning
    if (i === 0 && productName) {
      const cleanLine = line.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const cleanName = productName.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const nameWords = cleanName.split(/\s+/).filter(w => w.length > 2);
      const matchedWords = nameWords.filter(w => cleanLine.includes(w));
      if (line.length < 120 && nameWords.length > 0 && matchedWords.length >= Math.min(2, nameWords.length)) {
        continue;
      }
    }

    // 2. Check if line is standalone Price: £...
    const priceMatch = line.match(/^\*{0,2}Price:\s*(£?[0-9,.]+)\*{0,2}$/i);
    if (priceMatch) {
      standalonePrice = priceMatch[1];
      continue;
    }

    // 3. Check if section header like **Product Details** or Specifications
    if (
      /^(\*{0,2}(product details|specifications|details|craftsmanship details|features)\*{0,2}:?)$/i.test(
        line
      )
    ) {
      continue; // Handled visually by specs container
    }

    // 4. Check if key-value bullet: e.g. - **Metal:** 9ct Yellow Gold OR • Metal: ... OR - Metal: ...
    const kvMatch = line.match(/^[-*•]?\s*\*{0,2}([^:*]+?)\*{0,2}\s*:\s*\*{0,2}([^*]+?)\*{0,2}$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();

      // Ensure key isn't a long sentence
      if (key.length <= 30 && !key.toLowerCase().includes('product details')) {
        specItems.push({ key, value: val });
        continue;
      }
    }

    // 5. Check if standard bullet item: - Some feature
    if (/^[-*•]\s+/.test(line)) {
      const bulletText = line.replace(/^[-*•]\s+/, '').trim();
      generalBullets.push(bulletText);
      continue;
    }

    // 6. Check if gift / occasion note
    if (
      /(gift for|anniversar|birthday|celebration|special occasion|complimentary gift|perfect gift)/i.test(
        line
      ) &&
      line.length < 200
    ) {
      giftNote = line.replace(/^\*{1,2}|\*{1,2}$/g, '').trim();
      continue;
    }

    // Otherwise, treat as narrative paragraph
    narrativeParagraphs.push(line);
  }

  // Fallback: If no structured sections were extracted, treat as paragraphs
  const hasStructuredData = specItems.length > 0 || giftNote || generalBullets.length > 0;

  return (
    <div className={`space-y-3.5 text-[#1c1510] ${className}`}>
      {/* ── 1. Narrative Intro Paragraphs ── */}
      {narrativeParagraphs.length > 0 ? (
        <div className="space-y-2.5">
          {narrativeParagraphs.map((para, idx) => (
            <p
              key={`para-${idx}`}
              className={`${
                mode === 'compact' ? 'text-xs' : 'text-xs sm:text-[13.5px]'
              } text-[#5a483a] font-light leading-relaxed`}
            >
              {renderInlineMarkdown(para)}
            </p>
          ))}
        </div>
      ) : (
        !hasStructuredData && (
          <p
            className={`${
              mode === 'compact' ? 'text-xs' : 'text-xs sm:text-[13.5px]'
            } text-[#5a483a] font-light leading-relaxed whitespace-pre-line`}
          >
            {renderInlineMarkdown(description)}
          </p>
        )
      )}

      {/* ── 2. Structured Product Details & Specifications Box ── */}
      {specItems.length > 0 && (
        <div className="rounded-[6px] bg-[#f9f6f0] border border-[#e8ded0] p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#e8ded0]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59d5f]" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#1c1510]">
                Product Specifications
              </span>
            </div>
            {standalonePrice && (
              <span className="text-[10.5px] font-semibold text-[#8c6d3d] bg-[#f0e8dc] px-2 py-0.5 rounded-[4px]">
                {standalonePrice}
              </span>
            )}
          </div>

          <div
            className={`grid ${
              mode === 'compact' ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2'
            }`}
          >
            {specItems.map((item, idx) => (
              <div
                key={`spec-${idx}`}
                className="flex items-baseline justify-between sm:justify-start gap-2 py-1 border-b border-[#eee4d5] last:border-b-0 sm:border-b-0"
              >
                <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#7c6958] uppercase tracking-wide shrink-0">
                  {item.key}:
                </span>
                <span className="text-[11.5px] sm:text-xs font-medium text-[#1c1510] text-right sm:text-left">
                  {renderInlineMarkdown(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. General Bullets if any ── */}
      {generalBullets.length > 0 && (
        <ul className="space-y-1.5 pl-1">
          {generalBullets.map((bullet, idx) => (
            <li
              key={`bullet-${idx}`}
              className="text-xs text-[#5a483a] flex items-start gap-2 leading-relaxed"
            >
              <span className="text-[#c59d5f] font-bold select-none">•</span>
              <span>{renderInlineMarkdown(bullet)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ── 4. Luxury Gift & Special Occasion Callout ── */}
      {giftNote && (
        <div className="flex items-center gap-2.5 p-3 rounded-[6px] bg-gradient-to-r from-[#faf6ef] via-[#f7f2e7] to-[#faf6ef] border border-[#deb887]/50 shadow-2xs">
          <span className="text-base sm:text-lg select-none">🎁</span>
          <p className="text-[11.5px] sm:text-xs text-[#523e2b] font-serif italic tracking-wide leading-snug">
            {renderInlineMarkdown(giftNote)}
          </p>
        </div>
      )}
    </div>
  );
}
