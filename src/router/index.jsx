import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoadingScreen from '@/components/ui/LoadingScreen'

const Home          = lazy(() => import('@/pages/Home'))
const Results       = lazy(() => import('@/pages/Results'))
const Dashboard     = lazy(() => import('@/pages/Dashboard'))
const TugArena      = lazy(() => import('@/games/TugArena'))
const BalloonBattle = lazy(() => import('@/games/BalloonBattle'))
const SpellIt       = lazy(() => import('@/games/SpellIt'))
const GrammarVision = lazy(() => import('@/games/GrammarVision'))
const MapMaster     = lazy(() => import('@/games/MapMaster'))
const MemoryMatrix  = lazy(() => import('@/games/MemoryMatrix'))
const SpotIt        = lazy(() => import('@/games/SpotIt'))
const FrogCatch     = lazy(() => import('@/games/FrogCatch'))

const router = createBrowserRouter([
  { path: '/',                    element: <Home /> },
  { path: '/results',             element: <Results /> },
  { path: '/dashboard',           element: <Dashboard /> },
  { path: '/play/tug-arena',      element: <TugArena /> },
  { path: '/play/balloon-battle', element: <BalloonBattle /> },
  { path: '/play/spell-it',       element: <SpellIt /> },
  { path: '/play/grammar-vision', element: <GrammarVision /> },
  { path: '/play/map-master',     element: <MapMaster /> },
  { path: '/play/memory-matrix',  element: <MemoryMatrix /> },
  { path: '/play/spot-it',  element: <SpotIt /> },
  { path: "/play/frog-catch", element: <FrogCatch /> }
])

export default function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}