/* ==========================================================================
   مخزن الحالة: localStorage دايماً (شغّال أوفلاين)، وجوجل شيت اختياري للمزامنة.
   الشيت هو المصدر الدائم — لو فتحت الموقع من جهاز تاني بتلاقي شغلك.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_SHEETS, type NicheSheet } from './sheets'

const K_TASKS = 'magmafy-niche-tasks-v1'
const K_SHEETS = 'magmafy-niche-sheets-v1'
const K_URL = 'magmafy-niche-sync-url-v1'
const K_LAST = 'magmafy-niche-last-sync-v1'

export type SyncState = 'off' | 'idle' | 'syncing' | 'ok' | 'error'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* التخزين ممكن يكون مقفول — بنكمّل بدون حفظ محلي */
  }
}

export function getSyncUrl(): string {
  try {
    return localStorage.getItem(K_URL) ?? ''
  } catch {
    return ''
  }
}

export function setSyncUrl(url: string) {
  try {
    if (url) localStorage.setItem(K_URL, url)
    else localStorage.removeItem(K_URL)
  } catch {
    /* تجاهل */
  }
}

/* الاتصال بجوجل شيت عن طريق Apps Script Web App.
   بنستخدم text/plain عشان نتفادى طلب preflight في CORS. */
async function callSheet(url: string, payload: unknown, signal?: AbortSignal) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
    signal
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data && data.ok === false) throw new Error(data.error || 'خطأ من جوجل شيت')
  return data
}

export interface RemoteState {
  tasks: Record<string, boolean>
  sheets: NicheSheet[]
}

/* الدمج: الأحدث بيكسب. المهام بالمفتاح، والأوراق بـ id و updatedAt. */
function mergeSheets(local: NicheSheet[], remote: NicheSheet[]): NicheSheet[] {
  const map = new Map<string, NicheSheet>()
  for (const s of remote) map.set(s.id, s)
  for (const s of local) {
    const r = map.get(s.id)
    if (!r || new Date(s.updatedAt) > new Date(r.updatedAt)) map.set(s.id, s)
  }
  return [...map.values()].filter((s) => !s.deleted)
}

