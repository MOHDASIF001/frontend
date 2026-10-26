import React from 'react';

export interface SeoContent {
  heading: string;
  paragraphs: string[];
  subsections?: { heading: string; paragraphs?: string[]; points?: string[] }[];
}

// Written travel-guide copy shown just above the footer, styled like DestinationSeoSection.
export default function SeoContentSection({ content, eyebrow = 'Travel Guide' }: { content?: SeoContent; eyebrow?: string }) {
  if (!content) return null;
  const textStyle = { fontSize: '14px', lineHeight: '1.9' };

  return (
    <div className="bg-white" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>
          {eyebrow}
        </span>
        <h2 className="font-black text-slate-900 mt-2 mb-4" style={{ fontSize: '22px', lineHeight: '1.35' }}>
          {content.heading}
        </h2>
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-slate-600 font-medium" style={{ ...textStyle, marginTop: i ? '14px' : 0 }}>
            {p}
          </p>
        ))}

        {content.subsections?.map((s) => (
          <div key={s.heading} style={{ marginTop: '26px' }}>
            <h3 className="font-black text-slate-900 mb-2" style={{ fontSize: '17px' }}>
              {s.heading}
            </h3>
            {s.paragraphs?.map((p, i) => (
              <p key={i} className="text-slate-600 font-medium" style={{ ...textStyle, marginTop: i ? '10px' : 0 }}>
                {p}
              </p>
            ))}
            {s.points && (
              <ul className="space-y-2" style={{ marginTop: s.paragraphs?.length ? '10px' : 0 }}>
                {s.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-slate-600 font-medium" style={textStyle}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#ff8126', fontSize: '12px', marginTop: '8px' }}></i>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
