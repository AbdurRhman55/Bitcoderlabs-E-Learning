import { BrowserRouter as Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import store from '../store'
import Layout from "./Layout";
import { Provider } from "react-redux";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <Layout />
      </Provider>
    </Router>
  );
}

export default App;
