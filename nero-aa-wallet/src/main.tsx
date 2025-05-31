import ReactDOM from 'react-dom/client'
import Sample from './Sample'
import neroConfig from '../nerowallet.config'
import { SocialWallet } from './index'
import '@rainbow-me/rainbowkit/styles.css'
import Home from './page/Home'
import ProfilePage from './page/ProfilePage'
import ClaimRolePage from './page/ClaimRolePage'
import AddProductPage from './page/AddProductPage'
import ProductsPage from './page/Product'
import '@/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <SocialWallet config={neroConfig} mode='sidebar'>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/sample" element={<Sample />}/>
        <Route path="/role" element={<ClaimRolePage />}/>
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/add-product" element={<AddProductPage />}/>
        <Route path="/product" element={<ProductsPage />}/>
    </Routes>
    </Router>
  </SocialWallet>,
)
