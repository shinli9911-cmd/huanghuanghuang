import { motion, useScroll, useSpring } from "framer-motion";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { BarChart3, Blocks, CalendarDays, CircleUserRound, Compass, LibraryBig, MousePointer2, Palette } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BorderGlow from "./BorderGlow";
import DotField from "./DotField";
import GradientText from "./GradientText";

const SoftAurora = lazy(() => import("./SoftAurora"));

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const works = [
  { slug: "station-command-center", title: "新能源场站驾驶舱", image: "/media/figma-work-01.png", category: "数据可视化 · 驾驶舱", summary: "面向新能源场站的全局运营驾驶舱，将设备状态、发电效能与运行任务收拢为统一决策界面。", role: "体验策略 / 视觉系统 / 大屏设计", outcome: "统一 6 类核心监控视图，缩短跨系统检索路径。", modules: ["全景态势", "效能分析", "任务调度"] },
  { slug: "pv-security", title: "光伏场站智能安防系统", image: "/media/figma-work-02.png", category: "B 端产品 · 安防", summary: "以站区地图为中心，串联视频、告警、巡检和处置流程的智能安防工作台。", role: "信息架构 / 交互设计 / 视觉语言", outcome: "让风险定位与处置流程在一张工作台内完成。", modules: ["站区地图", "告警中心", "处置闭环"] },
  { slug: "new-energy-management", title: "智慧新能源管理系统", image: "/media/figma-work-03.png", category: "平台设计 · 运行监控", summary: "覆盖运行、维护与经营协同的新能源管理系统，为不同角色提供清晰的任务入口。", role: "产品梳理 / 组件规范 / 端到端设计", outcome: "以统一组件语言支撑多角色、多场景的协同使用。", modules: ["运行总览", "设备管理", "指标看板"] },
  { slug: "energy-operations", title: "智慧能源管理平台", image: "/media/figma-work-04.png", category: "数据体验 · 运营", summary: "围绕经营目标、资源效率与异常响应打造的能源运营数据平台。", role: "数据表达 / 体验框架 / 设计治理", outcome: "让分散的经营指标回到可比较、可行动的运营视图。", modules: ["经营分析", "能效对标", "异常追踪"] },
  { slug: "offshore-dispatch", title: "海上风电智能运维调度系统", image: "/media/figma-work-05.png", category: "运维调度 · 协同", summary: "为海上风电运维团队设计的任务排程与资源协同系统，兼顾海况与设备状态。", role: "场景建模 / 调度流程 / 交互原型", outcome: "让高风险、高时效任务拥有更明确的优先级和协作状态。", modules: ["任务排程", "资源协同", "海况联动"] },
  { slug: "hydro-safety", title: "安全生产考试平台", image: "/media/figma-work-06.png", category: "安全生产 · 考试平台", summary: "服务于安全培训、在线考试与能力评估的一体化管理平台。", role: "任务流程 / 内容结构 / 业务体验", outcome: "把培训、考核与人员能力档案连接为持续生长的管理闭环。", modules: ["学习任务", "在线考试", "能力评估"] },
  { slug: "monitoring-design-system", title: "水电监盘驾驶舱", image: "/media/figma-work-07.png", category: "水电监盘 · 驾驶舱", summary: "聚合水电站实时运行数据与关键状态，为值班人员提供清晰的监盘视图。", role: "设计系统 / 数据可视化 / 规范沉淀", outcome: "以可复用的数据组件提升监盘界面的可读性与一致性。", modules: ["实时监盘", "状态组件", "趋势分析"] },
  { slug: "safety-learning", title: "水电安全智能管控平台", image: "/media/figma-work-08.png", category: "安全生产 · 智能管控", summary: "聚焦水电生产安全的隐患、作业票与检查闭环管理平台。", role: "流程设计 / 视觉体验 / 业务系统", outcome: "建立可追溯的安全生产全流程数字化管控。", modules: ["隐患治理", "作业管理", "安全看板"] },
];

const featuredWorks = [
  { ...works[0], title: "全场景监控设计实践", image: "/media/featured-01-all-scenarios.jpg", detailPath: "/project/all-scenarios/full-image", impact: "驾驶舱、监控大屏与监盘 APP 三端协同。", number: "01" },
  { ...works[1], title: "数据智能可视化大屏", image: "/media/featured-02-data-screen.jpg", detailPath: "/project/data-visualization/full-image", category: "数据可视化 · 大屏设计", summary: "聚焦核心经营与运行指标的数据智能可视化大屏，让复杂数据从实时洞察到全局判断一目了然。", impact: "沉淀地图、图标、图表与全局态势的表达语言。", modules: ["数据监测", "图表分析", "全景洞察"], number: "02" },
  { ...works[2], title: "新能源场站数据监盘 APP", image: "/media/featured-03-monitoring-app-0803.jpg", detailPath: "/project/monitoring-app/full-image", category: "移动端产品 · 数据监盘", summary: "面向新能源场站运行人员的移动数据监盘应用，让关键指标、设备状态与异常趋势随时可见、快速判断。", impact: "建立面向场站运行人员的移动监盘与判断界面。", modules: ["移动监控", "数据分析", "交互体验"], number: "03" },
];

