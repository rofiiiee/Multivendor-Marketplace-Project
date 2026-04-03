import React from 'react';
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Features from "../components/home/Features";
import FeaturedProducts from "../components/home/FeaturedProducts";

/**
 * Home Page Component
 * * This is the main landing page of the application. 
 * It organizes the primary sections of the home view including 
 * the Hero section, Categories, Features, and Featured Products.
 */
const Home = () => {
  return (
    /* Main container with 'overflow-x-hidden' to prevent 
       any horizontal scrolling issues across different screen sizes.
    */
    <main className="overflow-x-hidden bg-white">
      {/* Visual top section with primary Call to Action (CTA) */}
      <Hero />
      
      {/* Display of product or service categories */}
      <Categories />
      
      {/* Highlighting key platform features/benefits */}
      <Features />
      
      {/* Grid of top-rated or trending products */}
      <FeaturedProducts />
    </main>
  );
};

export default Home;