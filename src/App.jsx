import { useEffect, useMemo, useState } from 'react'
import PromptCard from './components/PromptCard'
import { PlusCircle, SaveAll } from 'lucide-react'

export default function App() {
  const [cards, setCards] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('prompt_cards') : null
    if (saved) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    // seed with a few empty cards
    return Array.from({ length: 6 }).map((_, i) => ({ id: crypto.randomUUID(), text: '' }))
  })

  const total = cards.length
  const filled = useMemo(() => cards.filter(c => c.text.trim().length > 0).length, [cards])

  useEffect(() => {
    localStorage.setItem('prompt_cards', JSON.stringify(cards))
  }, [cards])

  const updateCard = (id, value) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, text: value } : c))
  }

  const saveCard = (id, text) => {
    // For now we just persist to localStorage (already handled) and show subtle feedback inside the card
    setCards(prev => prev.map(c => c.id === id ? { ...c, text } : c))
  }

  const removeCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  const addCard = () => {
    setCards(prev => [{ id: crypto.randomUUID(), text: '' }, ...prev])
  }

  const saveAll = () => {
    // Trigger save for all cards (local persistence already occurs via effect)
    // This function exists mainly to provide a primary action affordance
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white grid place-items-center font-semibold shadow-sm">P</div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-800">Prompt Board</h1>
              <p className="text-xs text-slate-500">A clean space to draft and save prompts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={addCard}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <PlusCircle size={18} />
              New Box
            </button>
            <button
              onClick={saveAll}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <SaveAll size={18} />
              Save All
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">Total</div>
            <div className="text-lg font-semibold text-slate-800">{total}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">Filled</div>
            <div className="text-lg font-semibold text-emerald-600">{filled}</div>
          </div>
        </div>
      </div>

      {/* Grid of prompt boxes */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cards.map((c, idx) => (
            <PromptCard
              key={c.id}
              id={c.id}
              value={c.text}
              onChange={updateCard}
              onSave={saveCard}
              onRemove={removeCard}
              autoFocus={idx === 0}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          Built with care. Your prompts are saved in your browser.
        </div>
      </footer>
    </div>
  )
}
