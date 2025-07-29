"use client"

import { useState } from "react"

import Navbar from "./components/Navbar"
import "./App.css"

function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true)
  const miniSidebarWidth = 72 // Define the width of the collapsed mini-sidebar

  return (
    <div className="App">
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} miniSidebarWidth={miniSidebarWidth} />
      <div className="main-content" style={{ marginLeft: isNavbarOpen ? "280px" : `${miniSidebarWidth}px` }}>
        <h1>Main Content Area</h1>
        <p>This is where your main application content would go.</p>
        <p>The navbar is fully functional with expand/collapse capabilities.</p>
        <p>Scroll down to see the chat history and profile section.</p>
        <div style={{ height: "1000px", background: "#e0e0e0", marginTop: "20px", padding: "20px" }}>
          <p>More content to demonstrate scrolling...</p>
          <p>This area simulates the rest of your application's UI.</p>
          <p>The sidebar should now correctly show icons when collapsed.</p>
        </div>
      </div>
    </div>
  )
}

export default App
