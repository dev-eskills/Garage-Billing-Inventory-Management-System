 import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wrench,
  ShieldCheck,
  Zap,
  Award,
  Heart,
  Star,
  Target,
} from "lucide-react";

const garageImages = [
  {
    url: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Expert Mechanic at Work",
  },
  {
    url: "https://images.pexels.com/photos/4489741/pexels-photo-4489741.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Engine Repair Specialists",
  },
  {
    url: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Modern Diagnostic Tools",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "100% Transparent Billing",
    desc: "Koi hidden charge nahi. Jo repair hua, wahi bill mein — bilkul clear.",
  },
  {
    icon: Zap,
    title: "Express Service",
    desc: "Aapki gadi jaldi tayar, kyunki aapka time bahut keemti hai.",
  },
  {
    icon: Award,
    title: "Certified Mechanics",
    desc: "Sab mechanics trained hain — koi compromise nahi quality par.",
  },
  {
    icon: Wrench,
    title: "Genuine Parts Only",
    desc: "Duplicate parts? Kabhi nahi. Sirf original, trusted parts use hote hain.",
  },
];

const impactStats = [
  {
    label: "Trusted Workshops",
    val: "500+",
    desc: "Poore MP mein sabse tezi se badhta network.",
  },
  {
    label: "Digital Invoices",
    val: "1M+",
    desc: "Paperless billing se bachat aur speed.",
  },
  {
    label: "Happy Mechanics",
    val: "2000+",
    desc: "Jo ab technology ke saath smart kaam kar rahe hain.",
  },
  {
    label: "Support Available",
    val: "24/7",
    desc: "Moin Motors team hamesha aapke saath hai.",
  },
];

