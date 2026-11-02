import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CarFront,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  CircleEllipsis,
  Download,
  FileText,
  HeartPulse,
  House,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import {
  categories,
  clearSession,
  getSession,
  getUserData,
  getUsers,
  hashPassword,
  makeId,
  saveSession,
  saveUserData,
  saveUsers,
} from "./storage.js";

const iconMap = {
  utensils: Utensils,
  car: CarFront,
  "shopping-bag": ShoppingBag,
  receipt: Receipt,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
  house: House,
  "circle-ellipsis": CircleEllipsis,
};

function formatCurrency(value, compact = false) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: compact ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(Number(value) || 0);
}

function todayString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function categoryFor(name) {
  return categories.find((item) => item.name === name) || categories[categories.length - 1];
}

function Brand({ light = false }) {
  return (
    <Link className={`brand ${light ? "brand-light" : ""}`} to="/">
      <span className="brand-mark"><Wallet size={19} strokeWidth={2.2} /></span>
      <span>pennywise<span className="brand-period">.</span></span>
    </Link>
  );
}

function AuthLayout({ children, mode }) {
  return (
    <main className="auth-page">
      <div className="auth-art" aria-hidden="true">
        <div className="art-glow art-glow-one" />
        <div className="art-glow art-glow-two" />
        <div className="art-grid" />
        <div className="art-top"><Brand light /><span className="private-label"><LockKeyhole size={14} /> Private by design</span></div>
        <div className="art-copy">
          <div className="art-kicker"><span /> YOUR MONEY, IN GOOD HANDS</div>
          <h1>A little more<br />clarity. A lot more<br /><span>peace of mind.</span></h1>
          <p>Make room for what matters. Keep your spending simple, thoughtful, and all in one place.</p>
          <div className="art-note"><span className="note-icon"><TrendingUp size={18} /></span><span><b>Small steps add up.</b><br />Make your money work for you.</span></div>
        </div>
        <div className="art-foot"><span>YOUR FINANCES, YOUR WAY</span><span>01 — 03</span></div>
      </div>
      <section className="auth-panel">
        <div className="auth-mobile-brand"><Brand /></div>
        {children}
        <div className="auth-privacy"><LockKeyhole size={14} /> Your financial data stays on this device.</div>
      </section>
    </main>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = getUsers();
      if (isRegister) {
        if (name.trim().length < 2) throw new Error("Please enter a name with at least 2 characters.");
        if (password.length < 6) throw new Error("Your password must be at least 6 characters.");
        if (users.some((user) => user.email === cleanEmail)) throw new Error("An account with this email already exists.");
        const salt = makeId();
        const user = { id: makeId(), name: name.trim(), email: cleanEmail, salt, passwordHash: await hashPassword(password, salt) };
        saveUsers([...users, user]);
        saveSession(user);
      } else {
        const user = users.find((item) => item.email === cleanEmail);
        if (!user || await hashPassword(password, user.salt) !== user.passwordHash) {
          throw new Error("That email and password combination doesn't look right.");
        }
        saveSession(user);
      }
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout mode={mode}>
      <div className="auth-card">
        <div className="auth-eyebrow">{isRegister ? "A FRESH START" : "WELCOME BACK"}</div>
        <h2>{isRegister ? "Create your account" : "Good to see you again."}</h2>
        <p className="auth-intro">{isRegister ? "A calmer relationship with money starts here." : "Your money, right where you left it."}</p>
        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <label className="field-label">Your name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Morgan" required minLength={2} />
            </label>
          )}
          <label className="field-label">Email address
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <label className="field-label">Password
            <input type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? "At least 6 characters" : "Enter your password"} required minLength={isRegister ? 6 : undefined} />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>
            {busy ? "One moment…" : isRegister ? "Create my account" : "Sign in"} <ArrowRight size={17} />
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to Pennywise?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link>
        </p>
        {!isRegister && <div className="auth-footnote"><Check size={14} /> Your password is securely hashed before it is stored.</div>}
      </div>
    </AuthLayout>
  );
}

