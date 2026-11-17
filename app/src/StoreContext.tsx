import { createContext, useContext, type ReactNode } from 'react'
import { useStore, type Store } from './store'

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore()
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useAppStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useAppStore لازم يكون جوّا StoreProvider')
  return s
}
