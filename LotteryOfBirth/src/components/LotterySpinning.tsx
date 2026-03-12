
import React from "react";
import { COUNTRIES } from "../data/countries";

interface Props {
  stage: "welcome" | "spinning" | "reveal" | "simulator";
  rotation: number;
  setStage: any;
  handleSpin: () => void;
}

const LotterySpinning = ({ stage, rotation, setStage, handleSpin }: Props) => {

  const isSpinning = rotation !== 0;

  return (
    <>
      {(stage === "welcome" || stage === "spinning" || stage === "reveal") && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >

          {/* ---------------- WELCOME SCREEN ---------------- */}

          {stage === "welcome" && (
            <div
              style={{
                textAlign: "center",
                zIndex: 10,
                animation: "fadeIn 1.5s ease-out",
              }}
            >
              <h1
                style={{
                  fontSize: "6rem",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  margin: 0,
                  lineHeight: 0.9,
                }}
              >
                THE <span style={{ color: "#6366f1" }}>LOTTERY</span> <br /> OF BIRTH
              </h1>

              <div style={{ marginTop: "2rem", maxWidth: "720px" }}>

                <p
                  style={{
                    color: "#8a8a8a",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    animation: "fadeIn 2s ease-out",
                  }}
                >
                  Every human life begins with a roll of the dice.
                </p>

                <p
                  style={{
                    color: "#7a7a7a",
                    fontSize: "1.2rem",
                    marginTop: "1rem",
                    lineHeight: 1.6,
                    animation: "fadeIn 2s ease-out 2s",
                    animationFillMode: "both",
                  }}
                >
                  The country you are born in can shape your chances of survival,
                  education, income, and how long you live.
                </p>

                <p
                  style={{
                    color: "#b0b0b0",
                    fontSize: "1.2rem",
                    marginTop: "1rem",
                    fontWeight: 600,
                    animation: "fadeIn 2s ease-out 6s",
                    animationFillMode: "both",
                  }}
                >
                  What if your life had started somewhere else?
                </p>

              </div>

              <button
                onClick={() => setStage("spinning")}
                style={{
                  marginTop: "4rem",
                  padding: "1.4rem 4.5rem",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.3s transform",
                  boxShadow: "0 0 40px rgba(99,102,241,0.4)",
                  animation: "fadeIn 2s ease-out 8s",
                  animationFillMode: "both",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.06)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Begin
              </button>
            </div>
          )}

          {/* ---------------- SPINNING WHEEL ---------------- */}

          {stage === "spinning" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "fadeIn 1s",
              }}
            >
              <div style={{ position: "relative", width: "600px", height: "600px" }}>

                {/* POINTER */}
                <div
                  style={{
                    position: "absolute",
                    top: "-22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "22px solid transparent",
                    borderRight: "22px solid transparent",
                    borderTop: "45px solid #fff",
                    zIndex: 100,
                    filter: isSpinning
                      ? "drop-shadow(0 0 20px rgba(255,255,255,0.9))"
                      : "drop-shadow(0 6px 18px rgba(0,0,0,0.8))",
                    transition: "0.4s",
                  }}
                />

                {/* WHEEL */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: "12px solid #1a1a1a",
                    position: "relative",
                    overflow: "hidden",
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 4.8s cubic-bezier(.08,.8,.2,1)",
                    background: `conic-gradient(${COUNTRIES.map(
                      (c, i) =>
                        `${c.color} ${i * 18}deg ${(i + 1) * 18}deg`
                    ).join(", ")})`,
                    boxShadow: isSpinning
                      ? "0 0 120px rgba(99,102,241,0.35), inset 0 0 60px rgba(0,0,0,0.7)"
                      : "0 0 80px rgba(99,102,241,0.2), inset 0 0 40px rgba(0,0,0,0.6)",
                  }}
                >

                  {COUNTRIES.map((c, i) => (
                    <React.Fragment key={i}>

                      {/* segment line */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "50%",
                          height: "1px",
                          backgroundColor: "rgba(0,0,0,0.25)",
                          transformOrigin: "left center",
                          transform: `rotate(${i * 18}deg)`,
                          zIndex: 5,
                        }}
                      />

                      {/* label */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "50%",
                          height: "1px",
                          transformOrigin: "left center",
                          transform: `rotate(${i * 18 + 9}deg)`,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            right: "28px",
                            top: "-7px",
                            fontSize: "10px",
                            fontWeight: 900,
                            color: "#fff",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {c.name}
                        </span>
                      </div>

                    </React.Fragment>
                  ))}

                  {/* CENTER HUB */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#000",
                      borderRadius: "50%",
                      border: "4px solid #fff",
                      zIndex: 40,
                      boxShadow: isSpinning
                        ? "0 0 20px rgba(255,255,255,0.4) inset"
                        : "inset 0 0 25px rgba(0,0,0,0.8)",
                    }}
                  />

                </div>
              </div>

              {!isSpinning && (
                <>
                  <p
                    style={{
                      marginTop: "2rem",
                      color: "#9a9a9a",
                      fontSize: "1rem",
                      letterSpacing: "0.08em",
                      animation: "fadeIn 1.5s",
                    }}
                  >
                    Spin the wheel to determine where you are born
                  </p>

                  <button
                    onClick={handleSpin}
                    style={{
                      marginTop: "2rem",
                      padding: "1.2rem 4.5rem",
                      backgroundColor: "#6366f1",
                      color: "#fff",
                      borderRadius: "15px",
                      fontWeight: 900,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.3rem",
                      boxShadow: "0 10px 40px rgba(99,102,241,0.4)",
                      letterSpacing: "0.1em",
                      transition: "0.25s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    SPIN THE WHEEL
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LotterySpinning;