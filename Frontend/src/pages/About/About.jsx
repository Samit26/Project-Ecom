import "./About.css";

const About = () => {
  return (
    <div className="page">
      <h1 className="section-title">About AJEET LIGHTS</h1>

      <div className="about-content">
        <h2>We Light Up Your Homes Since 2010</h2>
        <p>
          AJEET LIGHTS started with a simple mission: to provide high-quality,
          energy-efficient lighting solutions that enhance the beauty and
          functionality of homes across India. What began as a small family
          business has grown into one of the most trusted lighting brands in the
          country.
        </p>

        <p>
          We believe that lighting is not just about illumination—it's about
          creating ambiance, enhancing mood, and transforming spaces. That's why
          we carefully curate our collection to include the latest trends in
          lighting design, from modern smart lights to classic chandeliers.
        </p>

        <p>
          Our team of lighting experts works closely with manufacturers to
          ensure every product meets our strict quality standards. We're
          committed to sustainability, which is why over 90% of our products are
          energy-efficient LEDs.
        </p>

        <div className="about-stats">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>50,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-lightbulb"></i>
            <h3>2,500+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>150+</h3>
            <p>Cities Served</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-trophy"></i>
            <h3>12+</h3>
            <p>Industry Awards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
