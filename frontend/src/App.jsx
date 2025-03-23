import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Body from "./Body";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import SignupPage from "./pages/SignupPage";
import Feed from "./pages/Feed";

function App() {
  return(
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>

          <Route path="/" element={<Body />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App
