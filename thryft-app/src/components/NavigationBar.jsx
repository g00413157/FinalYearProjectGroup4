import React from 'react'
import { Nav, Navbar, Container } from 'react-bootstrap'

function NavigationBar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark" fixed="bottom">
      <Container className="justify-content-around">
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/shop">Shop</Nav.Link>
          <Nav.Link href="/closet">Closet</Nav.Link>
          <Nav.Link href="/account">Account</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
