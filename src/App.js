import "./App.css";
import { Header } from "./Components/Header/Header";

import { BrowserRouter as Router, Route, Routes } from "react-router";
import { MainPage } from "./Components/MainPage/MainPage";
import { FormsContainer } from "./Components/MainPage/FormsContainer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/agreement/:type" element={<FormsContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
