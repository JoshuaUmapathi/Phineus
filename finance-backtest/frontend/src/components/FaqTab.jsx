import React from 'react'

const faqs = [
  {
    question: "What is Stratum?",
    answer: "Stratum is an advanced quantitative portfolio evaluation platform designed for algorithmic traders."
  },
  {
    question: "How do I connect my live brokerage account?",
    answer: "You can use the 'Import CSV' button in the top navigation bar to securely connect your brokerage account via our integration aggregator, allowing for live portfolio sync and automated paper trading generation."
  },

  {
    question: "How are the AI Insights generated?",
    answer: "AI Insights run on a local LLM that ingests your real-time portfolio metrics, risk radar telemetry, and current asset weightings to generate defensive or offensive posturing advice."
  }
]

export default function FaqTab() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-sans tracking-tight text-text-strong">Frequently Asked Questions</h2>
        <p className="text-text-3 font-mono text-sm mt-2">Common questions about the Stratum platform and quantitative workflows.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-border bg-surface rounded-xl p-5 hover:border-border-2 transition-colors">
            <h3 className="font-sans font-semibold text-text-strong text-lg">{faq.question}</h3>
            <p className="font-mono text-sm text-text-3 mt-2 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
