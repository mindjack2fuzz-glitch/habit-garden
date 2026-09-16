import type { AppData } from './types'
import { createDefaultData } from './defaults'

const STORAGE_KEY = 'habit-garden:data'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultData()
    const parsed = JSON.parse(raw) as AppData
    if (parsed.version !== 1) return createDefaultData()
    // Fill in any settings fields missing from data saved by an older
    // version of the app, rather than letting calculations see `undefined`.
    return { ...createDefaultData(), ...parsed, settings: { ...createDefaultData().settings, ...parsed.settings } }
  } catch {
    return createDefaultData()
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable (private mode, quota, etc.) — silently ignore,
    // state still lives in memory for the current session.
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
