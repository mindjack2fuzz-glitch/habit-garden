import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluate, recordToday as recordTodayLogic } from '../logic/lifeCycle'
import { loadData, saveData, clearData } from '../logic/storage'
import { createDefaultData } from '../logic/defaults'
import type { AppData, LifeEvent, Settings } from '../logic/types'

export function useAppData() {
  const initialEvents = useRef<LifeEvent[]>([])
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData()
    const { data: evaluated, events } = evaluate(loaded, new Date())
    initialEvents.current = events
    return evaluated
  })
  const [lastEvents, setLastEvents] = useState<LifeEvent[]>([])
  const initialized = useRef(false)

  // Surface any events produced while the app was closed (e.g. a grace
  // period that expired overnight) as soon as it mounts.
  useEffect(() => {
    if (initialEvents.current.length) setLastEvents(initialEvents.current)
  }, [])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }
    saveData(data)
  }, [data])

  // Re-evaluate periodically while the app stays open, so a grace period
  // expiring or a new day starting is reflected without a reload.
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const { data: next, events } = evaluate(prev, new Date())
        if (events.length) setLastEvents(events)
        return next
      })
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const record = useCallback((note?: string) => {
    setData((prev) => {
      const { data: next, events } = recordTodayLogic(prev, new Date(), note)
      if (events.length) setLastEvents(events)
      return next
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }, [])

  const resetAll = useCallback(() => {
    clearData()
    setData(createDefaultData())
    setLastEvents([])
  }, [])

  return { data, record, updateSettings, resetAll, lastEvents, clearLastEvents: () => setLastEvents([]) }
}
