import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { hdhpCoverage, annualHouseholdIncome, filingStatus, currentHSABalance, annualHSAContribution, hsaEmployerContribution, hsaInvestment, fsaBalance, healthcareSpending, familySituation } = await req.json();

    const prompt = `You are an expert health savings account and tax-optimization financial planner. Generate a comprehensive HSA and FSA optimization strategy in markdown based on the following profile:

- HDHP Coverage Type: ${hdhpCoverage || "N/A"}
- Annual Household Income: ${annualHouseholdIncome ? "$" + Number(annualHouseholdIncome).toLocaleString() : "N/A"}
- Filing Status: ${filingStatus || "N/A"}
- Current HSA Balance: ${currentHSABalance ? "$" + Number(currentHSABalance).toLocaleString() : "N/A"}
- Annual HSA Contribution: ${annualHSAContribution ? "$" + Number(annualHSAContribution).toLocaleString() : "N/A"}
- Employer HSA Contribution: ${hsaEmployerContribution ? "$" + Number(hsaEmployerContribution).toLocaleString() : "N/A"}
- HSA Investment Status: ${hsaInvestment || "N/A"}
- FSA Balance: ${fsaBalance ? "$" + Number(fsaBalance).toLocaleString() : "N/A"}
- Annual Healthcare Spending: ${healthcareSpending ? "$" + Number(healthcareSpending).toLocaleString() : "N/A"}
- Family/Health Notes: ${familySituation || "N/A"}

Generate a comprehensive HSA/FSA optimization strategy including:
1. **2026 HSA Contribution Limits** — Individual: $3,850, Family: $7,750, Catch-up (55+): +$1,000. Show total possible contribution including employer match.
2. **Triple-Tax Advantage Explained** — Walk through: tax-deductible contributions, tax-free growth (if invested), tax-free withdrawals for qualified medical expenses
3. **Cash vs. Invest Split Strategy** — Based on current HSA balance and investment status:
   - Keep 1-2 years of expected medical expenses in cash/HYSA within HSA
   - Invest remainder in diversified index funds
   - Recommended platform: Schwab, Fidelity, or Lively HSA (no-fee investment options)
4. **Catch-Up Contribution Analysis** — If age 55+, calculate the additional $1,000/year benefit and total extra savings by age 65
5. **Medicare Coordination Strategy** — For those approaching 65: HSA implications when enrolled in Medicare (can contribute pro-rata in the year of enrollment), Medicare Advantage MSA option
6. **FSA vs. HSA Optimization** — If the user has an FSA (limited purpose or general), explain how to coordinate: use FSA for vision/dental, HSA for everything else. Warn about use-it-or-lose-it
7. **HSA ROI Analysis** — Show the long-term value of investing HSA funds vs. spending them today. Compare: paying $2,000 medical today from HSA cash vs. investing and letting it grow at 7% for 20 years
8. **Optimal HSA Strategy by Phase** — Break down by life stage: accumulation (under 40), mid-career (40-55), pre-Medicare (55-65), Medicare (65+)
9. **Action Steps** — Numbered checklist: open investment HSA, allocate funds, set up automatic contributions, review annually during open enrollment

Format as clean markdown with tables, bold numbers, and clear sections.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const output = completion.choices[0].message.content;
    return NextResponse.json({ output });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
