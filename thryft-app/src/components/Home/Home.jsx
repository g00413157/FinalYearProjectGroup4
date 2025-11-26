import React from "react";
import "../../styles/Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">

        {/* HEADER */}
        <header className="home-hero">
          <div>
            <p className="home-eyebrow">Welcome back</p>
            <h1 className="home-title">Hi, User ✨</h1>
            <p className="home-subtitle">
              Your curated wardrobe & AI stylist, all in one place.
            </p>
          </div>
        </header>

        {/* AI EDITORIAL CARD */}
        <section className="home-section">
          <div className="ai-card">
            <div className="ai-card-inner">
              <div className="ai-card-header">
                <div>
                  <p className="ai-eyebrow">Thryft Editorial</p>
                  <h2 className="ai-title">Your AI Look of the Day</h2>
                </div>
              </div>

              <div className="ai-card-body">
                <div className="ai-collage">
                  <div className="ai-cutout ai-cutout-large">
                    <div className="ai-cutout-label">Top</div>
                  </div>
                  <div className="ai-cutout ai-cutout-medium">
                    <div className="ai-cutout-label">Bottom</div>
                  </div>
                  <div className="ai-cutout ai-cutout-small">
                    <div className="ai-cutout-label">Shoes</div>
                  </div>
                </div>

                <div className="ai-copy">
                  <p>
                    Soon, Thryft will style full outfits for you using the clothes you already own.
                  </p>
                  <button className="ai-button">Generate Look (coming soon)</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSET CATEGORIES — STATIC */}
        <section className="home-section">
          <div className="section-header">
            <h3>Your Closet</h3>
          </div>

          <div className="category-grid">
            <div className="category-card">Tops</div>
            <div className="category-card">Bottoms</div>
            <div className="category-card">Shoes</div>
            <div className="category-card">Accessories</div>
            <div className="category-card category-card-accent">Saved Outfits</div>
          </div>
        </section>

        {/* RECENTLY ADDED — STATIC */}
        <section className="home-section">
          <div className="section-header">
            <h3>Recently Added</h3>
          </div>

          <p className="section-empty">Items will appear here later.</p>
        </section>

        {/* SAVED OUTFITS — STATIC */}
        <section className="home-section">
          <div className="section-header">
            <h3>Saved Outfits</h3>
          </div>

          <p className="section-empty">Outfits will appear here later.</p>
        </section>

      </div>
    </div>
  );
}
