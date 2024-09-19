import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/footer/Footer";
import { ProfileImageProvider } from "./context/ProfileImageContext";
import { BankProvider } from "./context/BankContext";
function App() {
  return (
    <ProfileImageProvider>
      <div className="App">
        <Header />
        <main>
          <BankProvider>
            <Outlet />
          </BankProvider>
        </main>
        <Footer />
      </div>
    </ProfileImageProvider>
  );
}

export default App;
