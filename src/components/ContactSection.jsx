import React from "react";
import { Phone, FileText, Globe } from "lucide-react";
import "./ContactSection.css";

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="section-header">
        <h2>Professional Customer Support & Business Development</h2>
        <p>Multi-channel communication infrastructure with dedicated support teams and business partnership opportunities</p>
      </div>

      <div className="contact-grid">
        {/* Hotline */}
        <div className="contact-card">
          <Phone size={36} className="contact-icon" />
          <h3>24/7 Customer Support Hotline</h3>
          <p><strong>+91 8249 592 464</strong></p>
          <p>Emergency assistance available</p>
          <p>Multi-lingual support (English, Hindi, Odia)</p>
          <p>Average response time: Under 30 seconds</p>
          <p>Corporate dedicated line available</p>
        </div>

        {/* Email Support */}
        <div className="contact-card">
          <FileText size={36} className="contact-icon" />
          <h3>Professional Email Support</h3>
          <a
            href="mailto:Rideinbls@gmail.com?subject=Business%20Inquiry%20-%20Blsride%20Transportation%20Services&body=Dear%20Blsride%20Team,"
            className="email-link"
          >
            Rideinbls@gmail.com
          </a>
          <p>Professional inquiry response: Within 2 hours</p>
          <p>Technical support: Within 4 hours</p>
          <p>Business partnerships: Within 24 hours</p>
          <p>Complaint resolution: Priority handling</p>
        </div>

        {/* Digital Presence */}
        <div className="contact-card">
          <Globe size={36} className="contact-icon" />
          <h3>Digital Presence & Updates</h3>
          <p><strong>@BlsrideOfficial</strong></p>
          <p>Service updates and announcements</p>
          <p>Customer success stories</p>
          <p>Fleet expansion notifications</p>
          <p>Industry news and insights</p>
          <p>Follow for exclusive offers</p>
        </div>
      </div>
    </section>
  );
}
