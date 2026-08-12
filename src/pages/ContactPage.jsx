import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Wedding",
    eventDate: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    // Replace with your actual submit logic (API call, Formspree, etc.)
    setTimeout(() => {
      setStatus("sent");
    }, 900);
  }

  return (
    <main className="contact-page" id="top">
      {/* Banner */}
      <section className="contact-banner">
        <div className="contact-banner__content">
          <p className="eyebrow eyebrow--light">Contact</p>
          <h1>
            Let's talk about <em>your day</em>
          </h1>
          <p className="contact-banner__lede">
            Share a few details — date, city, and what you'd like covered.
            I'll get back to you soon.
          </p>
        </div>
      </section>

      {/* Form + map */}
      <section className="contact-body">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__grid">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <span className="field__corner field__corner--tl" />
              <span className="field__corner field__corner--br" />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="00000000000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="eventType">Event type</label>
              <select
                id="eventType"
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
              >
                <option>Wedding</option>
                <option>Pre-wedding</option>
                <option>Maternity</option>
                <option>Birthday</option>
                <option>Family</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="eventDate">Event date</label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Mumbai"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="field field--full">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell me a little about your day..."
                value={form.message}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn contact-form__submit"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Sending…"
              : status === "sent"
              ? "Sent ✓"
              : "Send enquiry"}
          </button>
        </form>
      </section>

      {/* Map — full width, at the end of the page */}
      <section className="contact-map">
        <iframe
          title="Studio location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.699!2d72.8347!3d18.9219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce35a2f7e7a5%3A0x0!2sGateway%20of%20India!5e0!3m2!1sen!2sin!4v1690000000000"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="contact-map__label">Nashik, India</div>
      </section>
    </main>
  );
}