import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const { hdhpCoverage, hsaBalance, annualContribution, medicalExpenses, investmentPref, age, employerHSA, notes } = await req.json();

    const limits: Record<string, { individual: number; family: number }> = {
      "Individual": { individual: 4150, family: 0 },
      "Individual + Spouse": { individual: 0, family: 8300 },
      "Individual + Children": { individual: 0, family: 8300 },
      "Family": { individual: 0, family: 8300 },
    };
    const coverage = hdhpCoverage || "Individual";
    const limit = limits[coverage] || limits["Individual"];
    const maxContribution = limit.individual > 0 ? limit.individual : limit.family;
    const catchUp55 = Number(age) >= 55 ? 1000 : 0;
    const totalMax = maxContribution + catchUp55;
    const employer = Number(employerHSA) || 0;
    const balance = Number(hsaBalance) || 0;
    const contrib = Number(annualContribution) || 0;
    const expenses = Number(medicalExpenses) || 0;
    const totalContrib = contrib + employer;
    const taxSavingsFed = totalContrib * 0.22;
    const taxSavingsState = totalContrib * 0.05;
    const totalTaxSavings = taxSavingsFed + taxSavingsState;
    const investableAfterYears = Math.max(0, balance - 1000);

    const prompt = `You are an expert HSA and healthcare finance strategist. Generate a comprehensive HSA optimization report.

**HSA Profile:**
HDHP Coverage: ${hdhpCoverage || "Individual"}
${age ? `Age: ${age} ${Number(age) >= 55 ? "(+ $1,000 catch-up eligible)" : ""}` : "Age: Not specified"}
${hsaBalance ? `Current HSA Balance: $${Number(hsaBalance).toLocaleString()}` : "Current Balance: $0"}
${annualContribution ? `Annual Contribution: $${Number(annualContribution).toLocaleString()}` : "Annual Contribution: $0"}
${employerHSA ? `Employer Contribution: $${Number(employerHSA).toLocaleString()}/year` : ""}
${medicalExpenses ? `Annual Medical Expenses: $${Number(medicalExpenses).toLocaleString()}` : "Medical Expenses: Not specified"}
Investment Preference: ${investmentPref || "Growth (aggressive)"}
${notes ? `Notes: ${notes}` : ""}

**2025 HSA Limits:**
Maximum Contribution: $${maxContribution.toLocaleString()} (${coverage})
Age 55+ Catch-up: +$1,000
Total Maximum: $${totalMax.toLocaleString()}
${totalContrib > 0 ? `Your Total Annual Contribution: $${totalContrib.toLocaleString()} (employee + employer)` : ""}
${totalTaxSavings > 0 ? `Estimated Annual Tax Savings: $${totalTaxSavings.toLocaleString()} (22% federal + 5% state)` : ""}

Generate a comprehensive HSA optimization report in markdown:

## HSA Optimization Report

### 1. HSA Triple Tax Advantage Explained
- Tax deduction on contributions
- Tax-free growth (no capital gains or dividend tax)
- Tax-free withdrawals for qualified medical expenses
- Comparison to 401k and IRA tax treatment

### 2. Contribution Optimization
- ${coverage}: Max contribution $${maxContribution}
- ${Number(age) >= 55 ? "Catch-up contribution (+$1,000) — you're eligible!" : "Catch-up contribution (+$1,000) — available at age 55"}
- ${totalContrib < maxContribution + catchUp55 ? `Gap to max: $${(maxContribution + catchUp55 - totalContrib).toLocaleString()}/year` : "You're contributing the maximum!"}
- Pro-rata contribution strategy (mid-year HDHP enrollment)
- Use-it-or-lose-it vs. rollover rules

### 3. Investment Strategy
- ${investmentPref || "Growth (aggressive)"} investment approach
- Threshold investing strategy ($1,000 in cash, rest invested)
- ${investableAfterYears > 0 ? `Current investable balance: $${investableAfterYears.toLocaleString()}` : "Build balance above $1,000 minimum before investing"}
- Fund placement: HSA vs. 401k vs. IRA priority
- HSA investment options (low-cost index funds)

### 4. Medical Expense Strategy
${medicalExpenses ? `- Estimated annual expenses: $${Number(medicalExpenses).toLocaleString()}\n- Pay current expenses out of pocket\n- Let HSA grow tax-free for future expenses\n- Save receipts for retroactive reimbursement` : "- Track all medical expenses for future reimbursement"}
- Eligible expenses list (broader than you think)
- Non-eligible: vitamins, insurance premiums (generally)

### 5. Long-Term Healthcare Planning
- HSA as retirement healthcare fund
- Medicare Part A/B/D costs in retirement
- Long-term care insurance synergy
- ${age ? `At age 65: Can withdraw for non-medical ( taxed as ordinary income, no penalty)` : "After age 65: Non-medical withdrawals taxed as ordinary income (like Traditional IRA)"}

### 6. Tax Savings Analysis
- Federal tax savings: $${taxSavingsFed.toLocaleString()}/year (at 22% bracket)
- State tax savings: $${taxSavingsState.toLocaleString()}/year (at 5% bracket)
- Total tax savings: $${totalTaxSavings.toLocaleString()}/year
- Over 10 years (with growth): significant compounding benefit

### 7. Employer Match / Contribution Strategy
${employer > 0 ? `- Employer contributes: $${employer.toLocaleString()}/year\n- Always maximize employer contribution first\n- Pre-tax vs. Roth HSA considerations` : "- No employer HSA contribution indicated\n- Consider HDHP + HSA as benefit when job searching"}

### 8. HSA vs. FSA Comparison
- HSA: Portable, accumulates, triple tax advantage
- FSA: Use-it-or-lose-it (though $610 rollover in 2024)
- Which to prioritize when both available

### 9. Estate & Survivor Benefits
- HSA transfers to spouse tax-free (spousal beneficiary)
- Non-spouse inheritance: taxable

### 10. Action Items
- Immediate: Verify you're at max contribution
- Investment: Move excess above $1,000 to investments
- Strategy: Pay current medical expenses from pocket
- Annual: Review and adjust contribution each year
- Age 55: Start catch-up contributions

Format as clean markdown with bullet points and specific dollar amounts.`;

    const completion = await openai.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 3000 });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
