"use client";
import { useState } from "react";

const ACCENT = "hsl(255, 70%, 60%)";

export default function HSAOptimizerPage() {
  const [hdhpCoverage, setHdhpCoverage] = useState("Individual");
  const [annualHouseholdIncome, setAnnualHouseholdIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("Married Filing Jointly");
  const [currentHSABalance, setCurrentHSABalance] = useState("");
  const [annualHSAContribution, setAnnualHSAContribution] = useState("");
  const [hsaEmployerContribution, setHsaEmployerContribution] = useState("");
  const [hsaInvestment, setHsaInvestment] = useState("Not yet invested");
  const [fsaBalance, setFsaBalance] = useState("");
  const [healthcareSpending, setHealthcareSpending] = useState("");
  const [familySituation, setFamilySituation] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hdhpCoverage, annualHouseholdIncome, filingStatus, currentHSABalance, annualHSAContribution, hsaEmployerContribution, hsaInvestment, fsaBalance, healthcareSpending, familySituation }),
      });
      const data = await res.json();
      setOutput(data.output || "No output generated.");
    } catch {
      setOutput("Error generating strategy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: ACCENT }}>AI HSA & FSA Optimizer</h1>
          <p className="text-gray-400">Maximize your triple-tax advantage with HSA investment strategy and FSA optimization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-200">Your HSA Profile</h2>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">HDHP Coverage Type</label>
              <select value={hdhpCoverage} onChange={(e) => setHdhpCoverage(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                {["Individual", "Individual + Spouse (no kids)", "Family (with children)", "HDHP with HSA through employer", "Self-employed with individual HDHP"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Household Income ($)</label>
                <input type="number" value={annualHouseholdIncome} onChange={(e) => setAnnualHouseholdIncome(e.target.value)} placeholder="140000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Filing Status</label>
                <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                  {["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">HSA Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Current HSA Balance ($)</label>
                  <input type="number" value={currentHSABalance} onChange={(e) => setCurrentHSABalance(e.target.value)} placeholder="8500" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Contribution ($)</label>
                  <input type="number" value={annualHSAContribution} onChange={(e) => setAnnualHSAContribution(e.target.value)} placeholder="4150" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Employer Contribution ($)</label>
                  <input type="number" value={hsaEmployerContribution} onChange={(e) => setHsaEmployerContribution(e.target.value)} placeholder="500" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Investment Status</label>
                  <select value={hsaInvestment} onChange={(e) => setHsaInvestment(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                    {["Not yet invested", "Cash only HSA", "Partially invested (some cash, some invested)", "Fully invested (minimal cash held)"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">FSA & Spending</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">FSA Balance ($)</label>
                  <input type="number" value={fsaBalance} onChange={(e) => setFsaBalance(e.target.value)} placeholder="0" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Healthcare Spending ($)</label>
                  <input type="number" value={healthcareSpending} onChange={(e) => setHealthcareSpending(e.target.value)} placeholder="2000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Family / Health Situation Notes</label>
              <textarea value={familySituation} onChange={(e) => setFamilySituation(e.target.value)} rows={3} placeholder="Chronic condition, expecting child, empty nest, high deductible, Medicare eligible in 5 years..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm resize-none" />
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
              {loading ? "Optimizing..." : "Optimize My HSA & FSA"}
            </button>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Your HSA & FSA Optimization Strategy</h2>
            {output ? (
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap overflow-auto max-h-[600px]">
                {output}
              </div>
            ) : (
              <div className="text-gray-500 text-sm space-y-3">
                <p>Your optimization strategy will include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Triple-tax advantage explained for your situation</li>
                  <li>Annual contribution optimization (individual vs. family limits)</li>
                  <li>Cash vs. invest split strategy based on balance</li>
                  <li>Catch-up contribution analysis if 55+</li>
                  <li>Medicare coordination strategy</li>
                  <li>FSA use-it-or-lose-it optimization</li>
                  <li>HSA investment fund recommendations</li>
                  <li>ROI comparison: HSA vs. traditional vs. Roth approaches</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
