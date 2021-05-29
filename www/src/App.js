import "./App.css";
import { Header } from "./components/Header";
import { ListsContextProvider, UserContextProvider } from "./contexts";
import { BrowserRouter as Router } from "react-router-dom";
import { Pages } from "./components/Pages";
require("dotenv").config();

function App() {
  return (
    <Router>
      <UserContextProvider>
        <ListsContextProvider>
          <div className="App">
            <Header />
            <Pages />
          </div>
        </ListsContextProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
