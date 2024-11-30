import "./App.css";
import { Header } from "./Components/Header/Header";

import { BrowserRouter as Router, Route, Routes } from "react-router";
import { MainPage } from "./Components/MainPage/MainPage";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
