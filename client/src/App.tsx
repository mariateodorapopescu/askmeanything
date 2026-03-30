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
import Question from './pages/question'
import Posts from './pages/posts'
import Post from './pages/post'
import Blog from './pages/blog'
import Blogpost from './pages/blogpost'
import Upload from "./pages/upload";

// import * as React from "react";
import {HeroUIProvider} from "@heroui/react";
import Footer from "./components/footer";
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
      <Route path="/q" element={<Question/>} />
      <Route path="/despr" element={<About/>} />
      <Route path="/login" element={<SignIn/>} />
      <Route path="/reg" element={<SignUp/>} />
      <Route path="/panel" element={<Dasboard/>} />
      <Route path="/callme" element={<Contact/>} />
      <Route path="/fogot" element={<Forgot/>} />
      <Route path="/posts" element={<Posts/>} />
      <Route path="/post" element={<Post/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/p" element={<Blogpost/>} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
    {/* </BrowserRouter> */}
     <Footer/>
    </HeroUIProvider>
  );
}

export default App;
