// pages/upload.tsx
// FIX: toate sub-componentele (QuestionForm, ArticleForm, BlogPostForm,
//      SubmitBtn, ListCard, ActionBtn, SectionLabel) sunt definite
//      ÎN AFARA lui Upload — rezolvă bug-ul de pierdere a focus-ului la tastare.
//
// DE CE se întâmpla bug-ul:
//   Când definești o componentă ÎNĂUNTRUL altei componente, React o tratează
//   ca un tip NOU la fiecare re-render (fiecare tastă = re-render).
//   React zice "tipul s-a schimbat" → unmount + mount → input pierde focus.

import React, { useState, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  MessageCircle, BookOpen, PenLine, Plus, Trash2, Edit3, Eye,
  ImagePlus, Tag, Loader2, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Hash,
} from "lucide-react";

// ─────────────────────────────────────────────
// TypeScript Types & Interfaces
// ─────────────────────────────────────────────

type ContentTab = "question" | "article" | "blogpost";

interface QuestionItem {
  _id: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt: string;
}

interface ArticleItem {
  _id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  content: string;
  tags: string[];
  createdAt: string;
}

interface BlogPostItem {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
}

interface Notification {
  type: "success" | "error";
  text: string;
}

// Form state shapes
interface QFormState { question: string; answer: string; tags: string; }
interface AFormState { title: string; subtitle: string; coverImage: string; content: string; tags: string; }
interface BFormState { title: string; content: string; coverImage: string; tags: string; }

// ─────────────────────────────────────────────
// Helpers (în afara oricărei componente — nu se recalculează niciodată)
// ─────────────────────────────────────────────

const authHeader = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const truncate = (str: string, n: number): string =>
  str.length > n ? str.slice(0, n) + "…" : str;

// ─────────────────────────────────────────────
// Shared styles (constante la nivel de modul)
// ─────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #dcd0c0",
  borderRadius: "10px",
  background: "#FFFEFB",
  fontFamily: "Montserrat, sans-serif",
  fontSize: "0.88rem",
  color: "#3a2c27",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "160px",
  lineHeight: "1.65",
};

// ─────────────────────────────────────────────
// Primitive components — definite O SINGURĂ DATĂ la nivel de modul
// React le recunoaște ca același tip la fiecare render → nu le remontează
// ─────────────────────────────────────────────

const TabBtn: React.FC<{
  active: boolean; onClick: () => void;
  icon: React.ReactNode; label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: "Montserrat, sans-serif",
      background: active ? "#3a2c27" : "transparent",
      color: active ? "#FAF8F5" : "#3a2c27",
      border: "1.5px solid #3a2c27",
      borderRadius: "999px",
      padding: "10px 22px",
      fontSize: "0.82rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
  >
    {icon}{label}
  </button>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3a2c27" }}>
      {label}
    </label>
    {hint && <span style={{ fontSize: "0.74rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif", marginTop: "-4px" }}>{hint}</span>}
    {children}
  </div>
);

const Toast: React.FC<{ note: Notification | null }> = ({ note }) => {
  if (!note) return null;
  return (
    <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, background: note.type === "success" ? "#3a2c27" : "#c0392b", color: "#FAF8F5", borderRadius: "12px", padding: "14px 22px", display: "flex", alignItems: "center", gap: "10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.86rem", fontWeight: 600, boxShadow: "0 8px 32px rgba(58,44,39,0.18)", animation: "slideUp 0.3s ease" }}>
      {note.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      {note.text}
    </div>
  );
};

