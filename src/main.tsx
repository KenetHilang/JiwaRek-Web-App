import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AssessChoice from './components/AssessmentPage/AssessChoice.tsx'
import AssessmentPageSH from './components/AssessmentPage/AssessPageSH.tsx'
import AssessmentPagePHQ from './components/AssessmentPage/AssessPagePHQ.tsx'
import ErrorPage from './components/ErrorPage/Error.tsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/assessment',
    element: <AssessChoice />,
  },
  {
    path: '/assessment/self-harm',
    element: <AssessmentPageSH />,
  },
  {
    path: '/assessment/phq9',
    element: <AssessmentPagePHQ />,
  },
  {
    path: '/*',
    element: <ErrorPage />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