const fullImageProjects = {
  "all-scenarios": { number: "01", title: "全场景监控设计实践", dimensions: "1920 × 29671", image: "/media/all-scenarios-case-study-opt.jpg", context: "面向新能源生产现场的多端监控体验设计，连接驾驶舱、监控大屏与移动监盘。", role: "需求梳理 / 信息架构 / 全端视觉与交互设计", focus: "统一多端信息层级、状态语言与关键任务路径。", outcome: "形成可复用的三端设计语言与组件表达。" },
  "data-visualization": { number: "02", title: "数据智能可视化大屏", dimensions: "1920 × 6480", image: "/media/data-visualization-case-study-opt.jpg", context: "围绕经营与运行指标构建大屏可视化体验，让高密度数据支持快速全局判断。", role: "数据表达 / 大屏视觉系统 / 信息层级设计", focus: "协调地图、图标、图表与实时状态之间的阅读优先级。", outcome: "沉淀面向监控场景的数据可视化表达规范。" },
  "monitoring-app": { number: "03", title: "新能源场站数据监盘 APP", dimensions: "1920 × 12099", image: "/media/monitoring-app-case-study-0803.png", context: "服务新能源场站运行人员的移动监盘应用，随时查看关键指标、设备状态与异常趋势。", role: "移动端体验框架 / 界面设计 / 指标呈现规则", focus: "在小屏内聚焦任务优先级，并降低现场判断成本。", outcome: "形成从总览到分析的移动监盘体验与设计规范。" },
};

const capabilities = [
  [CircleUserRound, "用户研究", "User Research"],
  [MousePointer2, "交互设计", "Interaction Design"],
  [Palette, "视觉设计", "Visual Design"],
  [BarChart3, "数据可视化", "Data Visualization", true],
  [Blocks, "设计系统", "Design System", true],
];

const principles = [
  ["01", "业务真实", "从角色任务、现场约束与决策节点出发，让复杂系统回到真实工作流。"],
  ["02", "信息清晰", "建立信息层级与状态语言，让用户在高密度数据中快速识别重点。"],
  ["03", "体验可持续", "用组件、规范和协作机制，把一次设计沉淀为可以持续生长的能力。"],
];

const methodology = [
  {
    title: "设计前",
    Icon: CalendarDays,
    points: ["深入业务现场，理解角色任务与数据关系", "从角色任务、现场约束与决策节点出发", "让复杂系统回到真实工作流。"],
  },
  {
    title: "设计中",
    Icon: Compass,
    points: ["以信息层级与状态语言建立清晰秩序", "在高密度数据中建立明确的信息重点", "让用户快速判断、确认并完成任务。"],
  },
  {
    title: "设计后",
    Icon: LibraryBig,
    points: ["沉淀组件与规范，让体验可持续生长", "将一次设计转化为可协作的系统能力", "用持续迭代让体验保持一致与清晰。"],
  },
];

const iconMotions = [
  { number: "01", title: "门禁系统", label: "ACCESS CONTROL", video: "/media/icon-motion-access.mp4" },
  { number: "02", title: "机器人系统", label: "ROBOT SYSTEM", video: "/media/icon-motion-robot.mp4" },
  { number: "03", title: "视频监控", label: "VIDEO SURVEILLANCE", video: "/media/icon-motion-surveillance.mp4" },
  { number: "04", title: "线路巡检", label: "LINE INSPECTION", video: "/media/icon-motion-inspection.mp4" },
  { number: "05", title: "环境监视", label: "ENVIRONMENT MONITORING", video: "/media/icon-motion-environment.mp4" },
];

