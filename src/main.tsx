import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AssessChoice from './components/AssessmentPage/AssessChoice.tsx'
import AssessmentPageSH from './components/AssessmentPage/AssessPageSH.tsx'
import AssessmentPagePHQ from './components/AssessmentPage/AssessPagePHQ.tsx'
import AssessmentPageSRQ from './components/AssessmentPage/AssessPageSRQ.tsx'
import AssessResultPage from './components/AssessmentPage/Resultpage/AssessResultPage.tsx'
import ErrorPage from './components/ErrorPage/Error.tsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ContactPage from './components/ContactPage/contactPage.tsx'
import { initEmailJS } from './utils/emailService.ts'
import MaterialLanding from './components/MaterialPage/materialLanding.tsx'

// Initialize EmailJS
initEmailJS();

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
    path: '/assessment/srq20',
    element: <AssessmentPageSRQ />,
  },
  {
    path: '/assessment/result',
    element: <AssessResultPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/materials',
    element: <MaterialLanding />,
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
