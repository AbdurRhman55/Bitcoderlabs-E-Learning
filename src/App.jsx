import { BrowserRouter as Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import store from '../store'
import Layout from "./Layout";
import { Provider } from "react-redux";
import { checkAuth } from '../slices/AuthSlice';

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  useEffect(() => {
    // Check for existing token on app startup
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(checkAuth());
    }
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
