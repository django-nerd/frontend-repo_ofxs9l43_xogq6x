import { useEffect, useMemo, useState } from 'react'
import { Save, Check, Trash2 } from 'lucide-react'

export default function PromptCard({ id, value, onChange, onSave, onRemove, autoFocus }) {
  const [text, setText] = useState(value || '')
  const [savedAt, setSavedAt] = useState(null)
  const maxChars = 2000

  useEffect(() => {
    setText(value || '')
  }, [value])

  const charsLeft = useMemo(() => maxChars - text.length, [text])
  const isOver = charsLeft < 0

  const handleSave = () => {
    if (isOver) return
    onSave?.(id, text)
    setSavedAt(new Date())
  }

  const handleChange = (e) => {
    const v = e.target.value
    setText(v)
    onChange?.(id, v)
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-sm font-semibold text-slate-700">Prompt</div>
        <button
          onClick={() => onRemove?.(id)}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors"
          aria-label="Remove prompt"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <textarea
          autoFocus={autoFocus}
          value={text}
          onChange={handleChange}
          placeholder="Write your prompt here..."
          className={`min-h-[140px] w-full resize-y rounded-lg border p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            isOver ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
          }`}
          maxLength={maxChars + 500}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className={`text-xs ${isOver ? 'text-rose-600' : 'text-slate-400'}`}>
            {isOver ? `${-charsLeft} over the limit` : `${charsLeft} characters left`}
          </div>
          <div className="flex items-center gap-2">
            {savedAt && (
              <div className="inline-flex items-center gap-1 text-xs text-emerald-600">
                <Check size={14} /> Saved
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isOver || !text.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Save Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
