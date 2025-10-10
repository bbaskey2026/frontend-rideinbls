import React from "react";
import { FileText } from "lucide-react";
import "./Policies.css";

// ✅ Import local images
import guaranteeImage from "../assets/gu.png";
import cancellationImage from "../assets/jhu.png";
import pricingImage from "../assets/price.jpg";

const policiesData = [
  {
    id: 1,
    title: "On-Time Guarantee",
    description: "We prioritize punctuality. Vehicles arrive on schedule, ensuring timely pickups and drop-offs. Our advanced tracking system monitors traffic patterns and optimizes routes in real-time, so you never have to worry about being late.",
    image: guaranteeImage,
  },
  {
    id: 2,
    title: "Flexible Cancellations",
    description: "Cancel up to 2 hours before your scheduled pickup with zero fees. Premium users enjoy extended windows. We understand plans change, and we're here to accommodate your needs without penalties or hassle.",
    image: cancellationImage,
  },
  {
    id: 3,
    title: "Instant Refunds",
    description: "Refunds are processed automatically within 24 hours for eligible cancellations. No waiting, no paperwork, no stress. Your money returns to your account seamlessly, giving you complete peace of mind.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80", // External image
  },
  {
    id: 4,
    title: "Transparent Pricing",
    description: "No hidden charges. Fares are calculated upfront with all taxes and applicable fees included. What you see is what you pay - we believe in complete transparency and honest business practices.",
    image: pricingImage,
  },
];

export default function Policies() {
  return (
    <section id="policies" className="policies-section">
      <div className="section-header">
        <h2>Our Service Policies</h2>
        <p>Simple, transparent, and customer-friendly guidelines</p>
      </div>

      <div className="policies-container">
        {policiesData.map((policy, index) => (
          <div 
            key={policy.id} 
            className={`policy-row ${index % 2 === 0 ? 'image-right' : 'image-left'}`}
          >
            <div className="policy-content">
              <div className="policy-icon">
                <FileText size={40} />
              </div>
              <h3>{policy.title}</h3>
              <p>{policy.description}</p>
            </div>
            <div className="policy-image">
              <img 
                src={policy.image} 
                alt={policy.title}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
