"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Menu, X, Play, Shield, BarChart3, Users, Globe, Database, Sparkles, Cpu, Layers, Network, ChevronRight, Send, Github, Twitter, Linkedin
} from "lucide-react";

import "./landing.css";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Custom cursor logic
    let isMobile = (typeof window !== 'undefined' ? window.innerWidth : 1280) < 640;

    const handleMouseMove = (e) => {
      if (isMobile) return;
      if (cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        cursorRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const handleResize = () => {
      isMobile = (typeof window !== 'undefined' ? window.innerWidth : 1280) < 640;
      if (isMobile && cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.display = 'none';
        cursorRingRef.current.style.display = 'none';
      } else if (!isMobile && cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.display = 'block';
        cursorRingRef.current.style.display = 'block';
      }
    };

    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const features = [
    {
      title: "Neural Engine v4",
      description: "Ask questions in plain English. Our multi-model orchestration layer translates intent into production-grade analytics instantly.",
      icon: <Network style={{ stroke: 'var(--color-accent-primary)' }} />,
      badge: "State of the Art"
    },
    {
      title: "Protocol Security",
      description: "Zero-trust architecture with bank-grade encryption and end-to-end RLS integration.",
      icon: <Shield style={{ stroke: 'var(--color-accent-primary)' }} />
    },
    {
      title: "Live Synthesis",
      description: "Dashboards that don't just show data, they synthesize strategy as your numbers evolve.",
      icon: <BarChart3 style={{ stroke: 'var(--color-accent-primary)' }} />
    },
    {
      title: "Ecosystem Sync",
      description: "Native connectors for PostgreSQL, Snowflake, BigQuery, and enterprise spreadsheet clusters.",
      icon: <Database style={{ stroke: 'var(--color-accent-primary)' }} />
    },
    {
      title: "Team Governance",
      description: "Granular access controls and collaborative intelligence threads for elite teams.",
      icon: <Users style={{ stroke: 'var(--color-accent-primary)' }} />
    },
    {
      title: "Global Edge",
      description: "Sub-100ms response times globally, powered by our hyper-distributed intelligence network.",
      icon: <Globe style={{ stroke: 'var(--color-accent-primary)' }} />
    }
  ];

  return (
    <div ref={pageRef} className="landing-page" style={{ position: 'relative', width: '100%', minHeight: '100svh' }}>

      {/* Custom Cursors */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div ref={cursorRingRef} className="custom-cursor-ring" />

      {/* SECTION 3: NAVIGATION */}
      <nav
        className={isScrolled ? 'nav-scrolled' : ''}
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(3,3,10,0.85)',
          borderBottom: isScrolled ? '1px solid var(--color-border-glow)' : '1px solid var(--color-border-subtle)',
          transition: 'border-bottom 0.3s ease'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              color: 'var(--color-accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1.2rem', lineHeight: 1 }}>
                AskMyData<span style={{ color: 'var(--color-accent-cyan)' }}>.</span>
              </div>
              <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', lineHeight: 1, marginTop: '4px' }}>
                Intelligence OS
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 768 ? 'none' : 'flex', gap: '32px' }} className="nav-links">
            {['Features', 'Intelligence', 'Protocol', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="font-body text-sm text-secondary" style={{ textDecoration: 'none', position: 'relative' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.querySelector('span').style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.querySelector('span').style.width = '0';
                }}>
                {item}
                <span style={{
                  position: 'absolute', bottom: '-4px', left: 0, height: '2px',
                  background: 'var(--color-accent-primary)', width: '0',
                  transition: 'width 0.3s ease'
                }}></span>
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div style={{ display: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 768 ? 'none' : 'flex', gap: '16px', alignItems: 'center' }} className="nav-auth">
            <Link href="/login" style={{
              background: 'transparent', border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)', padding: '8px 20px', borderRadius: '6px',
              textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}>
              Login
            </Link>
            <Link href="/signup" style={{
              background: 'var(--gradient-cta)', color: 'white', fontWeight: 600,
              padding: '8px 22px', borderRadius: '6px', textDecoration: 'none',
              fontSize: '0.9rem', transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(108,99,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}>
              Launch App
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            style={{ display: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 768 ? 'none' : 'block', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, width: '100%',
            background: 'rgba(3,3,10,0.95)', backdropFilter: 'blur(20px)',
            padding: '24px', borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            {['Features', 'Intelligence', 'Protocol', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="font-body text-xl text-primary"
                style={{ textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <Link href="/login" style={{
                textAlign: 'center', background: 'transparent', border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)', padding: '12px 20px', borderRadius: '6px',
                textDecoration: 'none', fontWeight: 600
              }}>Login</Link>
              <Link href="/signup" style={{
                textAlign: 'center', background: 'var(--gradient-cta)', color: 'white',
                padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600
              }}>Launch App</Link>
            </div>
          </div>
        )}
      </nav>

      {/* SECTION 4: HERO */}
      <section style={{
        position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center',
        paddingTop: '80px', paddingBottom: '80px', overflow: 'hidden'
      }}>
        {/* Background Hero Orbs */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--gradient-hero)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px', top: '-100px', left: '-150px',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)',
          animation: 'float1 18s ease-in-out infinite', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', top: '20%', right: '-100px',
          background: 'radial-gradient(circle, rgba(0,229,255,0.07), transparent 70%)',
          animation: 'float2 22s ease-in-out infinite', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px', bottom: '10%', left: '30%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)',
          animation: 'float3 15s ease-in-out infinite', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>

          {/* Text Column */}
          <div style={{ flex: '1 1 500px', paddingRight: '40px', marginBottom: '60px' }}>
            <div className="reveal" style={{
              animationDelay: '0.1s', display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '24px'
            }}>
              <div style={{
                width: '8px', height: '8px', background: '#00FF88', borderRadius: '50%',
                boxShadow: '0 0 8px #00FF88', animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.15em' }}>
                Next-Gen Intelligence OS
              </span>
            </div>

            <h1 className="reveal font-display text-hero" style={{ animationDelay: '0.2s', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 24px 0' }}>
              <div style={{ color: 'var(--color-text-primary)' }}>Deep Data</div>
              <div className="gradient-text">Simplified.</div>
            </h1>

            <p className="reveal font-body text-lg text-secondary" style={{ animationDelay: '0.35s', lineHeight: 1.7, maxWidth: '520px', margin: '0 0 40px 0' }}>
              The intelligent data layer for modern teams. Transform complex datasets into actionable strategy with one simple protocol.
            </p>

            <div className="reveal" style={{ animationDelay: '0.5s', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/signup" style={{
                background: 'var(--gradient-cta)', color: 'white', padding: '14px 32px',
                borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(108,99,255,0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>&gt;</span>
                <span className="font-display text-base" style={{ fontWeight: 600 }}>Initialize System</span>
              </Link>

              <button style={{
                background: 'transparent', border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)', padding: '14px 28px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-glow)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}>
                <Play size={20} color="var(--color-accent-primary)" />
                <span className="font-body text-base">Watch Protocol</span>
              </button>
            </div>

            <div className="reveal" style={{ animationDelay: '0.65s', display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '28px' }}>
              {["System Verified", "Neural Matrix v4.1", "Real-time Secure"].map(str => (
                <div key={str} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--color-accent-primary)', fontSize: '14px' }}>✓</span>
                  <span className="font-mono text-xs text-secondary">{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className="reveal" style={{ flex: '1 1 500px', position: 'relative', animationDelay: '0.5s' }}>

            {/* Hovering stats (desktop mainly) */}
            <div className="hero-stat-chip" style={{
              position: 'absolute', top: '-20px', right: '40px', background: 'rgba(18,18,42,0.8)',
              border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
              animation: 'float2 10s ease-in-out infinite', zIndex: 10, backdropFilter: 'blur(10px)'
            }}>
              <span className="font-mono text-xs text-secondary">2.4M queries today</span>
            </div>

            <div className="hero-stat-chip" style={{
              position: 'absolute', bottom: '40px', left: '-30px', background: 'rgba(18,18,42,0.8)',
              border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
              animation: 'float1 14s ease-in-out infinite', zIndex: 10, backdropFilter: 'blur(10px)'
            }}>
              <span className="font-mono text-xs text-secondary">&lt;100ms</span>
            </div>

            <div className="hero-stat-chip" style={{
              position: 'absolute', bottom: '-20px', right: '20px', background: 'rgba(18,18,42,0.8)',
              border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
              animation: 'float3 12s ease-in-out infinite', zIndex: 10, backdropFilter: 'blur(10px)'
            }}>
              <span className="font-mono text-xs text-secondary">99.98% uptime</span>
            </div>

            <div style={{
              background: 'var(--gradient-card)', border: '1px solid var(--color-border-subtle)',
              borderRadius: '16px', padding: '24px', maxWidth: '560px', margin: '0 auto',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5F56' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27C93F' }}></div>
                <span className="font-mono text-xs text-secondary" style={{ marginLeft: '12px' }}>AskMyData.Intelligence OS</span>
              </div>

              <div style={{
                border: '1px solid rgba(108,99,255,0.4)', borderRadius: '8px', padding: '16px',
                background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center'
              }}>
                <span className="font-mono" style={{ color: 'var(--color-accent-cyan)', marginRight: '10px' }}>&gt;</span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div className="font-mono text-xs" style={{
                    whiteSpace: 'nowrap', overflow: 'hidden', borderRight: '2px solid var(--color-text-primary)',
                    animation: 'typewriter 3s steps(40) 1s forwards, blink 1s step-end infinite',
                    width: '0', maxWidth: '100%'
                  }}>
                    Which regions had the highest churn in Q4?
                  </div>
                </div>
              </div>

              {/* Fake Result Area */}
              <div style={{
                marginTop: '24px', opacity: 0, animation: 'fadeUp 0.5s ease 4.5s forwards'
              }}>
                <div className="font-mono text-xs" style={{ color: 'var(--color-accent-cyan)', marginBottom: '16px' }}>
                  Live Synthesis — Q4 Regional Churn Analysis
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {[
                    { h: '60%', c: '#6C63FF', l: 'NA' },
                    { h: '85%', c: '#7C75FF', l: 'EU' },
                    { h: '45%', c: '#8D8CFF', l: 'APAC' },
                    { h: '90%', c: '#48E0FF', l: 'LATAM' },
                    { h: '70%', c: '#00E5FF', l: 'MENA' }
                  ].map((bar, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '100%', '--bar-height': bar.h, height: '0',
                        background: `linear-gradient(to top, var(--color-accent-primary), ${bar.c})`,
                        borderRadius: '4px 4px 0 0',
                        animation: `chartBar 0.8s ease ${5 + i * 0.1}s forwards`
                      }} />
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '8px', position: 'absolute', bottom: '-4px' }}>
                        {bar.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRUST TICKER */}
      <section style={{
        width: '100%', height: '72px', background: 'rgba(108,99,255,0.06)',
        borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 1024 ? 'none' : 'flex', alignItems: 'center',
          padding: '0 32px', zIndex: 2, background: 'var(--color-bg-void)', height: '100%'
        }}>
          <span className="font-mono text-xs text-secondary" style={{ letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>A New Standard for Data Teams</span>
          <div style={{ width: '1px', height: '24px', background: 'var(--color-border-glow)', marginLeft: '24px' }} />
        </div>

        {/* Ticker Container generated in React */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '100%' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, var(--color-bg-void), transparent)', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, var(--color-bg-void), transparent)', zIndex: 2 }} />

          <div className="ticker-track" style={{
            display: 'flex', alignItems: 'center', height: '100%', width: 'max-content',
            animation: 'ticker 30s linear infinite'
          }}>
            {[1, 2].map(set => (
              <div key={set} style={{ display: 'flex', alignItems: 'center' }}>
                {['DATACORE', 'NEBULA OS', 'SYNERGY AI', 'QUANTUM FLUX', 'VERTEX ENGINE', 'PHASE ZERO', 'AXON SYSTEMS'].map((name, i) => (
                  <React.Fragment key={i}>
                    <span className="font-mono text-sm text-secondary" style={{ letterSpacing: '0.2em', margin: '0 32px' }}>{name}</span>
                    <span style={{ color: 'var(--color-accent-primary)' }}>·</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FEATURES */}
      <section id="features" style={{ padding: 'var(--space-section) 0', position: 'relative' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '16px' }}>Intelligence Core</div>
            <h2 className="font-display text-3xl" style={{ fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.1 }}>
              <div style={{ color: 'var(--color-text-primary)' }}>Built for Scale.</div>
              <div className="gradient-text">Designed for Clarity.</div>
            </h2>
            <p className="font-body text-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Powerful analytics meets production infrastructure.
            </p>
            <div style={{ width: '60px', height: '1px', background: 'var(--gradient-cta)', margin: '24px auto' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: (typeof window !== 'undefined' ? window.innerWidth : 1280) > 1024 ? 'repeat(3, 1fr)' : (typeof window !== 'undefined' ? window.innerWidth : 1280) > 640 ? 'repeat(2, 1fr)' : '1fr',
            gap: '24px'
          }}>
            {features.map((feature, i) => (
              <div key={i} className="reveal feature-card" style={{
                background: 'var(--gradient-card)', border: '1px solid var(--color-border-subtle)',
                borderRadius: '12px', padding: '32px 28px', position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s ease', animationDelay: `${0.1 * i}s`
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-glow)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(108,99,255,0.12), 0 20px 40px rgba(0,0,0,0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.querySelector('.feature-link-underline').style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.querySelector('.feature-link-underline').style.width = '0';
                }}>
                {/* Top Left Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', background: 'rgba(108,99,255,0.08)', borderBottomRightRadius: '12px' }} />

                <div style={{ width: '48px', height: '48px', background: 'rgba(108,99,255,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {feature.icon}
                </div>

                {feature.badge && (
                  <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', marginBottom: '12px', letterSpacing: '0.1em' }}>
                    {feature.badge}
                  </div>
                )}

                <h3 className="font-display text-xl text-primary" style={{ fontWeight: 700, margin: '0 0 12px 0' }}>{feature.title}</h3>
                <p className="font-body text-base text-secondary" style={{ lineHeight: 1.7, margin: '0 0 24px 0', flex: 1 }}>{feature.description}</p>

                <div style={{ marginTop: 'auto', display: 'inline-flex', flexDirection: 'column' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)' }}>Explore Features &rarr;</span>
                  <div className="feature-link-underline" style={{ height: '1px', background: 'var(--color-accent-primary)', width: '0', transition: 'width 0.3s ease', marginTop: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS */}
      <section style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '16px' }}>The Protocol</div>
            <h2 className="font-display text-3xl" style={{ fontWeight: 800, margin: '0' }}>
              Three Steps to <span className="gradient-text">Intelligence.</span>
            </h2>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? 'row' : 'column', gap: '40px' }}>
            {/* Connector lines depending on layout */}
            {(typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 && (
              <div style={{ position: 'absolute', top: '40px', left: '16.6%', width: '66.6%', borderTop: '1px dashed rgba(108,99,255,0.3)', zIndex: 0 }} />
            )}
            {(typeof window !== 'undefined' ? window.innerWidth : 1280) < 1024 && (
              <div style={{ position: 'absolute', top: '40px', bottom: '40px', left: '36px', borderLeft: '2px dashed var(--color-border-subtle)', zIndex: 0 }} />
            )}

            {[
              { n: "01", t: "CONNECT", title: "Link Your Sources", desc: "Link PostgreSQL, Snowflake, BigQuery, or any enterprise spreadsheet cluster in one click. Zero ETL. Zero engineering tickets." },
              { n: "02", t: "ASK", title: "Query The Engine", desc: "Type any question in plain English. The Neural Engine v4 translates your intent into production-grade analytics instantly across your entire data ecosystem." },
              { n: "03", t: "DECIDE", title: "Synthesize Strategy", desc: "Receive live-synthesized dashboards, trend forecasts, and strategic summaries that evolve in real time as your data changes." }
            ].map((step, i) => (
              <div key={i} className="reveal" style={{
                flex: 1, position: 'relative', zIndex: 1,
                textAlign: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? 'center' : 'left',
                display: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 1024 ? 'flex' : 'block', alignItems: 'flex-start',
                animationDelay: `${0.2 * i}s`
              }}>
                {(typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? (
                  <div className="font-mono" style={{ fontSize: '3rem', color: 'var(--color-accent-primary)', opacity: 0.2, position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', zIndex: -1 }}>
                    {step.n}
                  </div>
                ) : (
                  <div className="font-mono" style={{ fontSize: '3rem', color: 'var(--color-accent-primary)', opacity: 0.2, position: 'absolute', top: '0px', left: '0px', zIndex: -1 }}>
                    {step.n}
                  </div>
                )}

                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%', border: '2px solid var(--color-accent-primary)',
                  background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? '0 auto 24px auto' : '0 24px 0 0', flexShrink: 0
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg-void)', border: '1px solid var(--color-accent-primary)' }} />
                </div>

                <div>
                  <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.15em', marginBottom: '12px' }}>{step.t}</div>
                  <h3 className="font-display text-xl text-primary" style={{ fontWeight: 700, marginBottom: '16px' }}>{step.title}</h3>
                  <p className="font-body text-base text-secondary" style={{ lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INTELLIGENCE / PROTOCOL */}
      <section id="intelligence" style={{
        background: 'var(--color-bg-surface)', padding: 'var(--space-section) 0',
        clipPath: (typeof window !== 'undefined' ? window.innerWidth : 1280) > 640 ? 'polygon(0 40px, 100% 0, 100% 100%, 0 100%)' : 'none',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{
            display: 'flex', flexDirection: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? 'row' : 'column',
            alignItems: 'center', gap: '64px'
          }}>
            {/* Left - Visual */}
            <div className="reveal" style={{ flex: 1, width: '100%', maxWidth: '600px' }}>
              <div style={{
                background: 'var(--gradient-card)', border: '1px solid var(--color-border-subtle)',
                borderRadius: '16px', padding: '40px', position: 'relative'
              }}>
                <div className="font-mono text-xs text-cyan" style={{ marginBottom: '40px' }}>Neural Matrix v4.1</div>

                {/* CSS Neural Diagram */}
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 40px auto' }}>
                  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {[0, 60, 120, 180, 240, 300].map(angle => (
                      <line key={angle} x1="100" y1="100"
                        x2={100 + 80 * Math.cos(angle * Math.PI / 180)} y2={100 + 80 * Math.sin(angle * Math.PI / 180)}
                        stroke="var(--color-accent-primary)" strokeWidth="2" strokeDasharray="8 4"
                        style={{ animation: 'dashFlow 3s linear infinite' }} />
                    ))}
                  </svg>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '40px', height: '40px', background: 'var(--gradient-cta)', borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(108,99,255,0.5)'
                  }} />
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <div key={angle} style={{
                      position: 'absolute', top: `${50 + 40 * Math.sin(angle * Math.PI / 180)}%`, left: `${50 + 40 * Math.cos(angle * Math.PI / 180)}%`,
                      transform: 'translate(-50%, -50%)', width: '20px', height: '20px',
                      border: '2px solid var(--color-accent-primary)', borderRadius: '50%', background: 'var(--color-bg-void)',
                      animation: `blink ${2 + i % 3}s infinite`
                    }} />
                  ))}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="font-mono text-xs text-secondary">Real-time Secure</span>
                    <span className="font-mono text-xs text-secondary">100%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--gradient-cta)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="font-mono text-xs text-secondary">Zero Knowledge Base</span>
                    <span className="font-mono text-xs text-secondary">100%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--color-accent-cyan)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Text */}
            <div className="reveal" style={{ flex: 1, animationDelay: '0.2s' }}>
              <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '16px' }}>The Protocol</div>
              <h2 className="font-display text-3xl text-primary" style={{ fontWeight: 800, margin: '0 0 40px 0' }}>
                Advanced Encryption Layer.
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ marginTop: '4px' }}><Shield color="var(--color-accent-primary)" /></div>
                  <div>
                    <h3 className="font-display text-xl text-primary" style={{ fontWeight: 700, margin: '0 0 8px 0' }}>Zero Knowledge Base</h3>
                    <p className="font-body text-base text-secondary" style={{ margin: 0 }}>Your data source remains isolated. We only process intelligence, never store records.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ marginTop: '4px' }}><Network color="var(--color-accent-cyan)" /></div>
                  <div>
                    <h3 className="font-display text-xl text-primary" style={{ fontWeight: 700, margin: '0 0 8px 0' }}>Neural Orchestration</h3>
                    <p className="font-body text-base text-secondary" style={{ margin: 0 }}>Dynamic routing across specialized LLM clusters ensures the highest reasoning fidelity.</p>
                  </div>
                </div>
              </div>

              <a href="#" className="font-mono text-sm" style={{
                color: 'var(--color-accent-primary)', textDecoration: 'none',
                display: 'inline-block', position: 'relative', paddingBottom: '4px',
                transition: 'letter-spacing 0.3s'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.letterSpacing = '0.01em';
                  e.currentTarget.querySelector('.link-underline').style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.letterSpacing = 'normal';
                  e.currentTarget.querySelector('.link-underline').style.width = '0';
                }}>
                Read Whitepaper &rarr;
                <div className="link-underline" style={{ position: 'absolute', bottom: 0, left: 0, height: '1px', background: 'var(--color-accent-primary)', width: '0', transition: 'width 0.3s' }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: INTEGRATIONS */}
      <section style={{ padding: 'var(--space-section) 0', background: 'var(--color-bg-void)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '16px' }}>Integrations</div>
            <h2 className="font-display text-3xl text-primary" style={{ fontWeight: 800, margin: '0 0 16px 0' }}>
              Your Entire Stack, Connected.
            </h2>
            <p className="font-body text-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Ecosystem Sync with native connectors for every layer of your data infrastructure.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? 'repeat(4, 1fr)' : (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 640 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {['PostgreSQL', 'Snowflake', 'BigQuery', 'Redshift', 'MySQL', 'MongoDB', 'Excel', 'Google Sheets', 'Salesforce', 'HubSpot', 'Stripe', 'Airtable'].map((name, i) => (
              <div key={i} className="reveal" style={{
                background: 'rgba(18,18,42,0.6)', border: '1px solid var(--color-border-subtle)',
                borderRadius: '10px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                transition: 'all 0.3s', animationDelay: `${0.05 * i}s`
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-glow)';
                  e.currentTarget.style.background = 'rgba(108,99,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.background = 'rgba(18,18,42,0.6)';
                  e.currentTarget.style.transform = 'none';
                }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="font-mono text-sm" style={{ color: 'var(--color-accent-primary)' }}>{name[0]}</span>
                </div>
                <span className="font-body text-sm text-primary">{name}</span>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: '48px', animationDelay: '0.6s' }}>
            <span className="font-mono text-sm text-secondary">Don't see yours? We connect to anything. </span>
            <a href="#" className="font-mono text-sm" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none' }}>Request Integration &rarr;</a>
          </div>
        </div>
      </section>

      {/* SECTION 10: PROTOCOL TRUST / SECURITY */}
      <section id="protocol" style={{ background: 'var(--color-bg-surface)', padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '16px' }}>Protocol Security</div>
            <h2 className="font-display text-3xl text-primary" style={{ fontWeight: 800, margin: '0 0 16px 0' }}>
              Zero-Trust by Design.
            </h2>
            <p className="font-body text-lg text-secondary" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
              Our entire architecture operates on the principle that no system, user, or request is inherently trusted. Every query is authenticated, every data path is encrypted end-to-end.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: '40px'
          }}>
            {[
              { icon: "🔒", title: "SOC 2 Type II", desc: "Independently audited security controls." },
              { icon: "🔐", title: "Bank-Grade Encryption", desc: "AES-256 at rest. TLS 1.3 in transit." },
              { icon: "👁", title: "Zero-Knowledge Base", desc: "We process intelligence, never store records." },
              { icon: "⚡", title: "RLS Integration", desc: "Row-level security baked into every query." }
            ].map((badge, i) => (
              <div key={i} className="reveal" style={{ textAlign: 'center', animationDelay: `${0.1 * i}s` }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{badge.icon}</div>
                <h3 className="font-display text-lg text-primary" style={{ fontWeight: 700, margin: '0 0 12px 0' }}>{badge.title}</h3>
                <p className="font-body text-sm text-secondary" style={{ margin: 0, lineHeight: 1.6 }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section style={{
        padding: '120px 0', minHeight: '480px', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at center, var(--color-bg-elevated) 0%, var(--color-bg-void) 70%)'
      }}>
        {/* Floating background glows */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'var(--color-accent-primary)', filter: 'blur(120px)', opacity: 0.15, animation: 'float1 20s infinite', top: '10%', left: '20%' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--color-accent-cyan)', filter: 'blur(120px)', opacity: 0.15, animation: 'float2 15s infinite', bottom: '20%', right: '20%' }} />
        <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'var(--color-accent-pulse)', filter: 'blur(120px)', opacity: 0.15, animation: 'float3 18s infinite', top: '30%', left: '50%' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="reveal font-mono text-xs" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.2em', marginBottom: '24px' }}>Initialize System</div>
          <h2 className="reveal font-display" style={{
            fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)', margin: '0 0 24px 0',
            lineHeight: 1.1, animationDelay: '0.1s'
          }}>
            <div className="text-primary">Your Data Has Answers.</div>
            <div className="gradient-text">AskMyData Finds Them.</div>
          </h2>
          <p className="reveal font-body text-lg text-secondary" style={{ maxWidth: '480px', margin: '0 auto 48px auto', lineHeight: 1.6, animationDelay: '0.2s' }}>
            Join elite data teams who stopped guessing and started knowing. One protocol. Infinite intelligence.
          </p>

          <div className="reveal" style={{ animationDelay: '0.3s' }}>
            <Link href="/signup" style={{
              background: 'var(--gradient-cta)', color: 'white', padding: '18px 48px',
              borderRadius: '8px', textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.3s'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 60px rgba(108,99,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}>
              <span className="font-display text-lg" style={{ fontWeight: 600 }}>Initialize System &rarr;</span>
            </Link>
            <div className="font-mono text-xs text-secondary" style={{ marginTop: '20px' }}>
              No credit card required · Setup in 60 seconds · Cancel anytime
            </div>
          </div>

          {/* Floating CTA Stat chips */}
          {(typeof window !== 'undefined' ? window.innerWidth : 1280) >= 640 && (
            <>
              <div className="hero-stat-chip" style={{
                position: 'absolute', top: '10%', left: '10%', background: 'rgba(18,18,42,0.8)',
                border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
                animation: 'float2 10s ease-in-out infinite'
              }}>
                <span className="font-mono text-xs text-secondary">Neural Matrix v4.1</span>
              </div>
              <div className="hero-stat-chip" style={{
                position: 'absolute', bottom: '20%', left: '15%', background: 'rgba(18,18,42,0.8)',
                border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
                animation: 'float1 14s ease-in-out infinite'
              }}>
                <span className="font-mono text-xs text-secondary">System Verified</span>
              </div>
              <div className="hero-stat-chip" style={{
                position: 'absolute', top: '20%', right: '15%', background: 'rgba(18,18,42,0.8)',
                border: '1px solid var(--color-border-subtle)', borderRadius: '100px', padding: '6px 14px',
                animation: 'float3 12s ease-in-out infinite'
              }}>
                <span className="font-mono text-xs text-secondary">Real-time Secure</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 12: FOOTER */}
      <footer style={{
        background: 'var(--color-bg-void)', borderTop: '1px solid var(--color-border-subtle)',
        paddingTop: '64px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 1024 ? '2fr 1fr 1fr 1fr' : (typeof window !== 'undefined' ? window.innerWidth : 1280) >= 640 ? 'repeat(2, 1fr)' : '1fr',
            gap: '48px', marginBottom: '64px'
          }}>

            {/* Col 1: Brand & Newsletter */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="font-display text-lg text-primary" style={{ fontWeight: 700, lineHeight: 1 }}>
                  AskMyData<span style={{ color: 'var(--color-accent-cyan)' }}>.</span>
                </div>
              </div>
              <p className="font-body text-sm text-secondary" style={{ maxWidth: '240px', lineHeight: 1.6, marginBottom: '24px' }}>
                Orchestrating intelligence for global systems. Transform raw data into strategic clarity with the Neural Protocol.
              </p>

              <div>
                <div className="font-mono text-xs" style={{ color: 'var(--color-accent-primary)', marginBottom: '8px' }}>Stay Synced</div>
                <div style={{ display: 'flex', width: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 640 ? '100%' : 'auto' }}>
                  <input type="email" placeholder="Your email" className="font-body text-sm text-primary" style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border-subtle)',
                    padding: '10px 16px', borderRadius: '6px 0 0 6px', outline: 'none', flex: 1, minWidth: '0'
                  }} />
                  <button className="font-body text-sm" style={{
                    background: 'var(--gradient-cta)', color: 'white', border: 'none',
                    padding: '10px 16px', borderRadius: '0 6px 6px 0', cursor: 'pointer', fontWeight: 600
                  }}>
                    Sync &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Col 2: Standard Solutions */}
            <div>
              <h4 className="font-mono text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>Standard Solutions</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Neural Engine', 'Live Synthesis', 'Ecosystem Sync'].map(link => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-secondary" style={{ textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.transform = 'none'; }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Intelligence Hub */}
            <div>
              <h4 className="font-mono text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>Intelligence Hub</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Governance', 'Whitepaper', 'API Protocol'].map(link => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-secondary" style={{ textDecoration: 'none', transition: 'all 0.3s', display: 'inline-block' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.transform = 'none'; }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Social */}
            <div>
              <h4 className="font-mono text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>Connect</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[<Github size={24} />, <Twitter size={24} />, <Linkedin size={24} />].map((icon, i) => (
                  <a key={i} href="#" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid var(--color-border-subtle)', padding: '24px 0',
            display: 'flex', flexDirection: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 640 ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: (typeof window !== 'undefined' ? window.innerWidth : 1280) < 640 ? 'center' : 'flex-start',
            gap: '16px'
          }}>
            <div className="font-mono text-xs text-secondary">
              © 2026 AskMyData Systems. Orchestrating the future.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy', 'Security', 'Protocol'].map(link => (
                <a key={link} href="#" className="font-mono text-xs text-secondary" style={{ textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
