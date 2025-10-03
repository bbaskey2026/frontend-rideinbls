import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="ola-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="brand-name">Blsride</h2>
            <p className="brand-description">
              Odisha's leading vehicle booking platform. Safe, reliable, and
              affordable rides for everyone.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} />
                <span>Balasore, Odisha</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>+91 82495 92464</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>Rideinbls@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="column-title">Quick Links</h3>
            <ul className="footer-links">
              <li onClick={() => handleScrollToSection("services")}>Services</li>
              <li onClick={() => handleScrollToSection("cities")}>Cities</li>
              <li onClick={() => handleScrollToSection("policies")}>Policies</li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="column-title">Support</h3>
            <ul className="footer-links">
              <li onClick={() => handleScrollToSection("contact")}>Contact Us</li>
              <li onClick={() => handleNavigation("/help")}>Help Center</li>
              <li onClick={() => handleNavigation("/safety")}>Safety</li>
              <li onClick={() => handleNavigation("/feedback")}>Feedback</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h3 className="column-title">Legal</h3>
            <ul className="footer-links">
              <li onClick={() => handleNavigation("/terms")}>Terms of Service</li>
              <li onClick={() => handleNavigation("/privacy")}>Privacy Policy</li>
              <li onClick={() => handleNavigation("/refund")}>Refund Policy</li>
              <li onClick={() => handleNavigation("/driver-terms")}>Driver Terms</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">© 2025 Blsride. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;