function Sidebar({ active, navigate, user, onLogout, open, onClose }) {
  const links = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Transactions", path: "/dashboard/transactions", icon: Receipt },
    { label: "Insights", path: "/dashboard/insights", icon: ChartNoAxesCombined },
    { label: "Your budget", path: "/dashboard/budget", icon: Wallet },
  ];
  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand-row"><Brand light /><button className="icon-button mobile-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button></div>
        <div className="workspace-label">YOUR SPACE</div>
        <nav className="side-nav">
          {links.map(({ label, path, icon: Icon }) => (
            <button key={path} className={`nav-item ${active === path ? "nav-item-active" : ""}`} onClick={() => { navigate(path); onClose(); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{active === path && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Sparkles size={17} /></span>
            <span className="tip-label">A gentle reminder</span>
            <p>Every small choice brings you closer to your bigger goals.</p>
          </div>
          <button className="profile-button" onClick={onLogout} title="Sign out">
            <span className="avatar">{(user?.name || "P").slice(0, 1).toUpperCase()}</span>
            <span className="profile-copy"><b>{user?.name || "Your account"}</b><small>{user?.email}</small></span>
            <LogOut size={17} className="profile-logout" />
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ title, subtitle, onMenu, onAdd }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={21} /></button>
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topbar-actions"><div className="date-chip"><CalendarDays size={15} /> {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div><button className="button button-primary topbar-add" onClick={onAdd}><Plus size={17} /> Add expense</button></div>
    </header>
  );
}

function MetricCard({ label, value, note, icon: Icon, tone, trend, currency = true }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={19} strokeWidth={1.9} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{currency ? formatCurrency(value) : new Intl.NumberFormat("en-IN").format(Number(value) || 0)}</div>
      <div className="metric-note">{trend && <span className="trend"><ArrowDownLeft size={13} /> {trend}</span>}{note}</div>
    </article>
  );
}

function CategoryBreakdown({ expenses }) {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totals = categories.map((category) => ({
    ...category,
    amount: expenses.filter((item) => item.category === category.name).reduce((sum, item) => sum + Number(item.amount), 0),
  })).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  return (
    <section className="card breakdown-card">
      <div className="section-heading"><div><h2>Where it goes</h2><p>A little perspective on your spending</p></div><button className="quiet-link" onClick={() => window.dispatchEvent(new CustomEvent("pennywise:navigate", { detail: "/dashboard/insights" }))}>See insights <ArrowRight size={14} /></button></div>
      {totals.length === 0 ? <EmptyState title="Your breakdown starts here" body="Add your first expense to see where your money goes." /> : (
        <div className="breakdown-content">
          <div className="donut-wrap" aria-label={`${formatCurrency(total)} total across ${totals.length} categories`}>
            <div className="donut" style={{ background: `conic-gradient(${(() => { let progress = 0; return totals.map((item) => { const start = progress; progress += item.amount / total * 100; return `${item.color} ${start}% ${progress}%`; }).join(", "); })()})` }}>
              <div className="donut-center"><span>THIS MONTH</span><b>{formatCurrency(total, true)}</b></div>
            </div>
          </div>
          <div className="category-list">
            {totals.slice(0, 5).map((item) => {
              const Icon = iconMap[item.icon];
              return <div className="category-row" key={item.name}><span className="category-icon" style={{ color: item.color, backgroundColor: `${item.color}1a` }}><Icon size={15} /></span><span className="category-name">{item.name}</span><span className="category-percent">{Math.round(item.amount / total * 100)}%</span><b>{formatCurrency(item.amount, true)}</b></div>;
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyState({ title, body, action }) {
  return <div className="empty-state"><span className="empty-icon"><FileText size={20} /></span><b>{title}</b><p>{body}</p>{action}</div>;
}

function TransactionList({ expenses, onDelete, onEdit, showAll = false, onSeeAll }) {
  const visible = showAll ? expenses : expenses.slice(0, 5);
  return (
    <section className="card transactions-card">
      <div className="section-heading"><div><h2>{showAll ? "All transactions" : "Recent transactions"}</h2><p>{showAll ? `${expenses.length} in your record` : "The little things, adding up"}</p></div>{!showAll && <button className="quiet-link" onClick={onSeeAll}>View all <ArrowRight size={14} /></button>}</div>
      {visible.length === 0 ? <EmptyState title="Nothing to see just yet" body="Your expenses will show up here once you add them." /> : (
        <div className="transaction-list">
          {visible.map((expense) => {
            const category = categoryFor(expense.category);
            const Icon = iconMap[category.icon];
            return <div className="transaction-row" key={expense.id}>
              <span className="transaction-icon" style={{ color: category.color, backgroundColor: `${category.color}1a` }}><Icon size={17} /></span>
              <div className="transaction-main"><b>{expense.notes || expense.category}</b><span>{expense.category} <i /> {new Date(`${expense.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></div>
              <b className="transaction-amount">−{formatCurrency(expense.amount)}</b>
              <div className="transaction-actions"><button title="Edit expense" aria-label={`Edit ${expense.notes || expense.category}`} onClick={() => onEdit(expense)}><Settings size={15} /></button><button title="Delete expense" aria-label={`Delete ${expense.notes || expense.category}`} onClick={() => onDelete(expense.id)}><X size={16} /></button></div>
            </div>;
          })}
        </div>
      )}
    </section>
  );
}

function SpendingChart({ expenses }) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { label: date.toLocaleDateString("en-IN", { month: "short" }), key: monthKey, amount: 0 };
  });
  expenses.forEach((expense) => {
    const month = months.find((item) => item.key === expense.date.slice(0, 7));
    if (month) month.amount += Number(expense.amount);
  });
  const maxAmount = Math.max(...months.map((month) => month.amount), 0);
  const max = Math.max(Math.ceil(maxAmount / 1000) * 1000, 1000);
  const points = months.map((month, index) => {
    const x = 20 + index * 64;
    const y = 128 - month.amount / max * 95;
    return `${x},${y}`;
  }).join(" ");
  return (
    <section className="card chart-card">
      <div className="section-heading"><div><h2>Your spending rhythm</h2><p>A view of the last six months</p></div><span className="chart-period"><span /> Monthly</span></div>
      <div className="chart-area">
        <div className="chart-y-labels"><span>{formatCurrency(max, true)}</span><span>{formatCurrency(max / 2, true)}</span><span>₹0</span></div>
        <svg className="chart-svg" viewBox="0 0 360 150" role="img" aria-label="Monthly spending trend">
          <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7478ed" stopOpacity=".22" /><stop offset="100%" stopColor="#7478ed" stopOpacity="0" /></linearGradient></defs>
          {[30, 78, 128].map((y) => <line key={y} x1="15" x2="345" y1={y} y2={y} className="chart-grid-line" />)}
          <polygon points={`20,138 ${points} 340,138`} fill="url(#chartFill)" />
          <polyline points={points} className="chart-line" />
          {months.map((month, index) => <circle key={month.key} cx={20 + index * 64} cy={128 - month.amount / max * 95} r="3.5" className="chart-dot" />)}
        </svg>
        <div className="chart-x-labels">{months.map((month) => <span key={month.key}>{month.label}</span>)}</div>
      </div>
    </section>
  );
}

function ExpenseModal({ initialExpense, onClose, onSave }) {
  const [form, setForm] = useState(initialExpense || { date: todayString(), category: categories[0].name, amount: "", notes: "" });
  const [error, setError] = useState("");
  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function submit(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) { setError("Enter an amount greater than ₹0."); return; }
    if (!form.date) { setError("Choose a date for this expense."); return; }
    onSave({ ...form, amount, notes: form.notes.trim(), id: initialExpense?.id || makeId() });
  }
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
        <div className="modal-heading"><div><span className="modal-eyebrow">{initialExpense ? "MAKE A CHANGE" : "A LITTLE PURCHASE"}</span><h2 id="expense-modal-title">{initialExpense ? "Edit expense" : "Add an expense"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <form onSubmit={submit} className="expense-form">
          <label className="field-label">How much?
            <div className="amount-input"><span>₹</span><input autoFocus type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => update("amount", event.target.value)} placeholder="0.00" required /></div>
          </label>
          <label className="field-label">Category
            <span className="select-wrap"><select value={form.category} onChange={(event) => update("category", event.target.value)}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select><ChevronDown size={16} /></span>
          </label>
          <label className="field-label">Date<input type="date" value={form.date} max={todayString()} onChange={(event) => update("date", event.target.value)} required /></label>
          <label className="field-label">A note, if you'd like <span className="optional">(optional)</span><input maxLength={80} value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="What was it for?" /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{initialExpense ? "Save changes" : "Save expense"} <ArrowRight size={16} /></button></div>
        </form>
      </section>
    </div>
  );
}

function BudgetPanel({ budget, spent, onSetBudget }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(budget || ""));
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  return <section className="card budget-card">
    <div className="section-heading"><div><h2>Your monthly budget</h2><p>A soft limit, not a hard rule</p></div><button className="icon-button" title="Edit monthly budget" onClick={() => setEditing((current) => !current)}><Settings size={17} /></button></div>
    {editing ? <form className="budget-edit" onSubmit={(event) => { event.preventDefault(); const amount = Number(value); if (amount > 0 && Number.isFinite(amount)) { onSetBudget(amount); setEditing(false); } }}><span>₹</span><input autoFocus type="number" min="1" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Monthly budget" /><button className="icon-button" aria-label="Save budget"><Check size={17} /></button></form> : (
      <>
        <div className="budget-amount-row"><b>{formatCurrency(spent)}</b><span>of {budget > 0 ? formatCurrency(budget) : "no limit set"}</span></div>
        <div className="budget-track"><span className={percent >= 90 ? "budget-warning" : ""} style={{ width: `${percent}%` }} /></div>
        <div className="budget-foot"><span>{budget > 0 ? `${Math.round(percent)}% of your budget` : "Set a monthly budget to keep a gentle eye on spending"}</span>{budget > 0 && <b>{formatCurrency(Math.max(budget - spent, 0))} left</b>}</div>
        {budget > 0 && spent > budget && <div className="budget-alert"><Bell size={14} /> You’ve reached your monthly budget. Take a moment to check in.</div>}
      </>
    )}
  </section>;
}

function DashboardPage() {
  const session = getSession();
  const user = getUsers().find((item) => item.email === session?.email);
  const navigate = useNavigate();
  const location = useLocation();
  const [expenses, setExpenses] = useState(() => getUserData(session?.email, "expenses", []));
  const [budget, setBudget] = useState(() => getUserData(session?.email, "budget", 50000));
  const [modal, setModal] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All categories");
  const [filterMonth, setFilterMonth] = useState("All dates");

  useEffect(() => {
    const listener = (event) => navigate(event.detail);
    window.addEventListener("pennywise:navigate", listener);
    return () => window.removeEventListener("pennywise:navigate", listener);
  }, [navigate]);
  useEffect(() => { if (session?.email) saveUserData(session.email, "expenses", expenses); }, [expenses, session?.email]);
  useEffect(() => { if (session?.email) saveUserData(session.email, "budget", budget); }, [budget, session?.email]);

  const currentMonth = todayString().slice(0, 7);
  const thisMonthExpenses = expenses.filter((expense) => expense.date.slice(0, 7) === currentMonth);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const availableMonths = Array.from(new Set(expenses.map((expense) => expense.date.slice(0, 7)))).sort().reverse();
  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const matchesText = `${expense.notes} ${expense.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = filterCategory === "All categories" || expense.category === filterCategory;
    const matchesMonth = filterMonth === "All dates" || expense.date.startsWith(filterMonth);
    return matchesText && matchesCategory && matchesMonth;
  }).sort((a, b) => b.date.localeCompare(a.date)), [expenses, query, filterCategory, filterMonth]);
  const title = location.pathname.endsWith("/transactions") ? "Your transactions" : location.pathname.endsWith("/insights") ? "Your insights" : location.pathname.endsWith("/budget") ? "A budget that feels right" : "Your money, in balance.";
  const subtitle = location.pathname.endsWith("/transactions") ? "Every little thing, all in one place." : location.pathname.endsWith("/insights") ? "See the patterns behind your spending." : location.pathname.endsWith("/budget") ? "A little structure for the things that matter." : "A little clarity for your day-to-day.";
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const activePath = location.pathname.endsWith("/transactions") ? "/dashboard/transactions" : location.pathname.endsWith("/insights") ? "/dashboard/insights" : location.pathname.endsWith("/budget") ? "/dashboard/budget" : "/dashboard";

  if (!user || !session) return <Navigate to="/login" replace />;
  function logout() { clearSession(); navigate("/login", { replace: true }); }
  function saveExpense(expense) {
    setExpenses((current) => {
      const existing = current.some((item) => item.id === expense.id);
      return existing ? current.map((item) => item.id === expense.id ? expense : item) : [expense, ...current];
    });
    setModal(null);
  }
  function deleteExpense(id) {
    if (window.confirm("Remove this expense from your record?")) setExpenses((current) => current.filter((item) => item.id !== id));
  }
  function exportCsv() {
    const rows = [["Date", "Category", "Amount (INR)", "Notes"], ...filteredExpenses.map((expense) => [expense.date, expense.category, expense.amount, expense.notes || ""])];
    const csv = rows.map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `pennywise-expenses-${todayString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <Sidebar active={activePath} navigate={navigate} user={user} onLogout={logout} open={mobileSidebar} onClose={() => setMobileSidebar(false)} />
      <main className="main-area">
        <Header title={title} subtitle={subtitle} onMenu={() => setMobileSidebar(true)} onAdd={() => setModal({})} />
        <div className="page-content">
          {isOverview && <>
            <div className="welcome-row"><div><div className="welcome-eyebrow">A FRESH LOOK AT YOUR FINANCES</div><h2>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user.name.split(" ")[0]} <span className="wave">✦</span></h2><p>Here’s how things are looking, one day at a time.</p></div><button className="button button-outline" onClick={exportCsv}><Download size={16} /> Export report</button></div>
            <div className="metric-grid"><MetricCard label="Total spending" value={total} note={`${expenses.length} thoughtful ${expenses.length === 1 ? "purchase" : "purchases"} so far`} icon={Wallet} tone="violet" /><MetricCard label="This month" value={thisMonthTotal} note={new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })} icon={CalendarDays} tone="peach" /><MetricCard label="Monthly budget" value={budget} note="Your personal spending limit" icon={ChartNoAxesCombined} tone="mint" /><MetricCard label="Still to spend" value={Math.max(budget - thisMonthTotal, 0)} note={budget > 0 ? "A little room for what matters" : "Set a budget to see what’s left"} icon={TrendingUp} tone="blue" trend={budget > 0 && thisMonthTotal <= budget ? "On track" : ""} /></div>
            <div className="dashboard-grid"><div className="dashboard-main-column"><SpendingChart expenses={expenses} /><TransactionList expenses={filteredExpenses} onDelete={deleteExpense} onEdit={setModal} onSeeAll={() => navigate("/dashboard/transactions")} /></div><div className="dashboard-side-column"><BudgetPanel budget={budget} spent={thisMonthTotal} onSetBudget={setBudget} /><CategoryBreakdown expenses={thisMonthExpenses} /><div className="quote-card"><span className="quote-mark">“</span><p>It’s not about having more. It’s about making more of what you have.</p><span className="quote-byline">A LITTLE FINANCIAL WISDOM</span></div></div></div>
          </>}
          {activePath === "/dashboard/transactions" && <><div className="list-toolbar"><label className="search-field"><Search size={17} /><input placeholder="Find an expense…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><span className="select-wrap filter-select"><select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}><option>All categories</option>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select><ChevronDown size={16} /></span><span className="select-wrap filter-select"><select value={filterMonth} onChange={(event) => setFilterMonth(event.target.value)}><option>All dates</option>{availableMonths.map((month) => <option key={month} value={month}>{new Date(`${month}-01T12:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</option>)}</select><ChevronDown size={16} /></span><button className="button button-outline" onClick={exportCsv}><Download size={16} /> Export CSV</button></div><TransactionList expenses={filteredExpenses} onDelete={deleteExpense} onEdit={setModal} showAll /></>}
          {activePath === "/dashboard/insights" && <>
            <div className="metric-grid">
              <MetricCard label="Total spending" value={total} note="Across all your expenses" icon={Wallet} tone="violet" />
              <MetricCard label="This month" value={thisMonthTotal} note="So far this month" icon={CalendarDays} tone="peach" />
              <MetricCard label="Categories" value={new Set(expenses.map((item) => item.category)).size} note="Where your spending goes" icon={ChartNoAxesCombined} tone="mint" currency={false} />
              <MetricCard label="Transactions" value={expenses.length} note="Every entry, thoughtfully tracked" icon={Receipt} tone="blue" currency={false} />
            </div>
            <div className="dashboard-grid insights-grid">
              <div className="dashboard-main-column"><SpendingChart expenses={expenses} /><TransactionList expenses={filteredExpenses} onDelete={deleteExpense} onEdit={setModal} /></div>
              <div className="dashboard-side-column"><CategoryBreakdown expenses={thisMonthExpenses} /><div className="quote-card"><span className="quote-mark">“</span><p>Awareness is the first step to spending with intention.</p><span className="quote-byline">A LITTLE FINANCIAL WISDOM</span></div></div>
            </div>
          </>}
          {activePath === "/dashboard/budget" && <div className="budget-page-grid"><div><BudgetPanel budget={budget} spent={thisMonthTotal} onSetBudget={setBudget} /><div className="budget-explainer"><span className="tip-icon"><Sparkles size={17} /></span><h3>Make it yours</h3><p>Your budget is a guide, not a judgement. Adjust it whenever life changes, and use it to create room for the things you care about.</p></div></div><div><CategoryBreakdown expenses={thisMonthExpenses} /><TransactionList expenses={thisMonthExpenses} onDelete={deleteExpense} onEdit={setModal} /></div></div>}
          {!["/dashboard", "/dashboard/", "/dashboard/transactions", "/dashboard/insights", "/dashboard/budget"].includes(location.pathname) && <Navigate to="/dashboard" replace />}
        </div>
      </main>
      {modal !== null && <ExpenseModal initialExpense={modal.id ? modal : null} onClose={() => setModal(null)} onSave={saveExpense} />}
    </div>
  );
}

export default function App() {
  const session = getSession();
  const signedIn = session && getUsers().some((user) => user.email === session.email);
  return <Routes>
    <Route path="/" element={<Navigate to={signedIn ? "/dashboard" : "/login"} replace />} />
    <Route path="/login" element={signedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" />} />
    <Route path="/register" element={signedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" />} />
    <Route path="/dashboard/*" element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
