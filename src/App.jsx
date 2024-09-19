import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/footer/Footer";
import { ProfileImageProvider } from "./context/ProfileImageContext";
function App() {
  return (
    <ProfileImageProvider>
      <div className="App">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ProfileImageProvider>
  );
}

export default App;
