import './App.css'
import Closet from './components/Closet'
import Shop from './components/Shop'
import Home from './components/Home'
import Account from './components/Account'
import NavigationBar from './components/NavigationBar'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  )
}

export default App
