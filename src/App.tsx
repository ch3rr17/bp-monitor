import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './components/Index'
import AddEntry from './components/AddEntry'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/add" element={<AddEntry />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

