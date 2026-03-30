"use client";
import { useState } from "react";

export default function HSAOptimizerPage() {
  const [hdhpCoverage, setHdhpCoverage] = useState("Individual");
  const [hsaBalance, setHsaBalance] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");
  const [medicalExpenses, setMedicalExpenses] = useState("");
  const [investmentPref, setInvestmentPref] = useState("Growth (aggressive)");
  const [age, setAge] = useState("");
  const [employerHSA, setEmployerHSA] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hdhpCoverage, hsaBalance, annualContribution, medicalExpenses, investmentPref, age, employerHSA, notes }),
      });
      const data = await res.json();
      setOutput(data.output || "No output generated.");
    } catch { setOutput("Error generating HSA optimization plan."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "hsl(195deg, 70%, 50%)" }}>AI HSA Optimizer</h1>
          <p className="text-gray-400">Maximize your Health Savings Account as a triple-tax-advantaged investment vehicle</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">HSA Profile</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">HDHP Coverage</label>
                  <select value={hdhpCoverage} onChange={(e) => setHdhpCoverage(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                    <option>Individual</option><option>Individual + Spouse</option>
                    <option>Individual + Children</option><option>Family</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Your Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="35" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Current HSA Balance ($)</label>
                  <input type="number" value={hsaBalance} onChange={(e) => setHsaBalance(e.target.value)} placeholder="8000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Contribution ($)</label>
                  <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} placeholder="4150" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Employer HSA Contribution ($)</label>
                  <input type="number" value={employerHSA} onChange={(e) => setEmployerHSA(e.target.value)} placeholder="500" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Investment Preference</label>
                  <select value={investmentPref} onChange={(e) => setInvestmentPref(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                    <option>Growth (aggressive)</option><option>Balanced</option>
                    <option>Conservative</option><option>Cash only</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Out-of-Pocket Medical Expenses ($)</label>
                  <input type="number" value={medicalExpenses} onChange={(e) => setMedicalExpenses(e.target.value)} placeholder="1500" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Additional Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Chronic conditions, upcoming surgeries, Medicare enrollment approaching, family health history..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none mt-1" />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50" style={{ backgroundColor: "hsl(195deg, 70%, 50%)" }}>
              {loading ? "Optimizing..." : "Generate HSA Optimization Plan"}
            </button>
          </div>
          <div>
            {output ? (
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-200">HSA Optimization Plan</h2>
                  <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition">📋 Copy</button>
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
              </div>
            ) : (
              <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-2xl p-12 flex items-center justify-center">
                <p className="text-gray-500 text-center">Your HSA optimization plan will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