export function useStore() {
  const [ready, setReady] = useState(false)
  const [tasks, setTasks] = useState<Record<string, boolean>>({})
  const [sheets, setSheets] = useState<NicheSheet[]>([])
  const [syncUrl, setUrlState] = useState('')
  const [syncState, setSyncState] = useState<SyncState>('off')
  const [syncError, setSyncError] = useState('')
  const [lastSync, setLastSync] = useState('')

  const pushTimer = useRef<number | null>(null)
  const dirty = useRef(false)

  /* تحميل أولي من المتصفح، وبعدين سحب من الشيت لو مربوط */
  useEffect(() => {
    const localTasks = read<Record<string, boolean>>(K_TASKS, {})
    const localSheets = read<NicheSheet[] | null>(K_SHEETS, null)
    setTasks(localTasks)
    setSheets(localSheets && localSheets.length ? localSheets : DEFAULT_SHEETS)
    const url = getSyncUrl()
    setUrlState(url)
    setLastSync(read<string>(K_LAST, ''))
    setReady(true)

    if (url) {
      setSyncState('syncing')
      callSheet(url, { action: 'pull' })
        .then((data: { state?: RemoteState }) => {
          const remote = data.state
          if (remote) {
            setTasks((t) => ({ ...remote.tasks, ...t }))
            setSheets((s) => mergeSheets(s, remote.sheets ?? []))
          }
          setSyncState('ok')
          const now = new Date().toISOString()
          setLastSync(now)
          write(K_LAST, now)
        })
        .catch((e: Error) => {
          setSyncState('error')
          setSyncError(e.message)
        })
    }
  }, [])

  /* حفظ محلي فوري */
  useEffect(() => {
    if (ready) write(K_TASKS, tasks)
  }, [tasks, ready])
  useEffect(() => {
    if (ready) write(K_SHEETS, sheets)
  }, [sheets, ready])

  /* دفع مؤجّل للشيت (بعد ثانيتين من آخر تعديل) */
  const schedulePush = useCallback(() => {
    const url = getSyncUrl()
    if (!url) return
    dirty.current = true
    if (pushTimer.current) window.clearTimeout(pushTimer.current)
    pushTimer.current = window.setTimeout(() => {
      setSyncState('syncing')
      callSheet(url, { action: 'push', state: { tasks: tasksRef.current, sheets: sheetsRef.current } })
        .then(() => {
          dirty.current = false
          setSyncState('ok')
          setSyncError('')
          const now = new Date().toISOString()
          setLastSync(now)
          write(K_LAST, now)
        })
        .catch((e: Error) => {
          setSyncState('error')
          setSyncError(e.message)
        })
    }, 2000)
  }, [])

  /* مراجع حيّة عشان المؤقّت يبعت آخر حالة */
  const tasksRef = useRef(tasks)
  const sheetsRef = useRef(sheets)
  tasksRef.current = tasks
  sheetsRef.current = sheets

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((p) => ({ ...p, [id]: !p[id] }))
      schedulePush()
    },
    [schedulePush]
  )

  const resetTasks = useCallback(() => {
    setTasks({})
    schedulePush()
  }, [schedulePush])

  const updateSheet = useCallback(
    (id: string, patch: Partial<NicheSheet>) => {
      setSheets((p) =>
        p.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s))
      )
      schedulePush()
    },
    [schedulePush]
  )

  const addSheet = useCallback(
    (s: NicheSheet) => {
      setSheets((p) => [...p, s])
      schedulePush()
    },
    [schedulePush]
  )

  const removeSheet = useCallback(
    (id: string) => {
      setSheets((p) => p.filter((s) => s.id !== id))
      schedulePush()
    },
    [schedulePush]
  )

  const connect = useCallback(async (url: string) => {
    setSyncState('syncing')
    setSyncError('')
    try {
      const data = await callSheet(url, { action: 'pull' })
      setSyncUrl(url)
      setUrlState(url)
      const remote = (data as { state?: RemoteState }).state
      if (remote) {
        setTasks((t) => ({ ...remote.tasks, ...t }))
        setSheets((s) => mergeSheets(s, remote.sheets ?? []))
      }
      /* دفع فوري عشان الشيت يتعبّى من أول لحظة */
      await callSheet(url, { action: 'push', state: { tasks: tasksRef.current, sheets: sheetsRef.current } })
      setSyncState('ok')
      const now = new Date().toISOString()
      setLastSync(now)
      write(K_LAST, now)
      return true
    } catch (e) {
      setSyncState('error')
      setSyncError((e as Error).message)
      return false
    }
  }, [])

  const disconnect = useCallback(() => {
    setSyncUrl('')
    setUrlState('')
    setSyncState('off')
    setSyncError('')
  }, [])

  const syncNow = useCallback(async () => {
    const url = getSyncUrl()
    if (!url) return false
    setSyncState('syncing')
    try {
      const data = await callSheet(url, { action: 'pull' })
      const remote = (data as { state?: RemoteState }).state
      if (remote) {
        setTasks((t) => ({ ...remote.tasks, ...t }))
        setSheets((s) => mergeSheets(s, remote.sheets ?? []))
      }
      await callSheet(url, { action: 'push', state: { tasks: tasksRef.current, sheets: sheetsRef.current } })
      setSyncState('ok')
      setSyncError('')
      const now = new Date().toISOString()
      setLastSync(now)
      write(K_LAST, now)
      return true
    } catch (e) {
      setSyncState('error')
      setSyncError((e as Error).message)
      return false
    }
  }, [])

  return useMemo(
    () => ({
      ready,
      tasks,
      sheets,
      toggleTask,
      resetTasks,
      updateSheet,
      addSheet,
      removeSheet,
      syncUrl,
      syncState,
      syncError,
      lastSync,
      connect,
      disconnect,
      syncNow
    }),
    [
      ready,
      tasks,
      sheets,
      toggleTask,
      resetTasks,
      updateSheet,
      addSheet,
      removeSheet,
      syncUrl,
      syncState,
      syncError,
      lastSync,
      connect,
      disconnect,
      syncNow
    ]
  )
}

export type Store = ReturnType<typeof useStore>
