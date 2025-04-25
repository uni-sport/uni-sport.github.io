import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from "virtual:generated-pages-react"
import { MDXProvider } from '@mdx-js/react'
import components from './mdx/index'


export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
  )
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MDXProvider components={components}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MDXProvider>
  </StrictMode>,
)
