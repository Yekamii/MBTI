import React, { useState,  useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../context/AuthContext"; // <- import

export default function Header() {
  const { user, logout } = useContext(AuthContext); // <- აქ
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/articles?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setSearchQuery("");
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    logout(); // <- Context logout
    setUserMenuOpen(false);
    navigate("/register");
  };

  const handleUserIconClick = () => {
    setUserMenuOpen((p) => !p);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // click outside etc, menu toggle, remains unchanged

  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <img src="/lo.png" alt="MBTI Logo" />
        </NavLink>
      </div>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>მთავარი</NavLink>
          </li>
          <li>
            <NavLink to="/mbti-dimensions" onClick={() => setMenuOpen(false)}>MBTI განზომილებები</NavLink>
          </li>
          <li>
            <NavLink to="/articles" onClick={() => setMenuOpen(false)}>მიმოხილვები</NavLink>
          </li>
          <li>
            <NavLink to="/start-test" onClick={() => setMenuOpen(false)}>დაწყება ტესტი</NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-actions" ref={searchRef}>
        <button
          className="search-toggle"
          onClick={() => {
            setSearchOpen((p) => !p);
            setMenuOpen(false);
          }}
        >
          <img src="/search.png" alt="ძებნა" className="search-icon" />
        </button>

        {searchOpen && (
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="ძებნა საიტზე..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">ძიება</button>
          </form>
        )}

        {!user ? (
          <NavLink to="/register" className="mobile-signin">Sign In</NavLink>
        ) : (
          <div ref={userRef} className="header-user-wrapper" onClick={handleUserIconClick}>
            <div className="header-user">
              <img
                src={user.photo || "/images/default.png"}
                alt={user.name}
                className="header-user-photo"
                onError={(e) => { e.target.src = "/images/default.png"; }}
              />
            </div>

            {userMenuOpen && (
              <div className="user-dropdown">
                <span className="dropdown-user-email">{user.email}</span>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((p) => !p)}
        aria-label="მენიუ"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}