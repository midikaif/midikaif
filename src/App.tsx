/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectShowcase from "./components/ProjectShowcase";
import Capabilities from "./components/Capabilities";
import DigitalBusinessCard from "./components/DigitalBusinessCard";
import Contact from "./components/Contact";
import AboutOverlay from "./components/AboutOverlay";

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <main className="min-h-screen selection:bg-brand-accent selection:text-brand-text overflow-x-hidden">
      <Navbar onAboutClick={() => setIsAboutOpen(true)} />
      <Hero />
      <ProjectShowcase />
      <Capabilities />
      <Contact />
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  );
}