const careerHistory = [
  {
    period: "2022 — 至今",
    company: "某新能源科技公司",
    role: "UI 设计主管",
    description: "专注能源数字化 B 端产品，主导智慧运维平台、风电场管控系统、新能源安生平台等核心项目设计交付，负责从需求梳理到设计落地的全链路设计。",
  },
  {
    period: "2017 — 2022",
    company: "苏宁易购·物流研发中心",
    role: "设计经理",
    description: "B 端为主，C 端为辅，涉及多端产品设计。",
    details: [
      ["B 端系统", "负责物流仓储后台系统（WMS/CMS）的 UI 搭建与设计规范维护，支撑 10 万+ 仓储与物流人员的日常操作。"],
      ["C 端产品", "参与苏宁帮客+小程序、帮客 APP（售后师傅上门专用工具）、快递员 APP（快递员日常配送与订单管理）及苏宁帮客+APP 的界面设计与优化。"],
      ["整体成果", "建立多端视觉规范与组件库，覆盖 B 端与 C 端设计标准统一。"],
    ],
  },
  {
    period: "2006 — 2017",
    company: "江苏三六五网络股份有限公司",
    role: "设计主管",
    description: "负责淘房网 APP 及官网日常维护、活动专题制作与视觉设计，积累移动端设计规范落地经验。",
  },
];

function Header({ activeSection }) {
  return <header className="site-header">
    <div className="frame nav-shell">
      <Link className="brand" to="/">Huang Juan</Link>
      <nav aria-label="主导航">
        <a className={activeSection === "philosophy" ? "nav-current" : ""} aria-current={activeSection === "philosophy" ? "page" : undefined} href="#philosophy">设计理念</a>
        <a className={activeSection === "works" ? "nav-current" : ""} aria-current={activeSection === "works" ? "page" : undefined} href="#works">作品集</a>
        <a className={activeSection === "contact" ? "nav-current" : ""} aria-current={activeSection === "contact" ? "page" : undefined} href="#contact">联系方式</a>
      </nav>
      <a className="nav-mail" href="mailto:hjmf1030@126.com">hjmf1030@126.com</a>
    </div>
  </header>;
}

