import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Beef,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Moon,
  Phone,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import beefRiceBowlImage from "./pictures/Beef RiceBowl.png";
import beefSaladImage from "./pictures/Beef Salad.png";
import chickenRiceBowlImage from "./pictures/Chicken Rice Bowl.png";
import chickenSaladImage from "./pictures/ChickenSalad.png";
import freshLumpiaImage from "./pictures/Fresh Lumpia.png";
import landingPageImage from "./pictures/landingPagePhoto.png";
import logoImage from "./pictures/logo.png";
import menuImage from "./pictures/menu.jpg";

const COLORS = {
  cream: "#FBF7EF",
  sand: "#F1E8D8",
  forest: "#1E3A2B",
  forestSoft: "#2B4A37",
  leaf: "#6B9C4A",
  herb: "#A5BF68",
  clay: "#B8734A",
  ink: "#232620",
};

const HERO_IMAGE = landingPageImage;

const menuItems = [
  {
    id: "chicken-salad",
    name: "Chicken Salad",
    category: "Salads",
    price: 150,
    calories: 380,
    protein: 32,
    description: "Fresh vegetables, tender chicken breast, and a bright house dressing.",
    image: chickenSaladImage,
    tags: ["Fresh vegetables", "Chicken breast", "Healthy dressing"],
  },
  {
    id: "beef-salad",
    name: "Beef Salad",
    category: "Salads",
    price: 170,
    calories: 420,
    protein: 35,
    description: "Premium beef over crisp greens with a savory homemade dressing.",
    image: beefSaladImage,
    tags: ["Premium beef", "Fresh vegetables", "Homemade dressing"],
  },
  {
    id: "chicken-bowl",
    name: "Chicken Rice Bowl",
    category: "Rice Bowls",
    price: 155,
    calories: 520,
    protein: 34,
    description: "Grilled chicken, warm rice, vegetables, and a clean, satisfying finish.",
    image: chickenRiceBowlImage,
    tags: ["Grilled chicken", "Rice", "Fresh vegetables"],
  },
  {
    id: "beef-bowl",
    name: "Beef Rice Bowl",
    category: "Rice Bowls",
    price: 155,
    calories: 560,
    protein: 36,
    description: "Tender beef, rice, crisp vegetables, and balanced flavor in every bite.",
    image: beefRiceBowlImage,
    tags: ["Premium beef", "Rice", "Fresh vegetables"],
  },
  {
    id: "lumpia",
    name: "Fresh Lumpia",
    category: "Favorites",
    price: 130,
    calories: 210,
    protein: 8,
    description: "Fresh homemade lumpia packed with vegetables and everyday comfort.",
    image: freshLumpiaImage,
    tags: ["Homemade", "Vegetables", "Light snack"],
  },
];

const gallery = [
  { label: "Chicken Salad", image: menuItems[0].image },
  { label: "Beef Salad", image: menuItems[1].image },
  { label: "Chicken Rice Bowl", image: menuItems[2].image },
  { label: "Beef Rice Bowl", image: menuItems[3].image },
  { label: "Fresh Lumpia", image: menuItems[4].image },
  {
    label: "Menu",
    image: menuImage,
  },
];

const reviews = [
  { name: "Kristine A.", text: "One of the best healthy meals I've had!" },
  { name: "Marco D.", text: "Affordable and filling. Perfect for office lunch." },
  { name: "Aya R.", text: "The beef salad is amazing. The dressing tastes premium." },
  { name: "Jhun P.", text: "Perfect for my fitness goals and still delicious." },
];

const menuHighlights = [
  ["32g+", "average protein"],
  ["PHP 130", "starts at"],
  ["8 AM", "weekday start"],
];

const faqs = [
  { q: "Do you deliver?", a: "Yes. We deliver around Laoag City Centro, with free delivery available within the service zone." },
  { q: "How do I order?", a: "Tap Order Now, message us on Facebook Messenger, or contact us directly by phone." },
  { q: "What are your operating hours?", a: "Joe Mama is open Monday to Friday, 8:00 AM to 5:00 PM." },
  { q: "Are your meals prepared daily?", a: "Yes. Every meal is prepared fresh daily using quality vegetables, meats, and dressings." },
  { q: "Do you accept bulk orders?", a: "Yes. We accept group, office, and fitness meal orders with advance notice." },
];

