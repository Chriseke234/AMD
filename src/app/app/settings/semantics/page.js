"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LibraryBig, Loader2, Sparkles } from 'lucide-react';

export default function SemanticsSettings() {
    const [semantics, setSemantics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSemantics();
    }, []);

    const fetchSemantics = async () => {
        try {
            const res = await fetch('/api/semantics');
            if (res.ok) {
                const data = await res.json();
                setSemantics(data);
            }
        } catch (err) {
            console.error("Failed to load semantic definitions", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(null);
        if (!term || !definition) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/semantics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ term, definition })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to add definition");

            setSemantics([data, ...semantics]);
            setTerm('');
            setDefinition('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/semantics?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSemantics(semantics.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2 border-b border-border/50 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/20">
                        <LibraryBig size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground flex items-center gap-2">
                            Semantic Data Dictionary
                            <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium inline-flex items-center gap-1.5 ml-2">
                                <Sparkles size={12} /> AI Context
                            </span>
                        </h1>
                        <p className="text-secondary font-body mt-1">
                            Define terms, metrics, and business logic so the AI stops guessing and generates perfectly accurate insights.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Col */}
                <div className="col-span-1 space-y-6">
                    <form onSubmit={handleAdd} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
                        <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                            Add Definition
                        </h3>
                        {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-medium text-secondary uppercase tracking-wider">Business Term</label>
                            <input
                                type="text"
                                placeholder="e.g. Active User"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-medium text-secondary uppercase tracking-wider">Exact Definition / Logic</label>
                            <textarea
                                placeholder="A user who has performed at least 1 query in the last 30 days."
                                value={definition}
                                onChange={(e) => setDefinition(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm min-h-[120px] outline-none focus:border-accent transition-colors resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !term || !definition}
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-xl px-4 py-2.5 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus size={16} /> Add to Dictionary</>}
                        </button>
                    </form>
                </div>

                {/* List Col */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-card/50 border border-border/50 rounded-2xl p-6 min-h-[400px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-secondary">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : semantics.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                                <LibraryBig className="w-10 h-10 text-secondary/30" strokeWidth={1} />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">No definitions yet</p>
                                    <p className="text-xs text-secondary max-w-[250px] mx-auto">Add your first business term to teach the AI how your company measures data.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {semantics.map((s) => (
                                    <div key={s.id} className="group flex gap-4 p-4 rounded-xl bg-background border border-border/50 hover:border-border transition-colors">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                                                    {s.term}
                                                </h4>
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-secondary hover:text-red-500 transition-all p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="font-mono text-xs text-secondary leading-relaxed pt-1">
                                                {s.definition}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
