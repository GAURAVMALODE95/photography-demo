import { useState } from "react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "./SocialIcons.jsx";
import { MessageCircle, Phone } from "lucide-react";
import { studio, socials } from "../data/site.js";

const iconMap = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  whatsapp: MessageCircle,
};

/** Google Maps embed — Gateway of India, Mumbai */
const MAP_EMBED =
  "https://maps.google.com/maps?q=Gateway%20of%20India%2C%20Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="section__head">
        <p className="eyebrow">Enquire</p>
        <h2>
          Let’s talk about <em>your day</em>
        </h2>
        <p className="lede">
          Share a few details — date, city, and what you’d like covered. I’ll
          get back to you soon.
        </p>
      </div>

      <div className="enquire-layout">
        <form className="enquire-form" onSubmit={onSubmit}>
          <label>
            <span>Name</span>
            <input name="name" type="text" required placeholder="Your name" />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              name="phone"
              type="tel"
              required
              placeholder="00000000000"
            />
          </label>
          <label>
            <span>Event type</span>
            <select name="event" defaultValue="Wedding">
              <option>Wedding</option>
              <option>Pre-wedding</option>
              <option>Maternity</option>
              <option>Birthday</option>
              <option>Family</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            <span>Event date</span>
            <input name="date" type="date" />
          </label>
          <label>
            <span>City</span>
            <input name="city" type="text" placeholder="Mumbai" />
          </label>
          <label className="enquire-form__full">
            <span>Message</span>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell me a little about your day…"
            />
          </label>

          {sent ? (
            <p className="enquire-form__thanks" role="status">
              Thank you — I’ve received your enquiry and will be in touch soon.
            </p>
          ) : (
            <button className="btn btn--solid enquire-form__submit" type="submit">
              Send enquiry
            </button>
          )}
        </form>

        <div className="enquire-map">
          <iframe
            title="Studio location map"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <p className="enquire-map__caption">Mumbai, India</p>
        </div>
      </div>

      <footer className="site-footer">
        <span>{studio.name}</span>
        <div className="site-footer__links">
          <a href={`tel:${studio.phone}`} aria-label="Call" title="Call">
            <Phone size={18} strokeWidth={1.6} />
          </a>
          {socials.map((s) => {
            const Icon = iconMap[s.id];
            return (
              <a
                key={s.id}
                href={
                  s.id === "whatsapp"
                    ? `https://wa.me/${studio.phone.replace(/\D/g, "")}`
                    : s.href
                }
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                <Icon size={18} strokeWidth={1.6} />
              </a>
            );
          })}
        </div>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
