 import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Car,
  Bike,
  Wrench,
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Droplets,
} from "lucide-react";

const detailedServices = [
  {
    title: "Expert Car Diagnostics",
    subtitle: "Digital Accuracy",
    desc: "Hum latest computer scanning tools use karte hain taaki aapki gadi ka har chhota fault pakda ja sake. Moin Motors standard matlab zero guesswork.",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000",
    points: ["ECU Scanning", "Sensor Testing", "Electrical Checks"],
    reversed: false,
  },
  {
    title: "Superbike & Bike Specialist",
    subtitle: "Precision Tuning",
    desc: "Har bike ki rarfataar alag hoti hai. Hum Dewas mein har tarah ki bikes (Sport, Cruiser, Daily) ki deep service karte hain — chain tuning se lekar engine calibration tak.",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000",
    points: ["Engine Tuning", "Clutch Adjustment", "Safety Check"],
    reversed: true,
  },
  {
    title: "Engine & Mechanical Work",
    subtitle: "Master Mechanics",
    desc: "Moin Bhai ki 14 saal ki legacy har mechanic ke kaam mein dikhti hai. Engine overhaul ho ya suspension fix, hum sirf genuine parts use karte hain.",
    img: "https://www.ecmrepairtrainingindia.com/assets/img/programs/mechanical-training.webp",
    points: ["Engine Overhaul", "Gearbox Repair", "Suspension Fix"],
    reversed: false,
  },
  {
    title: "Premium Painting & Denting",
    subtitle: "Showroom Finish",
    desc: "Aapki gadi ko phir se naya banate hain. Hum high-quality paints aur ceramic coating use karte hain taaki showroom wali shine wapas aa jaye.",
    img: "https://res.cloudinary.com/jerrick/image/upload/v1694681110/6502c8169c0f45001d69df95.jpg",
    points: ["Ceramic Coating", "Scratch Removal", "Teflon Coating"],
    reversed: true,
  },
];

export default function ServicesPage() {
  return (
    <div
      style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "40px" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .serv-hero { padding: 5rem 0; background: #FAFAFA; text-align: center; }
        .serv-grid-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: -60px; position: relative; z-index: 10; }
        .serv-mini-card { background: white; padding: 2rem; border-radius: 24px; box-shadow: 0 15px 40px rgba(0,0,0,0.05); border: 1px solid #F0F0F0; text-align: center; }
        .serv-row { display: grid; grid-template-columns: 1fr 1.1fr; gap: 5rem; align-items: center; padding: 5rem 0; }
        .serv-img-wrap { 
          border-radius: 24px; 
          overflow: hidden; 
          width: 100%;
          aspect-ratio: 4 / 3; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.06); 
          border: 1px solid #F0F0F0;
          background: #F9F9F9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .serv-img-wrap img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s ease; padding: 5px; }
        .serv-img-wrap:hover img { transform: scale(1.03); }
        
        @media (max-width: 991px) {
          .serv-grid-box { grid-template-columns: 1fr 1fr !important; padding: 0 20px; }
          .serv-row { grid-template-columns: 1fr !important; gap: 2.5rem !important; text-align: center; }
          .serv-points { justify-content: center; }
          .serv-img-wrap { height: 320px !important; order: -1 !important; }
        }
        @media (max-width: 480px) {
          .serv-grid-box { grid-template-columns: 1fr !important; }
        }
      `,
        }}
      />

      {/* Hero Header */}
      <section className="serv-hero">
        <div className="container-pro">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="badge-pro" style={{ margin: "0 auto 1.5rem" }}>
              <Settings size={12} /> Institutional Services
            </div>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              Moin Motors{" "}
              <span style={{ color: "var(--accent-red)" }}>
                Service Standards.
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#666",
                maxWidth: "650px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Dewas mein car aur bike repair ka naya level. Hum quality,
              technology aur digital transparency par koi compromise nahi karte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4 BOX COLUMN - FIXED ALIGNMENT */}
      <div className="container-pro">
        <div className="serv-grid-box">
          {[
            { icon: Car, title: "Cars", val: "Expert Care" },
            { icon: Bike, title: "Bikes", val: "Precision Tuning" },
            { icon: Wrench, title: "Parts", val: "100% Genuine" },
            { icon: ShieldCheck, title: "Trust", val: "Transparent" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="serv-mini-card"
            >
              <div
                style={{
                  color: "var(--accent-red)",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <item.icon size={32} />
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  marginBottom: "0.3rem",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#999",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {item.val}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DETAILED SERVICES - SIDE BY SIDE */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container-pro">
          {detailedServices.map((s, i) => (
            <div
              key={i}
              className="serv-row"
              style={{ direction: s.reversed ? "rtl" : "ltr" }}
            >
              <motion.div
                initial={{ opacity: 0, x: s.reversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ direction: "ltr" }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "var(--accent-red)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.8rem",
                  }}
                >
                  {s.subtitle}
                </div>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: "1.5rem",
                  }}
                >
                  {s.title}
                </h2>
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "#555",
                    lineHeight: 1.7,
                    marginBottom: "2rem",
                  }}
                >
                  {s.desc}
                </p>
                <div
                  className="serv-points"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  {s.points.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#111",
                      }}
                    >
                      <CheckCircle2 size={18} color="var(--accent-red)" /> {p}
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="btn-red"
                  style={{
                    padding: "14px 36px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Consult Experts <ArrowRight size={18} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="serv-img-wrap"
              >
                <img src={s.img} alt={s.title} />
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "6rem 0", background: "#111" }}>
        <div className="container-pro" style={{ textAlign: "center" }}>
          <h2
            style={{
              color: "white",
              fontSize: "3rem",
              fontWeight: 900,
              marginBottom: "1.5rem",
            }}
          >
            Moin Motors <br />
            Standard Apnao.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
            }}
          >
            Ab Dewas mein car service ke liye darna nahi, digital billing aur
            transparency ka faida uthao.
          </p>
          <Link
            to="/contact"
            className="btn-red"
            style={{
              padding: "16px 48px",
              fontSize: "1.1rem",
              textDecoration: "none",
            }}
          >
            Free Demo Book Karein
          </Link>
        </div>
      </section>
    </div>
  );
}