const FEEDBACK_STORAGE_KEY = "joe-mama-feedback";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const formatFeedbackTime = (createdAt) => {
  if (!createdAt) return "Just now";
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const normalizeFeedback = (item) => ({
  id: item.id || `${item.name || "guest"}-${item.created_at || item.createdAt || Date.now()}`,
  name: item.name || "Guest",
  message: item.message || "",
  createdAt: item.created_at || item.createdAt || new Date().toISOString(),
});

const readLocalFeedback = () => {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]").map(normalizeFeedback);
  } catch {
    return [];
  }
};

const writeLocalFeedback = (items) => {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
};

const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Reveal = ({ children, className = "", delay = 0 }) => {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 650ms ease ${delay}ms, transform 650ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const SectionLabel = ({ children, dark = false }) => (
  <p
    className="font-mono text-xs font-bold uppercase tracking-[0.22em]"
    style={{ color: dark ? COLORS.herb : COLORS.clay }}
  >
    {children}
  </p>
);

const Price = ({ value }) => (
  <span className="rounded-full px-3 py-1 font-mono text-xs font-bold text-white" style={{ background: COLORS.clay }}>
    PHP {value}
  </span>
);

const Nav = ({ darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["#menu", "Menu"],
    ["#about", "About"],
    ["#gallery", "Gallery"],
    ["#faq", "FAQs"],
    ["#contact", "Contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-all duration-300 sm:px-6"
      style={{
        color: darkMode ? COLORS.cream : COLORS.forest,
      }}
    >
      <div
        className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border px-3 pl-4 transition-all duration-300 sm:px-4 sm:pl-5"
        style={{
          background: scrolled
            ? darkMode
              ? "rgba(22,41,29,0.88)"
              : "rgba(251,247,239,0.9)"
            : "rgba(251,247,239,0.14)",
          borderColor: scrolled ? "rgba(30,58,43,0.14)" : "rgba(255,255,255,0.28)",
          backdropFilter: "blur(18px)",
          boxShadow: scrolled ? "0 18px 50px rgba(10, 30, 18, 0.16)" : "0 12px 36px rgba(0,0,0,0.08)",
        }}
      >
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label="Joe Mama home">
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full border bg-white shadow-sm transition group-hover:scale-105" style={{ borderColor: "rgba(255,255,255,0.55)" }}>
            <img src={logoImage} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-xl font-bold leading-none" style={{ color: scrolled || darkMode ? (darkMode ? COLORS.cream : COLORS.forest) : "white" }}>
              Joe Mama
            </span>
            <span className="mt-1 hidden font-mono text-[9px] font-bold uppercase tracking-[0.2em] sm:block" style={{ color: scrolled || darkMode ? COLORS.leaf : "rgba(255,255,255,0.78)" }}>
              High Protein, Fresh Meals
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-full border p-1 md:flex"
          style={{
            background: scrolled ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.16)",
            borderColor: scrolled ? "rgba(30,58,43,0.1)" : "rgba(255,255,255,0.22)",
          }}
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-bold transition hover:bg-white hover:text-[#1E3A2B] hover:shadow-sm"
              style={{ color: scrolled || darkMode ? (darkMode ? COLORS.cream : COLORS.forest) : "white" }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => setDarkMode((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105 hover:bg-white hover:text-[#1E3A2B]"
            style={{
              borderColor: scrolled ? "rgba(30,58,43,0.14)" : "rgba(255,255,255,0.28)",
              color: scrolled || darkMode ? (darkMode ? COLORS.cream : COLORS.forest) : "white",
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#menu" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5" style={{ background: COLORS.leaf }}>
            <ShoppingBag size={16} />
            Order Now
          </a>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border md:hidden"
          onClick={() => setOpen(!open)}
          style={{
            borderColor: scrolled ? "rgba(30,58,43,0.14)" : "rgba(255,255,255,0.28)",
            color: scrolled || darkMode ? (darkMode ? COLORS.cream : COLORS.forest) : "white",
          }}
          aria-label="Open menu"
        >
          {open ? <X /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl border p-3 shadow-2xl md:hidden" style={{ background: darkMode ? "rgba(22,41,29,0.96)" : "rgba(251,247,239,0.96)", borderColor: "#1E3A2B22", backdropFilter: "blur(18px)" }}>
          <div className="grid gap-1">
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold transition hover:bg-white/50">
                {label}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t pt-3" style={{ borderColor: darkMode ? "rgba(255,255,255,0.12)" : "rgba(30,58,43,0.12)" }}>
              <button
                onClick={() => setDarkMode((value) => !value)}
                className="grid h-12 w-12 place-items-center rounded-full border"
                style={{ borderColor: "#1E3A2B22" }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a href="#menu" onClick={() => setOpen(false)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-center text-sm font-bold text-white" style={{ background: COLORS.leaf }}>
                <ShoppingBag size={16} />
                Order Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => (
  <section id="top" className="relative min-h-[94vh] overflow-hidden pt-20">
    <img src={HERO_IMAGE} alt="Fresh salads and healthy bowls" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(184,115,74,0.34),transparent_32%),linear-gradient(110deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.46)_48%,rgba(0,0,0,0.22)_100%)]" />

    <div className="relative mx-auto flex min-h-[94vh] max-w-6xl flex-col justify-center px-5 pb-20 pt-20 sm:px-8">
      <Reveal className="max-w-4xl">
        <div className="mb-5 flex flex-wrap gap-2">
          {["Fresh Daily", "High Protein", "Affordable", "Fast Delivery"].map((item) => (
            <span key={item} className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              {item}
            </span>
          ))}
        </div>
        <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
          Healthy Food That Doesn't Taste Like Diet Food.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
          Fresh ingredients. High protein. Affordable meals delivered straight to your doorstep in Laoag.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#menu" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-white shadow-xl transition hover:-translate-y-0.5" style={{ background: COLORS.leaf }}>
            <ShoppingBag size={18} /> Order Now
          </a>
          <a href="#menu" className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20">
            View Menu
          </a>
        </div>
      </Reveal>

      <Reveal delay={180} className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8">
        <div className="ml-auto grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-white/18 bg-white/12 text-white shadow-2xl backdrop-blur-xl">
          {menuHighlights.map(([value, label]) => (
            <div key={label} className="border-r border-white/14 px-4 py-4 last:border-r-0 sm:px-6">
              <p className="font-serif text-2xl font-semibold leading-none sm:text-3xl">{value}</p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/68">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const About = () => {
  const items = [
    [Leaf, "Fresh Ingredients"],
    [Beef, "High Protein"],
    [Sparkles, "Balanced Meals"],
    [MapPin, "Locally Prepared"],
    [Wallet, "Affordable Pricing"],
  ];

  return (
    <section id="about" className="px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal className="relative min-h-[430px]">
          <div className="absolute left-0 top-0 h-72 w-[72%] overflow-hidden rounded-[2rem] shadow-2xl sm:h-80">
            <img src={chickenRiceBowlImage} alt="Chicken rice bowl" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 h-64 w-[62%] overflow-hidden rounded-[2rem] border-[10px] shadow-xl" style={{ borderColor: COLORS.cream }}>
            <img src={freshLumpiaImage} alt="Fresh lumpia" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-14 left-4 rounded-2xl px-5 py-4 text-white shadow-xl" style={{ background: COLORS.clay }}>
            <p className="font-serif text-3xl font-semibold leading-none">Fresh</p>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">prepared daily</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SectionLabel>About Joe Mama</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: COLORS.forest }}>
            Healthy eating made simple, delicious, and accessible.
          </h2>
          <p className="mt-6 text-lg leading-8 opacity-80">
            Joe Mama was created with one mission: to make healthy eating simple, delicious, and accessible.
            Every meal is prepared using fresh ingredients to give you the nutrition you need without compromising flavor.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm" style={{ background: "rgba(255,255,255,0.68)", borderColor: "#1E3A2B14" }}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" style={{ background: COLORS.forest }}>
                  <Icon size={20} />
                </div>
                <p className="text-xs font-bold leading-5">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", "Salads", "Rice Bowls", "Favorites"];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = !needle || `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section id="menu" className="px-5 py-24 sm:px-8" style={{ background: COLORS.cream }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="max-w-2xl">
              <SectionLabel>Featured Menu</SectionLabel>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: COLORS.forest }}>
                Fresh fuel for busy days.
              </h2>
              <p className="mt-4 text-base leading-7 opacity-70">
                A short, focused menu keeps ordering easy while each meal still gets its own character.
              </p>
            </div>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 justify-self-start rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 lg:justify-self-end" style={{ background: COLORS.forest }}>
              <MessageCircle size={16} />
              Order via Messenger
            </a>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className="rounded-full px-4 py-2 text-sm font-bold transition"
                  style={category === item ? { background: COLORS.leaf, color: "white" } : { background: COLORS.sand, color: COLORS.forest }}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="relative block lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={17} />
              <span className="sr-only">Search menu</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search salads, bowls, protein..."
                className="w-full rounded-full border bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-4"
                style={{ borderColor: "#1E3A2B18" }}
              />
            </label>
          </div>
        </Reveal>

        <div className="mt-9 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <Reveal key={item.id} delay={index * 55} className={index === 0 ? "sm:col-span-2" : ""}>
              <article
                className={`group grid h-full overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  index === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
                }`}
                style={{ borderColor: "#1E3A2B14" }}
              >
                <div className={`relative overflow-hidden ${index === 0 ? "min-h-72" : "aspect-[4/3]"}`}>
                  <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-4 top-4">
                    <Price value={item.price} />
                  </div>
                </div>
                <div className={`flex flex-col p-5 ${index === 0 ? "justify-center sm:p-8" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-serif font-semibold ${index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`} style={{ color: COLORS.forest }}>
                      {item.name}
                    </h3>
                    <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: COLORS.sand, color: COLORS.forest }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-75">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#E7F0DA] px-3 py-1 font-mono text-xs font-bold text-[#31572C]">{item.protein}g protein</span>
                    <span className="rounded-full bg-[#F7E5D7] px-3 py-1 font-mono text-xs font-bold text-[#8A4A2B]">{item.calories} kcal</span>
                  </div>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
                    style={{ background: COLORS.forest }}
                  >
                    <MessageCircle size={16} />
                    Order This Meal
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChoose = () => {
  const items = [
    [Leaf, "Fresh Ingredients", "Only quality vegetables and meats prepared daily."],
    [Beef, "High Protein", "Meals designed to keep you full and energized."],
    [Wallet, "Affordable", "Healthy eating should not be expensive."],
    [Truck, "Fast Delivery", "Quick preparation and reliable delivery."],
    [Clock, "Made Fresh Daily", "Every order is freshly prepared."],
    [Star, "Customer Favorite", "Loved by repeat customers."],
  ];

  return (
    <section className="px-5 py-24 text-white sm:px-8" style={{ background: COLORS.forest }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <SectionLabel dark>Why Choose Joe Mama</SectionLabel>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Premium quality, everyday prices.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/70 lg:justify-self-end">
              The brand promise is simple: meals that feel good enough for lunch break, gym days, and repeat orders.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, title, desc], index) => (
            <Reveal key={title} delay={index * 55} className={index === 0 || index === 3 ? "lg:col-span-2" : ""}>
              <div
                className="h-full rounded-2xl border border-white/10 p-6"
                style={{ background: index === 0 ? "rgba(165,191,104,0.16)" : "rgba(255,255,255,0.06)" }}
              >
                <Icon size={28} color={COLORS.herb} />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/72">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    ["Choose Your Meal", "Browse our healthy menu and pick the salad, bowl, or favorite that fits your day."],
    ["Place Your Order", "Order through Messenger or contact us directly. We confirm the details quickly."],
    ["Enjoy Fresh Food", "Receive freshly prepared meals delivered to you while everything still tastes bright."],
  ];

  return (
    <section className="px-5 py-24 sm:px-8" style={{ background: COLORS.sand }}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.68fr_1fr] lg:items-start">
        <Reveal>
          <SectionLabel>How Ordering Works</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: COLORS.forest }}>
            Three steps. Fresh food.
          </h2>
          <p className="mt-5 text-base leading-7 opacity-70">
            No complicated cart. Pick a meal, send a message, and confirm delivery.
          </p>
        </Reveal>
        <div className="grid gap-4">
          {steps.map(([title, desc], index) => (
            <Reveal key={title} delay={index * 90}>
              <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-[4.5rem_1fr] sm:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full font-serif text-2xl font-bold text-white" style={{ background: index === 1 ? COLORS.clay : COLORS.leaf }}>
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: COLORS.forest }}>{title}</h3>
                  <p className="mt-2 text-sm leading-6 opacity-75">{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((value) => (value + 1) % reviews.length);
  const prev = () => setIndex((value) => (value - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const timer = window.setInterval(next, 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="px-5 py-24 sm:px-8" style={{ background: COLORS.cream }}>
      <Reveal className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-center">
        <div>
          <SectionLabel>Customer Reviews</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: COLORS.forest }}>
            Real notes from people who order again.
          </h2>
        </div>
        <div className="rounded-3xl border bg-white p-8 shadow-sm" style={{ borderColor: "#1E3A2B14" }}>
          <div className="mb-5 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill={COLORS.clay} color={COLORS.clay} />
            ))}
          </div>
          <p className="font-serif text-2xl font-semibold leading-snug sm:text-3xl" style={{ color: COLORS.forest }}>
            "{reviews[index].text}"
          </p>
          <p className="mt-4 font-mono text-sm opacity-65">{reviews[index].name}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full" style={{ background: COLORS.sand }} aria-label="Previous review">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {reviews.map((item, i) => (
                <span key={item.name} className="h-2 rounded-full transition-all" style={{ width: i === index ? 22 : 8, background: i === index ? COLORS.forest : "#1E3A2B33" }} />
              ))}
            </div>
            <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full" style={{ background: COLORS.sand }} aria-label="Next review">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const Gallery = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="gallery" className="px-5 py-20 sm:px-8" style={{ background: COLORS.sand }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>Gallery</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl" style={{ color: COLORS.forest }}>
            Fresh, colorful, ready to eat.
          </h2>
        </Reveal>
        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((item, index) => (
            <Reveal key={item.label} delay={index * 45} className={index === 0 ? "col-span-2 row-span-2" : ""}>
              <button
                onClick={() => setActive(index)}
                className="group relative h-full min-h-40 w-full overflow-hidden rounded-2xl text-left shadow-sm"
                aria-label={`Open ${item.label} image`}
              >
                <img src={item.image} alt={item.label} loading="lazy" className="h-full min-h-40 w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 font-bold text-white">{item.label}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/82 p-4" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black" onClick={(event) => event.stopPropagation()}>
            <img src={gallery[active].image} alt={gallery[active].label} className="max-h-[78vh] w-full object-cover" />
            <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur" onClick={() => setActive(null)} aria-label="Close gallery image">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-5 py-20 sm:px-8" style={{ background: COLORS.cream }}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionLabel>FAQs</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl" style={{ color: COLORS.forest }}>
            Good to know before you order.
          </h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => (
            <Reveal key={item.q} delay={index * 45}>
              <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "#1E3A2B14" }}>
                <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold" onClick={() => setOpen(open === index ? -1 : index)} style={{ color: COLORS.forest }}>
                  {item.q}
                  <ChevronDown size={18} className="shrink-0 transition" style={{ transform: open === index ? "rotate(180deg)" : "none" }} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: open === index ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 opacity-75">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoadingFeedback(true);
      setFeedbackError("");
      await fetchFeedback();
      setLoadingFeedback(false);
    };

    const fetchFeedback = async () => {
      if (!HAS_SUPABASE) {
        setFeedback(readLocalFeedback());
        return;
      }

      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/feedback?select=id,name,message,created_at&order=created_at.desc&limit=20`,
          { headers: supabaseHeaders }
        );

        if (!response.ok) throw new Error("Unable to load feedback.");

        const data = await response.json();
        setFeedback(data.map(normalizeFeedback));
      } catch {
        setFeedbackError("Feedback could not load right now.");
      }
    };

    loadFeedback();

    if (!HAS_SUPABASE) return undefined;

    const refreshTimer = window.setInterval(fetchFeedback, 15000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Please enter a valid email.";
    if (!form.message.trim()) nextErrors.message = "Please write your feedback.";
    if (form.message.trim().length > 240) nextErrors.message = "Please keep feedback under 240 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitting(true);
      setFeedbackError("");

      const nextFeedback = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: form.name.trim(),
        message: form.message.trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        if (HAS_SUPABASE) {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
            method: "POST",
            headers: { ...supabaseHeaders, Prefer: "return=representation" },
            body: JSON.stringify({
              name: nextFeedback.name,
              message: nextFeedback.message,
            }),
          });

          if (!response.ok) throw new Error("Unable to save feedback.");

          const [savedFeedback] = await response.json();
          setFeedback((items) => [normalizeFeedback(savedFeedback), ...items]);
        } else {
          setFeedback((items) => {
            const updated = [nextFeedback, ...items].slice(0, 20);
            writeLocalFeedback(updated);
            return updated;
          });
        }

        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } catch {
        setFeedbackError("Your feedback could not be saved. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-5 py-24 text-white sm:px-8" style={{ background: COLORS.forest }}>
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-28">
          <SectionLabel dark>Contact & Feedback</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Tell us what you think.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/70">
            Order through Messenger or leave a quick note. Feedback appears here after it is saved.
          </p>
          <div className="mt-8 space-y-4 text-white/82">
            <a href="https://www.facebook.com/profile.php?id=61574436017896" className="flex items-center gap-3 transition hover:text-white">
              <Facebook size={20} color={COLORS.herb} /> facebook.com/joemamaph
            </a>
            <a href="tel:+639079483551" className="flex items-center gap-3 transition hover:text-white">
              <Phone size={20} color={COLORS.herb} /> +63 907 948 3551
            </a>
            <p className="flex items-center gap-3"><Clock size={20} color={COLORS.herb} /> Monday to Friday, 8:00 AM to 5:00 PM</p>
            <p className="flex items-center gap-3"><Truck size={20} color={COLORS.herb} /> Free delivery around Laoag City Centro</p>
            <p className="flex items-center gap-3"><MapPin size={20} color={COLORS.herb} /> Laoag City Centro, Ilocos Norte</p>
          </div>
          <a href="https://www.facebook.com/profile.php?id=61574436017896" className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-white transition hover:scale-105" style={{ background: COLORS.leaf }}>
            <MessageCircle size={18} /> Order Now
          </a>
          <div className="mt-10 grid max-w-sm grid-cols-2 overflow-hidden rounded-2xl border border-white/10">
            <div className="p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <p className="font-serif text-3xl font-semibold">{feedback.length}</p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/58">comments</p>
            </div>
            <div className="border-l border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="font-serif text-3xl font-semibold">15s</p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/58">refresh</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-3xl border border-white/10 p-5 shadow-2xl sm:p-6" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="mb-5">
                <h3 className="text-xl font-bold">Leave Feedback</h3>
                <p className="mt-1 text-sm text-white/62">Short, helpful notes work best.</p>
              </div>
              {sent && (
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3" style={{ background: "rgba(107,156,74,0.18)" }}>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: COLORS.leaf }}>
                    <Check size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Feedback posted.</p>
                    <p className="text-xs text-white/70">Your comment is now shown below.</p>
                  </div>
                  <button className="ml-auto text-sm font-bold text-white/70 hover:text-white" onClick={() => setSent(false)} aria-label="Dismiss feedback notice">
                    <X size={17} />
                  </button>
                </div>
              )}
              {feedbackError && (
                <div className="mb-5 rounded-2xl border border-[#FFD0B8]/40 px-4 py-3 text-sm text-[#FFD0B8]" style={{ background: "rgba(184,115,74,0.16)" }}>
                  {feedbackError}
                </div>
              )}
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="name">Name</label>
                  <input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border-0 px-4 py-3 text-sm text-[#232620] outline-none" placeholder="Your name" />
                  {errors.name && <p className="mt-1 text-xs text-[#FFD0B8]">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="email">Email</label>
                  <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-2xl border-0 px-4 py-3 text-sm text-[#232620] outline-none" placeholder="you@example.com" />
                  {errors.email && <p className="mt-1 text-xs text-[#FFD0B8]">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="message">Feedback</label>
                  <textarea id="message" rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="w-full resize-none rounded-2xl border-0 px-4 py-3 text-sm text-[#232620] outline-none" placeholder="Tell us your feedback. Thank you for supporting Joe Mama." />
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs">
                    {errors.message ? <p className="text-[#FFD0B8]">{errors.message}</p> : <span />}
                    <p className="text-white/48">{form.message.length}/240</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: COLORS.leaf }}
                >
                  <Send size={17} /> {submitting ? "Saving Feedback..." : "Send Feedback"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 p-5 shadow-2xl sm:p-6" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Feedback Wall</h3>
                  <p className="mt-1 text-sm text-white/68">Recent comments from visitors.</p>
                </div>
                <span className="rounded-full px-3 py-1 font-mono text-xs font-bold" style={{ background: COLORS.leaf }}>
                  {feedback.length}
                </span>
              </div>
              {loadingFeedback ? (
                <div className="mt-5 rounded-2xl border border-white/10 p-5 text-sm leading-6 text-white/68" style={{ background: "rgba(255,255,255,0.05)" }}>
                  Loading feedback...
                </div>
              ) : feedback.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/10 p-5 text-sm leading-6 text-white/68" style={{ background: "rgba(255,255,255,0.05)" }}>
                  No feedback yet. Be the first to leave a comment.
                </div>
              ) : (
                <div className="mt-5 grid max-h-[34rem] gap-3 overflow-y-auto pr-1">
                  {feedback.map((item) => (
                    <article key={item.id} className="rounded-2xl bg-white p-4 text-[#232620] shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: COLORS.forest }}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-bold" style={{ color: COLORS.forest }}>{item.name}</h4>
                          <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-50">{formatFeedbackTime(item.createdAt)}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 opacity-80">"{item.message}"</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="px-5 pb-8 pt-14 text-white sm:px-8" style={{ background: "#16291D" }}>
    <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
      <div>
        <div className="flex items-center gap-3">
          <span className="block h-20 w-20 overflow-hidden rounded-full bg-white shadow-lg">
            <img src={logoImage} alt="" className="h-full w-full object-cover" />
          </span>
        </div>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Fresh, affordable, high-protein meals for fitness enthusiasts, office workers, students, and busy professionals.</p>
        <div className="mt-5 flex gap-3">
          <a href="https://facebook.com/" className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Facebook">
            <Facebook size={18} />
          </a>
        </div>
      </div>
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: COLORS.herb }}>Quick Links</h3>
        <div className="mt-4 grid gap-2 text-sm text-white/70">
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#faq">FAQs</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: COLORS.herb }}>Menu</h3>
        <div className="mt-4 grid gap-2 text-sm text-white/70">
          {menuItems.map((item) => (
            <a key={item.id} href="#menu">{item.name}</a>
          ))}
        </div>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
      Copyright {new Date().getFullYear()} Joe Mama. All Rights Reserved.
    </div>
  </footer>
);

const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:right-8">
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-12 w-12 place-items-center rounded-full text-white shadow-xl" style={{ background: COLORS.forest }} aria-label="Back to top">
          <ArrowUp size={18} />
        </button>
      )}
      <a href="https://www.facebook.com/profile.php?id=61574436017896" className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition hover:scale-105" style={{ background: COLORS.leaf }} aria-label="Open Messenger chat">
        <MessageCircle size={24} />
      </a>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;700&display=swap');
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        .font-serif { font-family: 'Fraunces', Georgia, serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        * { box-sizing: border-box; }
        input:focus, textarea:focus { box-shadow: 0 0 0 4px rgba(107, 156, 74, 0.22); }
        .dark section:not(#top) { background-color: #16291D !important; }
        .dark #about, .dark #gallery, .dark #faq { background-color: #203B2A !important; }
        .dark article, .dark form, .dark .bg-white { background-color: #FBF7EF; color: #232620; }
      `}</style>
      <main
        style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: darkMode ? "#16291D" : COLORS.cream,
          color: darkMode ? COLORS.cream : COLORS.ink,
        }}
      >
        <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
        <Hero />
        <About />
        <MenuSection />
        <WhyChoose />
        <HowItWorks />
        <Reviews />
        <Gallery />
        <FAQ />
        <Contact />
        <Footer />
        <FloatingActions />
      </main>
    </div>
  );
}
