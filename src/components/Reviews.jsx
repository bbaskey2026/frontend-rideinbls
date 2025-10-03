import React from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./Reviews.css";

const reviewsData = [
  {
    id: 1,
    rating: 5,
    text: "Exceptional service quality with professional drivers and well-maintained vehicles. The booking platform is intuitive and the real-time tracking feature provides excellent transparency.",
    name: "Suman Behera",
    role: "Senior Manager",
    location: "Corporate Client - Balasore, Odisha",
  },
  {
    id: 2,
    rating: 5,
    text: "Outstanding fleet management and operational efficiency. Vehicles are impeccably clean, drivers are courteous, and the pricing is transparent.",
    name: "Rohit Nayak",
    role: "Business Owner",
    location: "Premium Customer - Baripada, Odisha",
  },
  {
    id: 3,
    rating: 5,
    text: "Had a vehicle breakdown situation at midnight during an emergency medical trip, and their response team arranged alternative transportation within 8 minutes.",
    name: "Dr. Anita Patra",
    role: "Healthcare Professional",
    location: "Medical Services Partner - Bhadrak, Odisha",
  },
  {
    id: 4,
    rating: 4,
    text: "Coordinated a multi-vehicle booking for our family wedding event. The coordination team managed 8 different vehicles seamlessly with centralized billing.",
    name: "Rakesh Sahoo",
    role: "Event Coordinator",
    location: "Group Booking Client - Jaleswar, Odisha",
  },
  {
    id: 5,
    rating: 5,
    text: "The platform is user-friendly with accessibility features. The mobile app works flawlessly, and the web dashboard provides detailed trip history and expense tracking.",
    name: "Priyanka Routray",
    role: "IT Professional",
    location: "Technology User - Cuttack, Odisha",
  },
  {
    id: 6,
    rating: 5,
    text: "Financial transparency and multiple payment options make this platform ideal for corporate use. The automated invoicing system with GST compliance has streamlined our budget management.",
    name: "Subhasis Mohanty",
    role: "Finance Director",
    location: "Corporate Account Manager - Balangir, Odisha",
  },
];

// Helper to generate initials
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

function Reviews() {
  return (
    <section id="reviews" className="reviews-section">
      <div className="section-header">
        <h2>Customer Success Stories & Testimonials</h2>
        <p>Authentic experiences from our verified customer base</p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="reviews-swiper"
      >
        {reviewsData.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < review.rating ? "black" : "#ccc"}
                    className={i < review.rating ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="reviewer">
                <div className="reviewer-avatar">
                  {getInitials(review.name)}
                </div>
                <div>
                  <strong>
                    {review.name}, {review.role}
                  </strong>
                  <span>{review.location}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Reviews;
