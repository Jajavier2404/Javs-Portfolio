import { useState, FormEvent } from "react";
import Section from "@/components/Section";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
    }, 1000);
  };

  const inputClasses =
    "w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-[var(--neon-glow)] transition-all duration-300";

  return (
    <Section id="contact" title="Contact">
      <div className="mx-auto max-w-lg">
        <div className="neon-card rounded-lg p-8">
          <p className="mb-8 text-center text-muted-foreground">
            Have a project in mind or just want to say hi? Drop me a message.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClasses}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClasses} resize-none`}
                placeholder="What's on your mind?"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="group w-full rounded-md border border-primary bg-transparent px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[var(--neon-glow-strong)] hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? "Sending..." : "Send"}
              <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
