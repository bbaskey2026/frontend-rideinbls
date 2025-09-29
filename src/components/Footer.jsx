import React from "react";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
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
    <footer className="landing-footer">
      <div className="footer-content">
        {/* Brand Info */}
        <div className="footer-section footer-brand">
          <h3>Blsride</h3>
          <p>
            Odisha's leading vehicle booking platform. Safe, reliable, and affordable rides for everyone.
          </p>
          <div className="contact-info">
            <p><MapPin size={16} />Balasore.Odisha</p>
          <p> <Phone size={16} /> <a href="tel:+918249592464">+91 82495 92464</a></p>
            <p><Mail size={16} /> <a href="mailto:Rideinbls@gmail.com?subject=Inquiry&body=Hello,%20I%20want%20to%20know%20more%20about%20Blsride.">Rideinbls@gmail.com</a>
</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <button onClick={() => handleScrollToSection('services')} className="footer-link">Services</button>
          <button onClick={() => handleScrollToSection('cities')} className="footer-link">Cities</button>
          <button onClick={() => handleScrollToSection('policies')} className="footer-link">Policies</button>
       
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <button onClick={() => handleScrollToSection('contact')} className="footer-link">Contact Us</button>
          <button onClick={() => handleNavigation('/help')} className="footer-link">Help Center</button>
          <button onClick={() => handleNavigation('/safety')} className="footer-link">Safety</button>
          <button onClick={() => handleNavigation('/feedback')} className="footer-link">Feedback</button>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>Legal</h4>
          <button onClick={() => handleNavigation('/terms')} className="footer-link">Terms of Service</button>
          <button onClick={() => handleNavigation('/privacy')} className="footer-link">Privacy Policy</button>
          <button onClick={() => handleNavigation('/refund')} className="footer-link">Refund Policy</button>
          <button onClick={() => handleNavigation('/driver-terms')} className="footer-link">Driver Terms</button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          © 2025 Blsride. All Rights Reserved. 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
