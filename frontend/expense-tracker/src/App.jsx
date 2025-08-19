import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InvoiceExtractor from './InvoiceExtractor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <InvoiceExtractor/>
  )
}

export default App
