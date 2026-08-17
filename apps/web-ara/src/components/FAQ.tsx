'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How much is my accident worth?',
    answer: (
      <>
        <p>
          Honestly, it depends on your situation — things like how badly you were hurt, your medical bills, and any
          work you missed all play a part. The good news? We&apos;ll dig into every detail and fight to get you every
          dollar you deserve. Go ahead and take the quick survey above to see if you qualify.
        </p>
      </>
    ),
  },
  {
    question: 'Can I get money for pain and suffering?',
    answer: (
      <>
        <p>
          Yes, you can. If you&apos;ve been living with physical pain, emotional stress, or big changes to your
          everyday life since the accident, that matters — and you may be able to get compensated for it on top of
          your other losses.
        </p>
      </>
    ),
  },
  {
    question: 'Will I have to go to court?',
    answer: (
      <>
        <p>
          Probably not. Most cases get settled well before anyone sets foot in a courtroom. But if the insurance
          company won&apos;t play fair, don&apos;t worry — we&apos;ve got your back and we&apos;re ready to take it to
          court and fight for you.
        </p>
      </>
    ),
  },
  {
    question: "What if I don't have health insurance?",
    answer: (
      <>
        <p>
          No insurance? No problem — you can still move forward with a claim. If you were hurt, missed work, or have
          medical bills piling up, it&apos;s really worth chatting with an attorney. Insurance companies hardly ever
          offer what your case is actually worth, and the right lawyer can push for more. One of our specialists is
          happy to look over your situation and answer your questions first — no pressure to hire anyone.
        </p>
      </>
    ),
  },
  {
    question: 'How long will my case or settlement take?',
    answer: (
      <>
        <p>
          Every case moves at its own pace. Some come together in just a few weeks, while others take a few months or
          more. We&apos;ll keep things moving as fast as we can — but we&apos;ll never rush you into a deal that&apos;s
          less than you deserve just to wrap up quickly.
        </p>
      </>
    ),
  },
  {
    question: 'How much does an accident attorney cost?',
    answer: (
      <>
        <p>
          Here&apos;s the part people love: most auto accident attorneys don&apos;t charge a thing up front. They only
          get paid if they win for you, and that fee comes out of your settlement — never out of your own pocket.
        </p>
      </>
    ),
  },
  {
    question: 'Do I need an attorney for every car accident?',
    answer: (
      <>
        <p>
          Not always — but if you were hurt, lost time at work, or have medical bills to deal with, it&apos;s a really
          smart idea to talk to an attorney. Insurers don&apos;t always offer what you truly deserve, and a good lawyer
          can fight to get you more. After we take a look at your case, we&apos;ll match you with a local attorney
          who&apos;s ready to step in and go after the most compensation possible for you.
        </p>
      </>
    ),
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button 
              className="faq-question" 
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