function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function PortfolioHome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const rootRef = useRef(null);
  const philosophyRef = useRef(null);
  const [activeSection, setActiveSection] = useState("");
  const [shouldRenderAurora, setShouldRenderAurora] = useState(false);

  useEffect(() => {
    const sections = ["philosophy", "works", "contact"].map((id) => document.getElementById(id)).filter(Boolean);
    let animationFrame = 0;
    const updateActiveSection = () => {
      animationFrame = 0;
      const checkpoint = window.innerHeight * .46;
      const current = sections.reduce((active, section) => section.getBoundingClientRect().top <= checkpoint ? section.id : active, "");
      setActiveSection((previous) => previous === current ? previous : current);
    };
    const scheduleActiveSectionUpdate = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, []);

  useEffect(() => {
    const section = philosophyRef.current;
    if (!section) return undefined;
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldRenderAurora(true);
      observer?.disconnect();
    }, { rootMargin: "480px 0px" });
    observer?.observe(section);
    if (!observer) setShouldRenderAurora(true);
    return () => observer?.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const context = gsap.context(() => {
      const ease = "power4.out";
      const revealHeading = (trigger, title, secondary) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger, start: "top 78%", toggleActions: "play none none reverse" },
        });

        timeline
          .from(title, { autoAlpha: 0, yPercent: 115, scaleY: .64, transformOrigin: "0% 100%", duration: 1.35, ease })
          .from(secondary, { autoAlpha: 0, y: 54, duration: 1.05, ease }, "-=.78");
      };

      const heroTimeline = gsap.timeline({ defaults: { ease } });
      heroTimeline
        .set(".hero-image", { scale: 1.16, yPercent: 4 })
        .set(".hero-shade", { autoAlpha: 0 })
        .set(".site-header", { autoAlpha: 0, y: -30 })
        .set(".hero-overline, .hero-desc", { autoAlpha: 0, y: 32 })
        .set(".hero-experience", { autoAlpha: 0, y: 46, scale: .96, transformOrigin: "100% 100%" })
        .set(".hero-display", { autoAlpha: 0, xPercent: -18, scaleX: .72, transformOrigin: "0% 50%" })
        .set(".hero-title-mask", { clipPath: "inset(0 0 100% 0)" })
        .set(".hero-title", { yPercent: 105, scaleY: .62, scaleX: .92, transformOrigin: "0% 100%" })
        .set(".tag-row .tag-glow", { autoAlpha: 0, y: 22, scale: .9 })
        .to(".hero-opening-panel", { scaleY: 0, transformOrigin: "50% 0%", duration: .86, ease: "power4.inOut" })
        .to(".hero-image", { scale: 1, yPercent: 0, duration: 1.45, ease: "power3.out" }, "<.04")
        .to(".hero-shade", { autoAlpha: 1, duration: .72 }, "<.05")
        .to(".site-header", { autoAlpha: 1, y: 0, duration: .52 }, "<.18")
        .to(".hero-display", { autoAlpha: 1, xPercent: 0, scaleX: 1, duration: .72 }, "<.04")
        .to(".hero-title-mask", { clipPath: "inset(0 0 0% 0)", duration: .76, ease: "power4.inOut" }, "<.1")
        .to(".hero-title", { yPercent: 0, scaleY: 1, scaleX: 1, duration: .84 }, "<")
        .to(".hero-overline, .hero-desc", { autoAlpha: 1, y: 0, duration: .58, stagger: .09 }, "<.18")
        .to(".tag-row .tag-glow", { autoAlpha: 1, y: 0, scale: 1, duration: .48, stagger: .055, ease: "power3.out" }, "<.08")
        .to(".hero-experience", { autoAlpha: 1, y: 0, scale: 1, duration: .72, ease: "power3.out" }, "<-.3");

      const enableScrollParallax = window.matchMedia("(min-width: 901px)").matches;
      if (enableScrollParallax) {
        gsap.to(".hero-image", {
          yPercent: 9,
          scale: 1.07,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2, fastScrollEnd: true },
        });
      }

      revealHeading(".works-section", ".works-section .motion-english", ".works-section .motion-chinese");
      revealHeading(".philosophy-section", ".philosophy-section .motion-english", ".philosophy-section .motion-chinese");
      revealHeading(".contact-section", ".contact-section .motion-english", ".contact-section .motion-chinese");

      gsap.from(".featured-glow", {
        autoAlpha: 0,
        y: 110,
        rotateX: 10,
        transformOrigin: "50% 100%",
        duration: 1.2,
        stagger: .11,
        ease,
        scrollTrigger: { trigger: ".featured-grid", start: "top 79%", toggleActions: "play none none reverse" },
      });
      gsap.from(".featured-media", {
        clipPath: "inset(0 0 100% 0 round 10px)",
        duration: 1.35,
        stagger: .11,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".featured-grid", start: "top 79%", toggleActions: "play none none reverse" },
      });
      gsap.from(".archive-heading", {
        autoAlpha: 0,
        y: 48,
        duration: 1,
        ease,
        scrollTrigger: { trigger: ".archive-heading", start: "top 84%", toggleActions: "play none none reverse" },
      });
      gsap.from(".work-glow", {
        autoAlpha: 0,
        duration: 1.05,
        stagger: .08,
        ease,
        scrollTrigger: { trigger: ".work-grid", start: "top 80%", toggleActions: "play none none reverse" },
      });
      gsap.from(".work-image", {
        clipPath: "inset(0 0 100% 0 round 6px)",
        duration: 1.15,
        stagger: .08,
        ease: "power4.inOut",
        scrollTrigger: { trigger: ".work-grid", start: "top 80%", toggleActions: "play none none reverse" },
      });
      gsap.from(".icon-motion-panel", {
        autoAlpha: 0,
        y: 72,
        duration: 1.15,
        ease,
        scrollTrigger: { trigger: ".icon-motion-panel", start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.from(".icon-motion-card", {
        autoAlpha: 0,
        y: 38,
        duration: .9,
        stagger: .12,
        ease,
        scrollTrigger: { trigger: ".icon-motion-panel", start: "top 80%", toggleActions: "play none none reverse" },
      });
      gsap.from(".publication-panel", {
        autoAlpha: 0,
        y: 72,
        duration: 1.15,
        ease,
        scrollTrigger: { trigger: ".publication-panel", start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.from(".publication-panel > *", {
        autoAlpha: 0,
        y: 34,
        duration: .9,
        stagger: .12,
        ease,
        scrollTrigger: { trigger: ".publication-panel", start: "top 80%", toggleActions: "play none none reverse" },
      });
      if (enableScrollParallax) {
        gsap.to(".work-image img", {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".work-grid", start: "top bottom", end: "bottom top", scrub: 1.2, fastScrollEnd: true },
        });
      }

      gsap.from(".capability-panel", {
        autoAlpha: 0,
        y: 70,
        duration: 1.1,
        ease,
        scrollTrigger: { trigger: ".capability-panel", start: "top 82%", toggleActions: "play none none reverse" },
      });

      gsap.from(".philosophy-intro", {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease,
        scrollTrigger: { trigger: ".philosophy-layout", start: "top 76%", toggleActions: "play none none reverse" },
      });
      gsap.from(".principle-reveal", {
        autoAlpha: 0,
        y: 92,
        duration: 1.1,
        stagger: .14,
        ease,
        scrollTrigger: { trigger: ".principle-grid", start: "top 79%", toggleActions: "play none none reverse" },
      });
      gsap.from(".methodology-panel, .philosophy-project-link", {
        autoAlpha: 0,
        y: 54,
        duration: 1.05,
        stagger: .16,
        ease,
        scrollTrigger: { trigger: ".methodology-panel", start: "top 82%", toggleActions: "play none none reverse" },
      });
      if (enableScrollParallax) {
        gsap.to(".philosophy-aurora", {
          scale: 1.1,
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: ".philosophy-section", start: "top bottom", end: "bottom top", scrub: 1.5, fastScrollEnd: true },
        });
      }

      gsap.from(".contact-link", {
        autoAlpha: 0,
        x: -54,
        duration: 1.05,
        ease,
        scrollTrigger: { trigger: ".contact-section", start: "top 73%", toggleActions: "play none none reverse" },
      });
      gsap.from(".footer > *", {
        autoAlpha: 0,
        y: 20,
        stagger: .09,
        duration: .72,
        ease,
        scrollTrigger: { trigger: ".footer", start: "top 94%", toggleActions: "play none none reverse" },
      });
    }, root);

    return () => context.revert();
  }, []);

  return <main id="home" ref={rootRef}>
    <motion.div className="scroll-progress" style={{ scaleX }} />
    <Header activeSection={activeSection} />
    <section className="hero">
      <img className="hero-image" src="/media/figma-hero-opt.jpg" alt="深蓝色星球与数字地形" fetchpriority="high" decoding="async" />
      <div className="hero-dot-field" aria-hidden="true"><DotField dotRadius={1} dotSpacing={18} cursorRadius={430} bulgeStrength={42} glowRadius={230} waveAmplitude={0.2} gradientFrom="rgba(180, 159, 244, 0.34)" gradientTo="rgba(84, 158, 230, 0.13)" glowColor="#2a2463" /></div>
      <div className="hero-shade" />
      <div className="hero-opening-panel" aria-hidden="true" />
      <div className="frame hero-content">
        <div className="hero-layout">
          <Reveal className="hero-copy">
            <p className="hero-overline">PORTFOLIO · UI/UX DESIGNER</p>
            <p className="hero-display">Design Portfolio</p>
            <div className="hero-title-mask"><h1 className="hero-title"><GradientText className="hero-gradient-title" colors={["#e7dcff", "#b18deb", "#6a97e6", "#b18deb"]} animationSpeed={10} direction="diagonal">为复杂系统建立<span>清晰秩序</span></GradientText></h1></div>
            <p className="hero-desc">从业务、角色与数据出发，为复杂流程建立清晰、确定的设计秩序。</p>
            <div className="tag-row" aria-label="设计能力">
              {["UI/UX 设计", "数据可视化", "组件化设计", "全场景设计", "AI 工具链整合"].map((tag) => <BorderGlow className="tag-glow" key={tag} glowColor="258 76 76" backgroundColor="rgba(20, 25, 43, .64)" borderRadius={999} glowRadius={12} glowIntensity={.68} coneSpread={22} fillOpacity={.16} colors={["#b18deb", "#6a97e6", "#6cd7cf"]}><span className="tag-label">{tag}</span></BorderGlow>)}
            </div>
          </Reveal>
          <aside className="hero-experience" aria-label="工作经历">
            <div className="hero-experience-heading"><span>职业履历</span><small>WORK EXPERIENCE · 2006 — NOW</small></div>
            <div className="hero-experience-list">
              {careerHistory.map(({ period, company, role, description, details }) => <article className="hero-experience-item" key={`${company}-${period}`}>
                <p className="hero-experience-period">{period}</p>
                <div className="hero-experience-body">
                  <h2>{company}<span>· {role}</span></h2>
                  <p className="hero-experience-description">{description}</p>
                  {details && <dl>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
                </div>
              </article>)}
            </div>
            <figure className="hero-experience-portrait">
              <img src="/media/profile-portrait-crop.png" alt="黄娟个人肖像" />
            </figure>
          </aside>
        </div>
      </div>
    </section>

    <section className="works-section" id="works">
      <div className="frame">
        <Reveal className="section-heading works-heading"><p className="motion-english">SELECTED WORKS</p><h2 className="motion-chinese">精选作品</h2></Reveal>
        <Reveal className="capability-panel">
          <div className="capability-heading"><p><span>01</span>｜设计能力</p><small>从用户研究到设计落地，具备完整的设计能力体系</small></div>
          <div className="capability-list">
            {capabilities.map(([Icon, title, subtitle, isCore]) => <div className={`capability-item${isCore ? " capability-item-core" : ""}`} key={title}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{subtitle}</span></div></div>)}
          </div>
        </Reveal>
        <Reveal className="featured-heading featured-heading-after-capability"><div><p><span>02</span>｜重点项目精选</p><small>精选具有代表性的核心项目，展示完整的设计思路与落地成果。</small></div><span>FEATURED PROJECTS</span></Reveal>
        <div className="featured-grid">
          {featuredWorks.map(({ title, image, category, summary, impact, slug, detailPath, modules, number }) => <BorderGlow className="featured-glow" key={slug} glowColor="258 76 76" backgroundColor="#0c1222" borderRadius={12} glowRadius={20} glowIntensity={.72} coneSpread={20} fillOpacity={.16} colors={["#b18deb", "#5696ee", "#66d2c5"]}>
            <Link className="featured-card" to={detailPath ?? `/project/${slug}`}>
              <div className="featured-media"><img src={image} alt={title} loading="lazy" decoding="async" /></div>
              <div className="featured-copy"><div className="featured-kicker"><span>{number}</span><p>{category}</p></div><h3>{title}</h3><small>{summary}</small><p className="featured-impact"><span>DESIGN IMPACT</span>{impact}</p><div className="featured-tags">{modules.slice(0, 3).map((module) => <b key={module}>{module}</b>)}</div></div>
            </Link>
          </BorderGlow>)}
        </div>
        <Reveal className="archive-heading">
          <div><p><span>03</span>｜项目档案</p><h3>更多项目案例，展示在不同业务与场景下的设计实践</h3></div>
          <span>08 CASE STUDIES</span>
        </Reveal>
        <div className="work-grid">
          {works.map(({ title, image, category, slug }) => <BorderGlow className="work-glow" key={title} glowColor="258 76 76" backgroundColor="#101727" borderRadius={10} glowRadius={18} glowIntensity={.6} coneSpread={20} fillOpacity={.22} colors={["#b18deb", "#6a97e6", "#6cd7cf"]}>
            <Link className="work-card" to={`/project/${slug}`}>
              <div className="work-image"><img src={image} alt={title} loading="lazy" decoding="async" /></div>
              <div className="work-meta"><p>{category}</p><h3>{title}</h3><span className="work-action">查看案例 <b>↗</b></span></div>
            </Link>
          </BorderGlow>)}
        </div>
        <Reveal className="icon-motion-panel">
          <div className="icon-motion-heading">
            <div><p><span>04</span>｜图标动效</p><small>以系统图标动画呈现关键业务状态，让功能表达更直观、更有记忆点。</small></div>
            <span>ICON MOTION STUDIES</span>
          </div>
          <div className="icon-motion-rail">
            {iconMotions.map(({ number, title, label, video }) => <article className="icon-motion-card" key={number}>
              <video src={video} aria-label={title} autoPlay loop muted playsInline preload="metadata" />
              <div className="icon-motion-copy"><span className="icon-motion-index">{number}</span><div><strong>{title}</strong><span>{label}</span></div></div>
            </article>)}
          </div>
        </Reveal>
        <Reveal className="publication-panel">
          <div className="publication-copy">
            <p className="publication-kicker"><span>05</span>｜画册设计</p>
            <p className="publication-description">从项目画册到品牌视觉，持续探索信息、图像与留白之间的表达关系，让内容拥有更完整的阅读体验。</p>
          </div>
          <div className="publication-archive">
            <img className="publication-spread" src="/media/publication-design-spread.png" alt="新能源行业画册封面与内页设计展示" loading="lazy" decoding="async" />
            <div className="publication-divider">
              <img className="publication-spread publication-spread-secondary" src="/media/publication-design-covers.png" alt="新能源行业解决方案画册封面设计展示" loading="lazy" decoding="async" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <section ref={philosophyRef} className="philosophy-section" id="philosophy">
      <div className="philosophy-aurora" aria-hidden="true">
        {shouldRenderAurora && <Suspense fallback={null}><SoftAurora
          speed={0.4}
          scale={1.3}
          brightness={1.1}
          color1="#4f9fc9"
          color2="#8a62d7"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.45}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0.25}
          colorSpeed={0.75}
          enableMouseInteraction
          mouseInfluence={0.12}
        /></Suspense>}
      </div>
      <div className="frame philosophy-layout">
        <Reveal className="philosophy-heading">
          <p className="section-label motion-english">DESIGN PHILOSOPHY</p>
          <div className="philosophy-copy-row">
            <h2 className="motion-chinese">让每一次设计<br />都有清晰的理由</h2>
            <p className="philosophy-intro">好的体验设计并不是装饰。它是在复杂约束中建立秩序，让业务目标、用户任务和系统信息自然地抵达同一个答案。</p>
          </div>
        </Reveal>
      </div>
      <div className="frame principle-grid">
        {principles.map(([number, title, text]) => <Reveal className="principle-reveal" key={number}>
          <BorderGlow className="principle-glow" edgeSensitivity={34} glowColor="260 82 76" backgroundColor="rgba(13, 19, 42, .34)" borderRadius={11} glowRadius={28} glowIntensity={.78} coneSpread={22} fillOpacity={.14} colors={["#b596ef", "#6da8ed", "#78d6cd"]}>
            <article className="principle"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          </BorderGlow>
        </Reveal>)}
      </div>
      <div className="frame methodology-panel">
        <div className="methodology-heading"><p>方法论</p><span>DESIGN METHOD</span></div>
        <div className="methodology-list">
          {methodology.map(({ title, Icon, points }, index) => <article className="methodology-item" key={title}>
            <div className="methodology-step"><span className="methodology-icon"><Icon aria-hidden="true" /></span><b>{title}</b>{index < methodology.length - 1 && <i aria-hidden="true" />}</div>
            <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>)}
        </div>
      </div>
      <Link className="frame philosophy-project-link" to="/#works"><b>↓</b><span>以下为近年代表项目</span><small>SELECTED WORKS</small></Link>
    </section>

    <section className="contact-section" id="contact">
      <div className="frame contact-content">
        <Reveal><p className="section-label motion-english">LET'S CREATE CLARITY</p><h2 className="motion-chinese">用设计，<br /><span>让复杂变清晰。</span></h2></Reveal>
        <Reveal><a className="contact-link" href="mailto:hjmf1030@126.com">hjmf1030@126.com <b>↗</b></a></Reveal>
        <Reveal className="contact-discover">
          <div className="contact-discover-heading"><span>MORE WORKS</span><p>扫描二维码，查看更多作品</p></div>
          <div className="contact-qr-list">
            <article className="contact-qr-card contact-qr-primary"><div><strong>微信</strong><span>WECHAT CONTACT</span><small>扫码添加好友，交流合作</small></div><img src="/media/wechat-qrcode.png" alt="微信个人二维码" loading="lazy" decoding="async" /></article>
            <article className="contact-qr-card"><div><strong>站酷</strong><span>PROJECT CASE STUDIES</span><small>扫描查看项目拆解案例</small></div><img src="/media/zc-qrcode.png" alt="站酷项目拆解案例二维码" loading="lazy" decoding="async" /></article>
            <article className="contact-qr-card"><div><strong>花瓣</strong><span>VISUAL &amp; MOTION ARCHIVE</span><small>画册、Logo 与动效作品</small></div><img src="/media/huaban-qrcode.png" alt="花瓣视觉作品二维码" loading="lazy" decoding="async" /></article>
          </div>
        </Reveal>
      </div>
      <footer className="frame footer"><span>© 2026 Huang Juan</span><span>Shanghai, China</span><a href="#home">Back to top ↑</a></footer>
    </section>
  </main>;
}

