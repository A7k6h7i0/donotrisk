"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-ink p-8 text-paper md:p-12">
        <h1 className="font-display text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-paper/80">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl bg-white p-8 md:p-12">
          <h2 className="font-display text-2xl text-ink">Send us a Message</h2>
          
          {submitted ? (
            <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
              <div className="text-4xl">✓</div>
              <h3 className="mt-2 font-display text-lg text-green-800">Message Sent!</h3>
              <p className="mt-2 text-sm text-green-700">Thank you for reaching out. We'll get back to you soon.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm text-green-600 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 text-ink focus:border-ink focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 text-ink focus:border-ink focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-ink">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 text-ink focus:border-ink focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 text-ink focus:border-ink focus:outline-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-ink px-6 py-3 text-paper hover:bg-ink/90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-8 md:p-12">
            <h2 className="font-display text-2xl text-ink">Company Information</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <div className="text-2xl">📧</div>
                <div className="ml-4">
                  <h3 className="font-medium text-ink">Email</h3>
                  <p className="text-ink/70">support@donotrisk.io</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl">🏢</div>
                <div className="ml-4">
                  <h3 className="font-medium text-ink">Headquarters</h3>
                  <p className="text-ink/70">123 Innovation Drive<br />Tech City, TC 10001</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-2xl">🕐</div>
                <div className="ml-4">
                  <h3 className="font-medium text-ink">Business Hours</h3>
                  <p className="text-ink/70">Monday - Friday: 9AM - 6PM EST<br />Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 md:p-12">
            <h2 className="font-display text-2xl text-ink">Quick Links</h2>
            <div className="mt-6 space-y-3">
              <a href="/about" className="block rounded-lg p-2 text-ink/80 hover:bg-ink/5">
                → About Us
              </a>
              <a href="/services" className="block rounded-lg p-2 text-ink/80 hover:bg-ink/5">
                → Our Services
              </a>
              <a href="/features" className="block rounded-lg p-2 text-ink/80 hover:bg-ink/5">
                → Features
              </a>
              <a href="/scanner" className="block rounded-lg p-2 text-ink/80 hover:bg-ink/5">
                → Free Scanner
              </a>
              <a href="/categories" className="block rounded-lg p-2 text-ink/80 hover:bg-ink/5">
                → Browse Categories
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-ink p-8 text-paper">
            <h3 className="font-display text-lg">Need Immediate Help?</h3>
            <p className="mt-2 text-paper/80">Check out our FAQ or try our AI Assistant for instant answers.</p>
            <div className="mt-4 flex gap-3">
              <a href="/assistant" className="rounded-full bg-paper px-4 py-2 text-sm text-ink">
                AI Assistant
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
