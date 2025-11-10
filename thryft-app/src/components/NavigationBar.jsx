import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { GiShoppingBag, GiClothes, GiGameConsole } from 'react-icons/gi';
import { BsHouseFill, BsPersonCircle } from 'react-icons/bs';
import '../styles/NavigationBar.css';

function NavigationBar() {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getIconSize = (path, defaultSize = 24) => {
    return location.pathname === path ? defaultSize + 4 : defaultSize;
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Container className="justify-content-around text-center">
        <Nav className="w-100 justify-content-around">

          <Nav.Link
            as={NavLink}
            to="/"
            className={`d-flex flex-column align-items-center ${getActiveClass('/')}`}
          >
            <BsHouseFill size={getIconSize('/')} className="mb-1" />
            <span className="small">Home</span>
            <div className="nav-underline"></div>
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/shop"
            className={`d-flex flex-column align-items-center ${getActiveClass('/shop')}`}
          >
            <GiShoppingBag size={getIconSize('/shop')} className="mb-1" />
            <span className="small">Shop</span>
            <div className="nav-underline"></div>
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/game"
            className={`d-flex flex-column align-items-center ${getActiveClass('/game')}`}
          >
            <GiGameConsole size={getIconSize('/game')} className="mb-1" />
            <span className="small">Game</span>
            <div className="nav-underline"></div>
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/closet"
            className={`d-flex flex-column align-items-center ${getActiveClass('/closet')}`}
          >
            <GiClothes size={getIconSize('/closet')} className="mb-1" />
            <span className="small">Closet</span>
            <div className="nav-underline"></div>
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/account"
            className={`d-flex flex-column align-items-center ${getActiveClass('/account')}`}
          >
            <BsPersonCircle size={getIconSize('/account')} className="mb-1" />
            <span className="small">Account</span>
            <div className="nav-underline"></div>
          </Nav.Link>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
