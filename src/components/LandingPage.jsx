import React from "react";
import {
  MapPin, Car, Users, Shield, Globe, Star, FileText,
  Clock, Phone, CreditCard, Award, Zap, Heart,
  TrendingUp, CheckCircle, ArrowRight, Menu, X, User, LogOut
} from "lucide-react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import BrandLoader from "./BrandLoader";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { user, token, logout, loading } = React.useContext(AuthContext);


  const UserBookings=()=>{
navigate("/admin/userbookings")
  }
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle navigation with React Router
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Handle scroll to section
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (

      <BrandLoader
        name="BLSRide"
        caption="Loading Please wait..."
        overlay={true}       // transparent overlay
        textColor="#111"
        size="60px"
      />

    );
  }

  // Render navigation for logged out users
  const renderGuestNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleScrollToSection("services")} className="nav-link-btn">Services</button>
      <button onClick={() => handleScrollToSection("why-us")} className="nav-link-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="nav-link-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="nav-link-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="nav-link-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="nav-link-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="nav-link-btn register-link">Register</button>
    </div>
  );

  // Render navigation for normal logged in users
  const renderUserNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleScrollToSection("services")} className="nav-link-btn">Services</button>
      <button onClick={() => handleNavigation("/dashboard")} className="nav-link-btn">Dashboard</button>
      <button onClick={() => handleNavigation("/bookings")} className="nav-link-btn">My Bookings</button>
      <button onClick={() => handleNavigation("/profile")} className="nav-link-btn">Profile</button>
      <div className="user-menu">
        <User size={20} />
        <span>Hello, {user?.name || "User"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );

  // Render navigation for admins
  const renderAdminNavigation = () => (
    <div className="nav-links">
      <button onClick={() => handleNavigation("/admin")} className="nav-link-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="nav-link-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="nav-link-btn">Manage Users</button>
      <div className="user-menu">
        <User size={20} />
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );

  // Render mobile menu for guests
  const renderGuestMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleScrollToSection("services")} className="mobile-nav-btn">Services</button>
      <button onClick={() => handleScrollToSection("why-us")} className="mobile-nav-btn">Why Us</button>
      <button onClick={() => handleScrollToSection("cities")} className="mobile-nav-btn">Cities</button>
      <button onClick={() => handleScrollToSection("reviews")} className="mobile-nav-btn">Reviews</button>
      <button onClick={() => handleScrollToSection("policies")} className="mobile-nav-btn">Policies</button>
      <button onClick={() => handleNavigation("/login")} className="mobile-nav-btn">Login</button>
      <button onClick={() => handleNavigation("/register")} className="mobile-nav-btn">Register</button>
    </div>
  );

  // Render mobile menu for normal users
  const renderUserMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleScrollToSection("services")} className="mobile-nav-btn">Services</button>
      <button onClick={() => handleNavigation("/dashboard")} className="mobile-nav-btn">Dashboard</button>
      <button onClick={() => handleNavigation("/bookings")} className="mobile-nav-btn">My Bookings</button>
      <button onClick={() => handleNavigation("/profile")} className="mobile-nav-btn">Profile</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "User"}</span>
        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );

  // Render mobile menu for admins
  const renderAdminMobileMenu = () => (
    <div className="mobile-menu">
      <button onClick={() => handleNavigation("/admin")} className="mobile-nav-btn">Admin Panel</button>
      <button onClick={() => handleNavigation("/admin/vehicles")} className="mobile-nav-btn">Manage Vehicles</button>
      <button onClick={() => handleNavigation("/admin/users")} className="mobile-nav-btn">Manage Users</button>
      <div className="mobile-user-info">
        <span>Hello, {user?.name || "Admin"}</span>
        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="landing-container">
      <nav className="navbar">
        <h2 className="logo">Blsride</h2>

        {/* Desktop Navigation */}
        {user && token ? (
          user.role === "admin"
            ? renderAdminNavigation()
            : renderUserNavigation()
        ) : (
          renderGuestNavigation()
        )}

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
          (user && token
            ? user.role === "admin"
              ? renderAdminMobileMenu()
              : renderUserMobileMenu()
            : renderGuestMobileMenu())}
      </nav>




      {/* Hero Section */}
      <section className="hero-section">

 <div className="hero-badge">
            <Award size={16} />
            <span>Odisha's #1 Vehicle Booking Platform - Licensed & Certified</span>
          </div>
