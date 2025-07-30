import { Route, Routes } from "react-router-dom";

// import IndexPage from "@/pages/index";
// import DocsPage from "@/pages/docs";
// import PricingPage from "@/pages/pricing";
// import BlogPage from "@/pages/blog";
// import AboutPage from "@/pages/about";

import Home from './pages/hom'
import About from './pages/despr'
import SignIn from './pages/login'
import SignUp from './pages/register'
import Dasboard from './pages/dash'
import Questions from './pages/qa'
import Header from './components/hdr'
import Contact from './pages/callme'
import Forgot from './pages/fogotpas'

// import * as React from "react";
import {HeroUIProvider} from "@heroui/react";
// import './index.css';

function App() {
  return (
    // <Routes>
    //   <Route element={<IndexPage />} path="/" />
    //   <Route element={<DocsPage />} path="/docs" />
    //   <Route element={<PricingPage />} path="/pricing" />
    //   <Route element={<BlogPage />} path="/blog" />
    //   <Route element={<AboutPage />} path="/about" />
    // </Routes>
    <HeroUIProvider>
    {/* <BrowserRouter> */}
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/qa" element={<Questions/>} />
      <Route path="/despr" element={<About/>} />
      <Route path="/login" element={<SignIn/>} />
      <Route path="/reg" element={<SignUp/>} />
      <Route path="/panel" element={<Dasboard/>} />
      <Route path="/callme" element={<Contact/>} />
      <Route path="/fogot" element={<Forgot/>} />
    </Routes>
    {/* </BrowserRouter> */}
    </HeroUIProvider>
  );
}

export default App;