const ConfirmDelete: React.FC<{ onConfirm: () => void; onCancel: () => void; label: string }> = ({ onConfirm, onCancel, label }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(58,44,39,0.35)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#FAF8F5", borderRadius: "18px", padding: "36px 40px", maxWidth: "420px", width: "90%", boxShadow: "0 16px 48px rgba(58,44,39,0.18)", textAlign: "center" }}>
      <p style={{ fontFamily: "Lovers Quarrel, cursive", fontSize: "1.7rem", color: "#3a2c27", marginBottom: "10px" }}>Delete this?</p>
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.86rem", color: "#b5a898", marginBottom: "26px", lineHeight: 1.6 }}>
        You are about to permanently delete <strong style={{ color: "#3a2c27" }}>"{truncate(label, 50)}"</strong>. This cannot be undone.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={onCancel} style={{ padding: "10px 24px", border: "1.5px solid #dcd0c0", borderRadius: "999px", background: "transparent", fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 600, color: "#3a2c27", cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: "10px 24px", border: "none", borderRadius: "999px", background: "#c0392b", fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 600, color: "#fff", cursor: "pointer" }}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ textAlign: "center", padding: "48px 24px", background: "#FFFEFB", border: "1.5px dashed #dcd0c0", borderRadius: "14px", color: "#b5a898", fontFamily: "Montserrat, sans-serif", fontSize: "0.86rem" }}>
    <Hash size={32} style={{ color: "#dcd0c0", marginBottom: "12px" }} />
    <p style={{ margin: 0 }}>{label}</p>
    <p style={{ margin: "6px 0 0", fontSize: "0.78rem", opacity: 0.8 }}>Use the form above to create your first one.</p>
  </div>
);

const SectionLabel: React.FC<{ text: string; count: number }> = ({ text, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "32px 0 16px" }}>
    <div style={{ flex: 1, height: "1px", background: "#dcd0c0" }} />
    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b5a898", whiteSpace: "nowrap" }}>
      {text} ({count})
    </span>
    <div style={{ flex: 1, height: "1px", background: "#dcd0c0" }} />
  </div>
);