<button onClick={UserBookings}>
  UserBookings
</button>

<div className="hero-buttons">
            <button
              onClick={() =>
                handleNavigation(
                  user && token && user.role !== "admin" ? `/find-route?user=${encodeURIComponent(user.name)}` : "/login"
                )
              }
              disabled={user?.role === "admin"} // disable button if admin
              className={`hero-button primary ${user?.role === "admin" ? "disabled" : ""}`}
            >
              {user && token
                ? user.role === "admin"
                  ? "Administrative Account - Booking Restricted"
                  : "Book Now"
                : "Login to Access Platform"}{" "}
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() =>
                handleNavigation(user?.role === "admin" ? "/admin/dashboard" : "/vehicles")
              }
              className="hero-button secondary"
            >
              {user?.role === "admin" ? "System Administration Panel" : "Browse Fleet Catalog"}
            </button>

          </div>


















        <div className="hero-content">
         
          <h1>Premium Vehicle Booking Platform for Modern Transportation</h1>
          <p>Experience seamless, technology-driven mobility solutions with our comprehensive fleet management system. Book from 10,000+ professionally maintained and GPS-tracked vehicles across 50+ cities with enterprise-grade security and 24/7 operational support.</p>
          <div className="hero-stats">
            <div className="stat">
              <strong>50,000+</strong>
              <span>Verified Customers</span>
            </div>
            <div className="stat">
              <strong>50+</strong>
              <span>Service Cities</span>
            </div>
            <div className="stat">
              <strong>10,000+</strong>
              <span>Active Vehicles</span>
            </div>
            <div className="stat">
              <strong>99.8%</strong>
              <span>Uptime Guarantee</span>
            </div>
          </div>
          
        </div>
      </section>



      {/* Why Choose Us Section */}
      <section id="why-us" className="why-section">
        <div className="section-header">
          <h2>Industry-Leading Transportation Platform</h2>
          <p>Technological excellence meets operational efficiency in Odisha's most trusted mobility ecosystem</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <Star size={28} />
            <h3>Market-Leading Trust Score</h3>
            <p>Consistently maintaining 4.8/5 customer satisfaction rating across 50,000+ completed journeys. Verified by independent customer feedback systems and third-party review platforms with transparent rating methodology and authentic customer testimonials.</p>
          </div>
          <div className="why-card">
            <Globe size={28} />
            <h3>Comprehensive Regional Coverage</h3>
            <p>Strategic presence across 50+ cities in Odisha with expansion into neighboring states. Standardized service quality protocols ensuring consistent experience across all locations. Local partnerships and regional expertise for optimized service delivery.</p>
          </div>
          <div className="why-card">
            <MapPin size={28} />
            <h3>Precision Location Services</h3>
            <p>Advanced GPS integration with real-time tracking accuracy within 3 meters. Smart address recognition, landmark-based pickup points, and automated route optimization. Multi-stop journey planning with efficient waypoint management and time estimation.</p>
          </div>
          <div className="why-card">
            <TrendingUp size={28} />
            <h3>Dynamic Pricing Intelligence</h3>
            <p>Transparent, algorithm-driven pricing with no hidden charges or surprise fees. Real-time fare calculation based on distance, time, and demand patterns. Corporate discount programs, loyalty rewards, and bulk booking incentives with detailed cost breakdowns.</p>
          </div>
          <div className="why-card">
            <CheckCircle size={28} />
            <h3>Certified Driver Network</h3>
            <p>Rigorous driver onboarding process including background verification, license validation, medical clearance, and professional training programs. Continuous performance monitoring, customer feedback integration, and regular skill enhancement workshops.</p>
          </div>
          <div className="why-card">
            <Heart size={28} />
            <h3>Customer-Centric Excellence</h3>
            <p>Dedicated customer success programs with personalized service experiences, proactive issue resolution, and continuous improvement based on feedback analytics. VIP customer tiers, priority support channels, and customized mobility solutions for special requirements.</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="reviews-section">
        <div className="section-header">
          <h2>Customer Success Stories & Professional Testimonials</h2>
          <p>Authentic experiences from our verified customer base across various service segments</p>
        </div>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
            </div>
            <p>"Exceptional service quality with professional drivers and well-maintained vehicles. The booking platform is intuitive and the real-time tracking feature provides excellent transparency. Customer support response time is impressive - they resolved my query within 5 minutes during a late-night booking."</p>
            <div className="reviewer">
              <strong>Suman Behera, Senior Manager</strong>
              <span>Corporate Client - Balasore, Odisha</span>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
            </div>
            <p>"Outstanding fleet management and operational efficiency. The vehicles are impeccably clean, drivers are courteous and professional, and the pricing is transparent with detailed invoicing. Blsride has transformed my daily business commute with reliable, punctual service that I can depend on for important client meetings."</p>
            <div className="reviewer">
              <strong>Rohit Nayak, Business Owner</strong>
              <span>Premium Customer - Baripada, Odisha</span>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
            </div>
            <p>"Their 24/7 customer support infrastructure is genuinely impressive. Had a vehicle breakdown situation at midnight during an emergency medical trip, and their response team arranged alternative transportation within 8 minutes. The level of care and professionalism during crisis situations sets them apart from competitors."</p>
            <div className="reviewer">
              <strong>Dr. Anita Patra, Healthcare Professional</strong>
              <span>Medical Services Partner - Bhadrak, Odisha</span>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
              <Star size={16} className="star-empty" />
            </div>
            <p>"Comprehensive vehicle selection with appropriate options for every requirement. Recently coordinated a multi-vehicle booking for our family wedding event - the coordination team managed 8 different vehicles seamlessly. The group booking dashboard and centralized billing made the entire process efficient and stress-free."</p>
            <div className="reviewer">
              <strong>Rakesh Sahoo, Event Coordinator</strong>
              <span>Group Booking Client - Jaleswar, Odisha</span>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
            </div>
            <p>"The technology platform is remarkably user-friendly with accessibility features that make booking simple for all age groups. The mobile app works flawlessly, and the web dashboard provides detailed trip history and expense tracking. Safety features including driver verification and real-time sharing give complete peace of mind to families."</p>
            <div className="reviewer">
              <strong>Priyanka Routray, IT Professional</strong>
              <span>Technology User - Cuttack, Odisha</span>
            </div>
          </div>
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="blue" className="star-filled" />
              ))}
            </div>
            <p>"Financial transparency and multiple payment integration options make this platform ideal for corporate use. The automated invoicing system with GST compliance, expense categorization, and detailed reporting has streamlined our company's transportation budget management. The corporate discount structure provides excellent value for bulk bookings."</p>
            <div className="reviewer">
              <strong>Subhasis Mohanty, Finance Director</strong>
              <span>Corporate Account Manager - Balangir, Odisha</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="cities-section">
        <div className="section-header">
          <h2>Strategic Service Network Across Odisha</h2>
          <p>Comprehensive regional coverage with standardized service quality and local operational expertise</p>
        </div>
        <div className="cities-grid">
          <div className="city-card">
            <h3>Balasore Metropolitan</h3>
            <p>150+ active vehicles | 24/7 operations</p>
            <p>Premium & economy fleet available</p>
          </div>
          <div className="city-card">
            <h3>Baripada District</h3>
            <p>120+ active vehicles | Express service</p>
            <p>Corporate partnerships established</p>
          </div>
          <div className="city-card">
            <h3>Bhadrak Region</h3>
            <p>100+ active vehicles | Full coverage</p>
            <p>Medical emergency priority service</p>
          </div>
          <div className="city-card">
            <h3>Jaleswar Township</h3>
            <p>80+ active vehicles | Local expertise</p>
            <p>Tourist & business travel specialists</p>
          </div>
          <div className="city-card">
            <h3>Cuttack Urban</h3>
            <p>200+ active vehicles | Metro service</p>
            <p>High-frequency short distance trips</p>
          </div>
          <div className="city-card">
            <h3>Bhubaneswar Capital</h3>
            <p>300+ active vehicles | Premium hub</p>
            <p>Airport & railway connectivity</p>
          </div>
        </div>
        <div className="cities-note">
          <p>+ 44 additional service locations with planned expansion into West Bengal, Jharkhand, and Andhra Pradesh. <button onClick={() => handleScrollToSection('contact')} className="link-btn">Submit expansion request for your city</button></p>
        </div>
      </section>



      {/* Policies Section */}
      <section id="policies" className="policies-section">
        <div className="section-header">
          <h2>Comprehensive Service Policies & Guidelines</h2>
          <p>Transparent operational standards ensuring consistent service excellence and customer protection</p>
        </div>
        <div className="policies-grid">
          <div className="policy-card">
            <FileText size={32} />
            <h3>Advanced Booking Management</h3>
            <p>
              Multi-channel booking platform supporting web, mobile app, phone, and corporate dashboard access. Real-time availability checking with instant confirmation systems. Advanced scheduling features including recurring bookings, group reservations, and corporate account management. Detailed booking modification options with flexible timing adjustments. Priority booking privileges for verified premium customers with guaranteed vehicle allocation during peak demand periods.
            </p>
          </div>
          <div className="policy-card">
            <FileText size={32} />
            <h3>Flexible Cancellation Framework</h3>
            <p>
              Tiered cancellation policy with free cancellation up to 2 hours before scheduled pickup for standard bookings. Premium customers enjoy extended cancellation windows with minimal fees. Emergency cancellation protocols for medical, family, or business emergencies handled with compassionate consideration. Automated refund processing within 24-48 hours directly to original payment method. Weather-related or service disruption cancellations processed with full refunds and alternative arrangement assistance.
            </p>
          </div>
          <div className="policy-card">
            <FileText size={32} />
            <h3>Transparent Pricing Structure</h3>
            <p>
              Algorithm-driven dynamic pricing model with complete transparency and zero hidden charges. Base fare structure includes vehicle type, distance calculation, time-based charges, and applicable taxes clearly displayed before booking confirmation. Surge pricing during peak hours indicated with percentage increases and estimated wait times. Corporate discount programs, loyalty rewards, and bulk booking incentives with detailed cost-benefit analysis. Real-time fare estimation with route optimization suggestions for cost-effective travel.
            </p>
          </div>
          <div className="policy-card">
            <FileText size={32} />
            <h3>Comprehensive Safety Protocols</h3>
            <p>
              Multi-layered safety framework including regular vehicle maintenance schedules, driver health monitoring, and real-time GPS tracking with emergency alert systems. All drivers undergo comprehensive background verification including police clearance, license validation, medical fitness certification, and professional training programs. 24/7 incident response team with direct emergency contact features. Insurance coverage exceeding industry standards with passenger protection and vehicle comprehensive coverage. Safety audit programs with third-party verification and continuous improvement protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Professional Customer Support & Business Development</h2>
          <p>Multi-channel communication infrastructure with dedicated support teams and business partnership opportunities</p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <Phone size={32} />
            <h3>24/7 Customer Support Hotline</h3>
            <p><strong>+91 8249 592 464</strong></p>
            <p>Emergency assistance available</p>
            <p>Multi-lingual support (English, Hindi, Odia)</p>
            <p>Average response time: Under 30 seconds</p>
            <p>Corporate dedicated line available</p>
          </div>
          <div className="contact-card">
            <FileText size={32} />
            <h3>Professional Email Support</h3>
            <a href="mailto:Rideinbls@gmail.com?subject=Business%20Inquiry%20-%20Blsride%20Transportation%20Services&body=Dear%20Blsride%20Team,%0A%0AI%20am%20interested%20in%20learning%20more%20about%20your%20professional%20transportation%20services%20and%20would%20like%20to%20discuss%20potential%20business%20requirements.%0A%0APlease%20provide%20detailed%20information%20about:%0A-%20Corporate%20account%20options%0A-%20Bulk%20booking%20discounts%0A-%20Service%20area%20coverage%0A-%20Vehicle%20fleet%20specifications%0A%0AThank%20you%20for%20your%20professional%20service.%0A%0ABest%20regards">Rideinbls@gmail.com</a>
            <p>Professional inquiry response: Within 2 hours</p>
            <p>Technical support: Within 4 hours</p>
            <p>Business partnerships: Within 24 hours</p>
            <p>Complaint resolution: Priority handling</p>
          </div>
          <div className="contact-card">
            <Globe size={32} />
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

    </div>
  );
}