export default function AboutPage() {
  return (
    <div
      style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "90px" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ap-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; }
        .ap-mosaic { display: grid; grid-template-columns: 1.1fr 1fr; grid-template-rows: 1fr 1fr; gap: 1rem; }
        .ap-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        .ap-gallery { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; }
        .ap-timeline { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; align-items: stretch; }
        .ap-stat-card { background: white; border: 1px solid #F0F0F0; border-radius: 20px; padding: 1.8rem; textAlign: center; display: flex; flex-direction: column; justify-content: center; transition: transform 0.3s ease; }
        .ap-stat-card:hover { transform: translateY(-5px); border-color: var(--accent-red); }
        @media (max-width: 768px) {
          .ap-hero { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .ap-mosaic { grid-template-columns: 1fr 1fr !important; }
          .ap-values { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .ap-gallery { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .ap-timeline { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .ap-tall { height: 230px !important; }
          .ap-sm { height: 107px !important; }
          .ap-gimg { height: 180px !important; }
        }
        @media (max-width: 480px) {
          .ap-gallery { grid-template-columns: 1fr !important; }
          .ap-timeline { grid-template-columns: 1fr !important; }
        }
      `,
        }}
      />

      {/* HERO */}
      <section
        style={{
          padding: "4rem 0",
          background: "#FDFDFD",
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <div className="container-pro">
          <div className="ap-hero">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="badge-pro">
                <Target size={12} /> Hamare Baare Mein
              </div>
              <h1
                style={{
                  fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
                  lineHeight: 1.1,
                  marginBottom: "1.3rem",
                }}
              >
                Moin Motors —{" "}
                <span style={{ color: "var(--accent-red)" }}>
                  Dewas ka Sabse Modern Garage.
                </span>
              </h1>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#555",
                  lineHeight: 1.75,
                  marginBottom: "1.2rem",
                }}
              >
                Jab <strong style={{ color: "#111" }}>Moin Bhai</strong> ne
                Dewas mein apna setup shuru kiya, unka ek hi sapna tha — ki har
                gadi ki repair digital transparency ke saath ho. Purane tarike
                chhodo, ab smart bano.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#666",
                  lineHeight: 1.75,
                  marginBottom: "2rem",
                }}
              >
                Aaj{" "}
                <strong style={{ color: "#111" }}>
                  Moin Motors Garage World
                </strong>{" "}
                Dewas ki pehchan ban chuka hai. Hum sirf gadi theek nahi karte,
                hum trust build karte hain technology ke saath.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                {[
                  { val: "14+", label: "Saal ka Experience" },
                  { val: "500+", label: "Happy Customers" },
                  { val: "200+", label: "Gadiyan/Month" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 900,
                        color: "var(--accent-red)",
                        lineHeight: 1,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: "#999",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="ap-mosaic">
                <div
                  style={{
                    gridRow: "span 2",
                    borderRadius: "22px",
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Mechanic"
                    className="ap-tall"
                    style={{
                      width: "100%",
                      height: "420px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ borderRadius: "18px", overflow: "hidden" }}>
                  <img
                    src="https://images.pexels.com/photos/4489741/pexels-photo-4489741.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Engine repair"
                    className="ap-sm"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ borderRadius: "18px", overflow: "hidden" }}>
                  <img
                    src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Garage"
                    className="ap-sm"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  background: "#111",
                  borderRadius: "14px",
                  padding: "1rem 1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--accent-red)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Heart size={17} color="white" fill="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: "0.85rem",
                    }}
                  >
                    AutoBill Pro Certified Partner
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.7rem",
                    }}
                  >
                    Moin Motors — Official Digital Workshop
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container-pro">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="badge-pro" style={{ margin: "0 auto 0.8rem" }}>
              <Wrench size={12} /> Workshop Gallery
            </div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                lineHeight: 1.1,
              }}
            >
              Hamare Garage ki{" "}
              <span style={{ color: "var(--accent-red)" }}>Asli Jhalak.</span>
            </h2>
          </div>
          <div className="ap-gallery">
            {garageImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="ap-gimg"
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem 1.2rem",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      margin: 0,
                    }}
                  >
                    {img.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: "4rem 0", background: "#FDFDFD" }}>
        <div className="container-pro">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="badge-pro" style={{ margin: "0 auto 0.8rem" }}>
              <ShieldCheck size={12} /> Hamare Values
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)" }}>
              Kyun Choose Karein{" "}
              <span style={{ color: "var(--accent-red)" }}>Moin Motors?</span>
            </h2>
          </div>
          <div className="ap-values">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "#fff",
                  border: "1px solid #F0F0F0",
                  borderRadius: "20px",
                  padding: "1.8rem",
                  display: "flex",
                  gap: "1.2rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(230,57,70,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-red)",
                    flexShrink: 0,
                  }}
                >
                  <v.icon size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      marginBottom: "0.3rem",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "#666",
                      lineHeight: 1.6,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION (Trending replacement for Timeline) */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container-pro">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)" }}>
              Hamara <span style={{ color: "var(--accent-red)" }}>Impact.</span>
            </h2>
          </div>
          <div className="ap-timeline">
            {impactStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="ap-stat-card"
              >
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    color: "var(--accent-red)",
                    marginBottom: "0.5rem",
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    color: "#111",
                  }}
                >
                  {s.label}
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container-pro">
          <div
            style={{
              background: "#111",
              borderRadius: "28px",
              padding: "3.5rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20%",
                right: "-5%",
                width: "250px",
                height: "250px",
                background: "rgba(230,57,70,0.15)",
                borderRadius: "50%",
                filter: "blur(60px)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "clamp(1.5rem, 4vw, 2.3rem)",
                  marginBottom: "1rem",
                  lineHeight: 1.1,
                }}
              >
                Ready to Go Digital?
                <br />
                <span style={{ color: "var(--accent-red)" }}>
                  Moin Motors Standard Apnao.
                </span>
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                }}
              >
                AutoBill Pro ke saath apne garage ko India ka sabse smart
                workshop banao.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/contact"
                  style={{
                    padding: "13px 32px",
                    fontSize: "0.9rem",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  Humse Baat Karein
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