const ActionBtn: React.FC<{
  icon: React.ReactNode; title: string; onClick: () => void; color: string;
}> = ({ icon, title, onClick, color }) => (
  <button
    onClick={onClick}
    title={title}
    style={{ width: "34px", height: "34px", borderRadius: "10px", border: `1.5px solid ${color}22`, background: `${color}11`, color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s, transform 0.1s", flexShrink: 0 }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}22`; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}11`; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
  >
    {icon}
  </button>
);

// SubmitBtn primește `submitting` ca prop explicit
const SubmitBtn: React.FC<{ onClick: () => void; label: string; submitting: boolean }> = ({ onClick, label, submitting }) => (
  <button
    onClick={onClick}
    disabled={submitting}
    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 30px", background: submitting ? "#b5a898" : "#3a2c27", color: "#FAF8F5", border: "none", borderRadius: "999px", fontFamily: "Montserrat, sans-serif", fontSize: "0.86rem", fontWeight: 700, letterSpacing: "0.06em", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s", marginTop: "8px" }}
  >
    {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={16} />}
    {submitting ? "Publishing…" : label}
  </button>
);

// ListCard primește `navigate` și `onDeleteClick` ca props
const ListCard: React.FC<{
  type: ContentTab; id: string; title: string; subtitle?: string;
  date: string; tags: string[]; viewPath: string; editPath: string;
  navigate: NavigateFunction;
  onDeleteClick: (type: ContentTab, id: string, label: string) => void;
}> = ({ type, id, title, subtitle, date, tags, viewPath, editPath, navigate, onDeleteClick }) => (
  <div
    style={{ background: "#FFFEFB", border: "1.5px solid #dcd0c0", borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", transition: "box-shadow 0.2s" }}
    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 18px rgba(58,44,39,0.08)")}
    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.93rem", color: "#3a2c27", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {truncate(title, 80)}
      </p>
      {subtitle && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#b5a898", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {truncate(subtitle, 80)}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.73rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif" }}>{fmtDate(date)}</span>
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{ background: "#dcd0c0", color: "#3a2c27", borderRadius: "999px", padding: "2px 10px", fontSize: "0.7rem", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>{tag}</span>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
      <ActionBtn icon={<Eye size={15} />}    title="View"   onClick={() => navigate(viewPath)} color="#b5a898" />
      <ActionBtn icon={<Edit3 size={15} />}  title="Edit"   onClick={() => navigate(editPath)} color="#3a2c27" />
      <ActionBtn icon={<Trash2 size={15} />} title="Delete" onClick={() => onDeleteClick(type, id, title)} color="#c0392b" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Form components — primesc tot state-ul ca props, nu citesc din closure
// ─────────────────────────────────────────────

const QuestionForm: React.FC<{
  form: QFormState;
  setForm: React.Dispatch<React.SetStateAction<QFormState>>;
  onSubmit: () => void;
  submitting: boolean;
}> = ({ form, setForm, onSubmit, submitting }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    <div style={{ background: "linear-gradient(135deg, #dcd0c020, #b5a89810)", border: "1px solid #dcd0c0", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <MessageCircle size={18} style={{ color: "#b5a898", flexShrink: 0, marginTop: "2px" }} />
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#3a2c27", lineHeight: 1.6, margin: 0 }}>
        Anonymous Q&amp;A — the <strong>question becomes the title</strong>, and the answer is displayed as a long-form article. No author name shown to visitors.
      </p>
    </div>

    <Field label="Question / Title" hint="This will appear as the main heading of the post.">
      <input
        style={inputStyle}
        type="text"
        placeholder="e.g. How do you stay motivated while working alone?"
        value={form.question}
        onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
        maxLength={300}
      />
      <span style={{ fontSize: "0.72rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif", marginTop: "4px" }}>
        {form.question.length}/300
      </span>
    </Field>

    <Field label="Answer" hint="Write as a full article — paragraphs, depth, structure.">
      <textarea
        style={{ ...textareaStyle, minHeight: "240px" }}
        placeholder="Write a thorough, thoughtful answer here..."
        value={form.answer}
        onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
      />
      <span style={{ fontSize: "0.72rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif", marginTop: "4px" }}>
        {form.answer.length} characters
      </span>
    </Field>

    <Field label="Tags" hint="Comma-separated. e.g. motivation, personal, career">
      <div style={{ position: "relative" }}>
        <Tag size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b5a898", pointerEvents: "none" }} />
        <input
          style={{ ...inputStyle, paddingLeft: "36px" }}
          type="text"
          placeholder="motivation, personal growth, career"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
        />
      </div>
    </Field>

    <SubmitBtn onClick={onSubmit} label="Post Q&A" submitting={submitting} />
  </div>
);

const ArticleForm: React.FC<{
  form: AFormState;
  setForm: React.Dispatch<React.SetStateAction<AFormState>>;
  onSubmit: () => void;
  submitting: boolean;
}> = ({ form, setForm, onSubmit, submitting }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    <div style={{ background: "linear-gradient(135deg, #dcd0c020, #b5a89810)", border: "1px solid #dcd0c0", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <BookOpen size={18} style={{ color: "#b5a898", flexShrink: 0, marginTop: "2px" }} />
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#3a2c27", lineHeight: 1.6, margin: 0 }}>
        Magazine-style article — large cover image at the top, subtitle, then the long-form body. Rendered on{" "}
        <code style={{ fontSize: "0.8em", background: "#dcd0c040", padding: "1px 5px", borderRadius: "4px" }}>/articol/:id</code>.
      </p>
    </div>

    <Field label="Title">
      <input
        style={inputStyle}
        type="text"
        placeholder="e.g. On Learning to Disappear Gracefully"
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        maxLength={200}
      />
    </Field>

    <Field label="Subtitle / Excerpt" hint="One powerful sentence shown under the title.">
      <input
        style={inputStyle}
        type="text"
        placeholder="A short subheadline or pull quote"
        value={form.subtitle}
        onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
        maxLength={300}
      />
    </Field>

    <Field label="Cover Image URL" hint="Paste a direct image URL. Will fill the top banner.">
      <div style={{ position: "relative" }}>
        <ImagePlus size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b5a898", pointerEvents: "none" }} />
        <input
          style={{ ...inputStyle, paddingLeft: "36px" }}
          type="url"
          placeholder="https://images.unsplash.com/…"
          value={form.coverImage}
          onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
        />
      </div>
      {form.coverImage && (
        <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden", maxHeight: "180px", border: "1.5px solid #dcd0c0" }}>
          <img src={form.coverImage} alt="Cover preview" style={{ width: "100%", height: "180px", objectFit: "cover" }} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
        </div>
      )}
    </Field>

    <Field label="Article Content" hint="Full magazine-style body. Markdown supported.">
      <textarea
        style={{ ...textareaStyle, minHeight: "300px" }}
        placeholder="Write your full article here..."
        value={form.content}
        onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
      />
      <span style={{ fontSize: "0.72rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif", marginTop: "4px" }}>{form.content.length} characters</span>
    </Field>

    <Field label="Tags" hint="Comma-separated.">
      <div style={{ position: "relative" }}>
        <Tag size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b5a898", pointerEvents: "none" }} />
        <input
          style={{ ...inputStyle, paddingLeft: "36px" }}
          type="text"
          placeholder="culture, wellness, essays"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
        />
      </div>
    </Field>

    <SubmitBtn onClick={onSubmit} label="Publish Article" submitting={submitting} />
  </div>
);

const BlogPostForm: React.FC<{
  form: BFormState;
  setForm: React.Dispatch<React.SetStateAction<BFormState>>;
  onSubmit: () => void;
  submitting: boolean;
}> = ({ form, setForm, onSubmit, submitting }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    <div style={{ background: "linear-gradient(135deg, #dcd0c020, #b5a89810)", border: "1px solid #dcd0c0", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <PenLine size={18} style={{ color: "#b5a898", flexShrink: 0, marginTop: "2px" }} />
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#3a2c27", lineHeight: 1.6, margin: 0 }}>
        Personal blog post — casual, intimate, with images woven through the text. Use{" "}
        <code style={{ fontSize: "0.8em", background: "#dcd0c040", padding: "1px 5px", borderRadius: "4px" }}>![alt](url)</code>{" "}
        to embed inline images. Rendered on{" "}
        <code style={{ fontSize: "0.8em", background: "#dcd0c040", padding: "1px 5px", borderRadius: "4px" }}>/blogpost/:id</code>.
      </p>
    </div>

    <Field label="Post Title">
      <input
        style={inputStyle}
        type="text"
        placeholder="e.g. A quiet Saturday and what I figured out"
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        maxLength={200}
      />
    </Field>

    <Field label="Cover Image URL" hint="The first image visitors see.">
      <div style={{ position: "relative" }}>
        <ImagePlus size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b5a898", pointerEvents: "none" }} />
        <input
          style={{ ...inputStyle, paddingLeft: "36px" }}
          type="url"
          placeholder="https://…"
          value={form.coverImage}
          onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
        />
      </div>
      {form.coverImage && (
        <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden", maxHeight: "180px", border: "1.5px solid #dcd0c0" }}>
          <img src={form.coverImage} alt="Cover preview" style={{ width: "100%", height: "180px", objectFit: "cover" }} onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
        </div>
      )}
    </Field>

    <Field label="Blog Content" hint="Write freely. Insert images with ![description](url).">
      <textarea
        style={{ ...textareaStyle, minHeight: "320px" }}
        placeholder={`Write your personal blog post here.\n\nEmbed images like this:\n![A beautiful morning](https://example.com/image.jpg)\n\nThen continue writing...`}
        value={form.content}
        onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
      />
      <span style={{ fontSize: "0.72rem", color: "#b5a898", fontFamily: "Montserrat, sans-serif", marginTop: "4px" }}>{form.content.length} characters</span>
    </Field>

    <Field label="Tags" hint="Comma-separated.">
      <div style={{ position: "relative" }}>
        <Tag size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#b5a898", pointerEvents: "none" }} />
        <input
          style={{ ...inputStyle, paddingLeft: "36px" }}
          type="text"
          placeholder="life, diary, thoughts"
          value={form.tags}
          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
        />
      </div>
    </Field>

    <SubmitBtn onClick={onSubmit} label="Publish Post" submitting={submitting} />
  </div>
);

// ═════════════════════════════════════════════
// MAIN COMPONENT — Upload
// Conține DOAR state și logică. Zero definiții de componente înăuntru.
// ═════════════════════════════════════════════
const Upload: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState<ContentTab>("question");
  const [note, setNote]               = useState<Notification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: ContentTab; id: string; label: string } | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [formOpen, setFormOpen]       = useState(true);

  const [qForm, setQForm] = useState<QFormState>({ question: "", answer: "", tags: "" });
  const [aForm, setAForm] = useState<AFormState>({ title: "", subtitle: "", coverImage: "", content: "", tags: "" });
  const [bForm, setBForm] = useState<BFormState>({ title: "", content: "", coverImage: "", tags: "" });

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [articles, setArticles]   = useState<ArticleItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);

  const notify = (type: "success" | "error", text: string) => {
    setNote({ type, text });
    setTimeout(() => setNote(null), 3500);
  };

  useEffect(() => {
    fetchQuestions();
    fetchArticles();
    fetchBlogPosts();
  }, []);

  const fetchQuestions = async () => {
    try { const r = await fetch("/api/questions", { headers: authHeader() }); if (r.ok) setQuestions(await r.json()); } catch {}
  };
  const fetchArticles = async () => {
    try { const r = await fetch("/api/articles", { headers: authHeader() }); if (r.ok) setArticles(await r.json()); } catch {}
  };
  const fetchBlogPosts = async () => {
    try { const r = await fetch("/api/blogposts", { headers: authHeader() }); if (r.ok) setBlogPosts(await r.json()); } catch {}
  };

  const submitQuestion = async () => {
    if (!qForm.question.trim() || !qForm.answer.trim()) { notify("error", "Question and answer are required."); return; }
    setSubmitting(true);
    try {
      const r = await fetch("/api/questions", { method: "POST", headers: authHeader(), body: JSON.stringify({ question: qForm.question.trim(), answer: qForm.answer.trim(), tags: qForm.tags.split(",").map(t => t.trim()).filter(Boolean) }) });
      if (r.ok) { notify("success", "Anonymous Q&A posted!"); setQForm({ question: "", answer: "", tags: "" }); fetchQuestions(); }
      else { const e = await r.json(); notify("error", e.message || "Failed."); }
    } catch { notify("error", "Network error."); }
    finally { setSubmitting(false); }
  };

  const submitArticle = async () => {
    if (!aForm.title.trim() || !aForm.content.trim()) { notify("error", "Title and content are required."); return; }
    setSubmitting(true);
    try {
      const r = await fetch("/api/articles", { method: "POST", headers: authHeader(), body: JSON.stringify({ title: aForm.title.trim(), subtitle: aForm.subtitle.trim(), coverImage: aForm.coverImage.trim(), content: aForm.content.trim(), tags: aForm.tags.split(",").map(t => t.trim()).filter(Boolean) }) });
      if (r.ok) { notify("success", "Article published!"); setAForm({ title: "", subtitle: "", coverImage: "", content: "", tags: "" }); fetchArticles(); }
      else { const e = await r.json(); notify("error", e.message || "Failed."); }
    } catch { notify("error", "Network error."); }
    finally { setSubmitting(false); }
  };

  const submitBlogPost = async () => {
    if (!bForm.title.trim() || !bForm.content.trim()) { notify("error", "Title and content are required."); return; }
    setSubmitting(true);
    try {
      const r = await fetch("/api/blogposts", { method: "POST", headers: authHeader(), body: JSON.stringify({ title: bForm.title.trim(), content: bForm.content.trim(), coverImage: bForm.coverImage.trim(), tags: bForm.tags.split(",").map(t => t.trim()).filter(Boolean) }) });
      if (r.ok) { notify("success", "Blog post published!"); setBForm({ title: "", content: "", coverImage: "", tags: "" }); fetchBlogPosts(); }
      else { const e = await r.json(); notify("error", e.message || "Failed."); }
    } catch { notify("error", "Network error."); }
    finally { setSubmitting(false); }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const ep: Record<ContentTab, string> = { question: "questions", article: "articles", blogpost: "blogposts" };
    try {
      const r = await fetch(`/api/${ep[type]}/${id}`, { method: "DELETE", headers: authHeader() });
      if (r.ok) { notify("success", "Deleted."); if (type === "question") fetchQuestions(); if (type === "article") fetchArticles(); if (type === "blogpost") fetchBlogPosts(); }
      else notify("error", "Failed to delete.");
    } catch { notify("error", "Network error."); }
    finally { setDeleteTarget(null); }
  };

  const handleDeleteClick = (type: ContentTab, id: string, label: string) => setDeleteTarget({ type, id, label });

  return (
    <>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ background: "#FAF8F5", minHeight: "100vh", fontFamily: "Montserrat, sans-serif", paddingBottom: "80px" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #dcd0c0 0%, #c8baa8 100%)", padding: "64px 24px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-20px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(58,44,39,0.07)" }} />
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3a2c27", opacity: 0.7, marginBottom: "10px" }}>Admin Panel</p>
          <h1 style={{ fontFamily: "Lovers Quarrel, cursive", fontSize: "clamp(2.6rem, 6vw, 4.2rem)", color: "#3a2c27", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.1 }}>Create &amp; Manage</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#3a2c27", opacity: 0.75, maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
            Write anonymous Q&amp;As, magazine articles, and personal blog posts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "28px", flexWrap: "wrap" }}>
            {[
              { label: "Q&As",       count: questions.length, icon: <MessageCircle size={15} /> },
              { label: "Articles",   count: articles.length,  icon: <BookOpen size={15} /> },
              { label: "Blog Posts", count: blogPosts.length, icon: <PenLine size={15} /> },
            ].map(({ label, count, icon }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.45)", borderRadius: "12px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px", backdropFilter: "blur(8px)" }}>
                <span style={{ color: "#3a2c27", opacity: 0.7 }}>{icon}</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#3a2c27" }}>{count} {label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 0" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
            <TabBtn active={activeTab === "question"} onClick={() => setActiveTab("question")} icon={<MessageCircle size={16} />} label="Anonymous Q&A" />
            <TabBtn active={activeTab === "article"}  onClick={() => setActiveTab("article")}  icon={<BookOpen size={16} />}      label="Article" />
            <TabBtn active={activeTab === "blogpost"} onClick={() => setActiveTab("blogpost")} icon={<PenLine size={16} />}        label="Blog Post" />
          </div>

          {/* Form card */}
          <div style={{ background: "#FFFEFB", border: "1.5px solid #dcd0c0", borderRadius: "18px", overflow: "hidden", marginBottom: "16px", animation: "fadeIn 0.3s ease" }}>
            <button onClick={() => setFormOpen(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 26px", background: "transparent", border: "none", cursor: "pointer", borderBottom: formOpen ? "1.5px solid #dcd0c0" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", background: "#3a2c27", borderRadius: "8px", color: "#FAF8F5" }}><Plus size={16} /></span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.92rem", fontWeight: 700, color: "#3a2c27" }}>
                  {activeTab === "question" ? "New Anonymous Q&A" : activeTab === "article" ? "New Article" : "New Blog Post"}
                </span>
              </div>
              {formOpen ? <ChevronUp size={18} style={{ color: "#b5a898" }} /> : <ChevronDown size={18} style={{ color: "#b5a898" }} />}
            </button>

            {formOpen && (
              <div style={{ padding: "26px" }}>
                {activeTab === "question" && <QuestionForm form={qForm} setForm={setQForm} onSubmit={submitQuestion} submitting={submitting} />}
                {activeTab === "article"  && <ArticleForm  form={aForm} setForm={setAForm} onSubmit={submitArticle}  submitting={submitting} />}
                {activeTab === "blogpost" && <BlogPostForm form={bForm} setForm={setBForm} onSubmit={submitBlogPost} submitting={submitting} />}
              </div>
            )}
          </div>

          {/* Lists */}
          {activeTab === "question" && (
            <>
              <SectionLabel text="Existing Q&As" count={questions.length} />
              {questions.length === 0 ? <EmptyState label="No anonymous Q&As yet." /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {questions.map(q => <ListCard key={q._id} type="question" id={q._id} title={q.question} subtitle={truncate(q.answer, 100)} date={q.createdAt} tags={q.tags} viewPath={`/question/${q._id}`} editPath={`/edit_question/${q._id}`} navigate={navigate} onDeleteClick={handleDeleteClick} />)}
                </div>
              )}
            </>
          )}
          {activeTab === "article" && (
            <>
              <SectionLabel text="Published Articles" count={articles.length} />
              {articles.length === 0 ? <EmptyState label="No articles published yet." /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {articles.map(a => <ListCard key={a._id} type="article" id={a._id} title={a.title} subtitle={a.subtitle} date={a.createdAt} tags={a.tags} viewPath={`/articol/${a._id}`} editPath={`/edit_post/${a._id}`} navigate={navigate} onDeleteClick={handleDeleteClick} />)}
                </div>
              )}
            </>
          )}
          {activeTab === "blogpost" && (
            <>
              <SectionLabel text="Blog Posts" count={blogPosts.length} />
              {blogPosts.length === 0 ? <EmptyState label="No blog posts yet." /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {blogPosts.map(b => <ListCard key={b._id} type="blogpost" id={b._id} title={b.title} subtitle={truncate(b.content, 100)} date={b.createdAt} tags={b.tags} viewPath={`/blogpost/${b._id}`} editPath={`/edit_blogpost/${b._id}`} navigate={navigate} onDeleteClick={handleDeleteClick} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Toast note={note} />
      {deleteTarget && <ConfirmDelete label={deleteTarget.label} onConfirm={executeDelete} onCancel={() => setDeleteTarget(null)} />}
    </>
  );
};

export default Upload;