function ProjectDetail() {
  const { slug } = useParams();
  const projectIndex = works.findIndex((item) => item.slug === slug);
  const project = works[projectIndex];

  if (!project) {
    return <main className="project-not-found"><Link to="/">返回作品集</Link><h1>项目暂未找到</h1></main>;
  }

  const nextProject = works[(projectIndex + 1) % works.length];
  const projectNumber = String(projectIndex + 1).padStart(2, "0");

  return <main className="project-page" id="top">
    <header className="detail-header">
      <Link className="detail-brand" to="/">Huang Juan<span>.</span></Link>
      <nav aria-label="项目导航"><Link to="/">作品集</Link><a href="#overview">项目概览</a><a href="#workspace">核心工作区</a></nav>
      <Link className="detail-back" to="/#works">返回首页 <b>↖</b></Link>
    </header>

    <section className="detail-hero">
      <div className="detail-dot-field" aria-hidden="true"><DotField dotRadius={1} dotSpacing={20} cursorRadius={390} bulgeStrength={36} glowRadius={210} waveAmplitude={0.16} gradientFrom="rgba(178, 154, 239, 0.28)" gradientTo="rgba(78, 151, 226, 0.1)" glowColor="#26245c" /></div>
      <aside className="detail-sidebar" aria-label="项目索引">
        <span>CASE STUDY</span><strong>{projectNumber}</strong>
        <div className="detail-side-line" />
        <p>{project.category}</p>
        <div className="detail-side-nav"><a href="#overview">01 / 概览</a><a href="#workspace">02 / 工作区</a><a href="#outcome">03 / 设计成果</a></div>
      </aside>

      <div className="detail-stage">
        <motion.div className="detail-title-block" initial={{ opacity: 0, y: 68 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}>
          <p>ENERGY DIGITAL EXPERIENCE / {projectNumber}</p>
          <h1>{project.title}</h1>
          <div className="detail-title-meta"><span>{project.category}</span><span>2026 / CASE ARCHIVE</span></div>
        </motion.div>

        <motion.div className="detail-visual" initial={{ clipPath: "inset(0 0 100% 0 round 14px)" }} animate={{ clipPath: "inset(0 0 0% 0 round 14px)" }} transition={{ duration: 1.35, delay: .18, ease: [0.76, 0, 0.24, 1] }}>
          <img src={project.image} alt={`${project.title} 核心界面`} />
          <div className="detail-visual-grid" aria-hidden="true" />
          <div className="detail-visual-status"><span>LIVE INTERFACE</span><i /><span>01 — SYSTEM ONLINE</span></div>
        </motion.div>
      </div>
    </section>

    <section className="detail-overview" id="overview">
      <p className="detail-section-index">01 / OVERVIEW</p>
      <div className="detail-overview-copy"><h2>在复杂系统中，<br />让决策路径变得清晰。</h2><p>{project.summary}</p></div>
      <dl className="detail-facts"><div><dt>MY ROLE</dt><dd>{project.role}</dd></div><div><dt>CORE OUTCOME</dt><dd>{project.outcome}</dd></div></dl>
    </section>

    <section className="detail-workspace" id="workspace">
      <div className="detail-workspace-heading"><p>02 / CORE WORKSPACE</p><h2>从全局判断到<br /><span>关键任务执行。</span></h2></div>
      <div className="detail-workspace-shell">
        <div className="workspace-toolbar"><span>SYSTEM WORKSPACE</span><div><i /><i /><i /></div><span>LIVE / 24H</span></div>
        <div className="workspace-main"><img src={project.image} alt="" /></div>
        <aside className="workspace-panel"><p>FUNCTION ZONES</p>{project.modules.map((module, index) => <div className="workspace-item" key={module}><span>{String(index + 1).padStart(2, "0")}</span><strong>{module}</strong><b>↗</b></div>)}<div className="workspace-signal"><span>OPERATION SIGNAL</span><strong>98.4%</strong><p>关键业务状态保持可见、可追溯、可行动。</p></div></aside>
      </div>
    </section>

    <section className="detail-outcome" id="outcome">
      <p>03 / DESIGN OUTCOME</p><h2>用统一的秩序，<span>连接系统与人。</span></h2>
      <Link to={`/project/${nextProject.slug}`} className="next-project"><span>NEXT CASE / {String((projectIndex + 2 - 1) % works.length + 1).padStart(2, "0")}</span><strong>{nextProject.title}</strong><b>↗</b></Link>
    </section>

    <footer className="detail-footer"><span>© 2026 HUANG JUAN</span><span>ENERGY DIGITAL EXPERIENCE PORTFOLIO</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}

function FullImageProject() {
  const { caseId } = useParams();
  const project = fullImageProjects[caseId];

  if (!project) {
    return <main className="project-not-found"><Link to="/">返回作品集</Link><h1>项目暂未找到</h1></main>;
  }

  return <main className="full-image-page" id="top">
    <header className="detail-header full-image-header">
      <Link className="detail-back" to="/#works">返回首页 <b>↖</b></Link>
    </header>

    <section className="full-image-intro">
      <p>CASE STUDY / {project.number}</p>
      <h1>{project.title}</h1>
      <span>FULL DESIGN PRESENTATION · {project.dimensions}</span>
      <dl className="full-image-proof" aria-label={`${project.title}项目摘要`}>
        <div><dt>PROJECT CONTEXT</dt><dd>{project.context}</dd></div>
        <div><dt>MY ROLE</dt><dd>{project.role}</dd></div>
        <div><dt>DESIGN FOCUS</dt><dd>{project.focus}</dd></div>
        <div><dt>DESIGN OUTCOME</dt><dd>{project.outcome}</dd></div>
      </dl>
    </section>

    <section className="full-image-stage" id="full-image">
      <img src={project.image} alt={`${project.title}完整设计长图`} decoding="async" fetchPriority="high" />
    </section>

    <footer className="detail-footer"><span>© 2026 HUANG JUAN</span><span>ENERGY DIGITAL EXPERIENCE PORTFOLIO</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}

export function App() {
  return <Routes>
    <Route path="/" element={<PortfolioHome />} />
    <Route path="/project/:caseId/full-image" element={<FullImageProject />} />
    <Route path="/project/:slug" element={<ProjectDetail />} />
    <Route path="*" element={<PortfolioHome />} />
  </Routes>;
}
