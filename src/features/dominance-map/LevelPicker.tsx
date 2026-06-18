import { type Level, type LevelDef } from './types.ts'

export interface LevelPickerProps {
  title: string
  levels: LevelDef[]
  position: { left: number; top: number } | null
  onPick: (level: Level) => void
}

export function LevelPicker({ title, levels, position, onPick }: LevelPickerProps) {
  if (!position) {
    return null
  }
  return (
    <div
      data-level-picker
      className="absolute z-10 w-[110px] overflow-hidden rounded border-2 border-black bg-white text-center shadow-[3px_6px_0_rgba(0,0,0,.1)] sm:w-[140px] sm:border-4"
      style={{ left: position.left, top: position.top }}
    >
      <h2 className="m-0 cursor-default px-2.5 py-1 text-lg leading-7 font-normal text-black sm:text-2xl">
        {title}
      </h2>
      {levels.map((l) => (
        <button
          key={l.value}
          type="button"
          className="block w-full cursor-pointer px-2.5 py-1 text-sm leading-5 text-black sm:text-base"
          style={{ background: l.value === 0 ? undefined : l.color }}
          onClick={() => onPick(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
