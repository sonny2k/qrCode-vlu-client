/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Container } from "react-bootstrap";

import { NavLink, useHistory } from "react-router-dom";

import { Nav } from "react-bootstrap";
import Statistical from "./../statistical";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <ul className="footer-menu">
              <li>
                <NavLink to={"/admin/dashboard"}>Statistical</NavLink>
              </li>
              <li>
                <NavLink to={"/admin/users"}>Users</NavLink>
              </li>
              <li>
                <NavLink to={"/admin/semesters"}>Semesters</NavLink>
              </li>
              <li>
                <NavLink to={"/admin/classes"}>Classes</NavLink>
              </li>
              <li>
                <NavLink to={"/admin/profile"}>Profile</NavLink>
              </li>
            </ul>
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              <a href="http://www.creative-tim.com">
                Creative Tim x The Invincibles
              </a>
              , made with love for a better web
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
