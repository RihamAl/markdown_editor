import{BrowserRouter as Router,Routes,Route}from"react-router-dom";
import Login from"./pages/Login";     
import Signup from"./pages/Signup";
import Home from"./pages/Home";
import DocumentsPage from"./pages/DocumentsPage";

export default function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/documents" element={<DocumentsPage/>}/> 
      </Routes>
    </Router>
  );
}
