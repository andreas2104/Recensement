import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get tax statistics
export async function GET() {
  try {
    // Get all taxes
    const taxes = await prisma.tax.findMany();

    // Calculate stats
    const totalTaxes = taxes.length;
    const totalAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalPaid = taxes.reduce((sum, tax) => sum + tax.paidAmount, 0);
    const totalUnpaid = totalAmount - totalPaid;
    const paidCount = taxes.filter((tax) => tax.isPaid).length;
    const unpaidCount = totalTaxes - paidCount;

    // Group by year
    const yearMap = new Map<number, { total: number; paid: number; unpaid: number; count: number }>();
    
    taxes.forEach((tax) => {
      const existing = yearMap.get(tax.year) || { total: 0, paid: 0, unpaid: 0, count: 0 };
      yearMap.set(tax.year, {
        total: existing.total + tax.amount,
        paid: existing.paid + tax.paidAmount,
        unpaid: existing.unpaid + (tax.amount - tax.paidAmount),
        count: existing.count + 1,
      });
    });

    const byYear = Array.from(yearMap.entries())
      .map(([year, data]) => ({ year, ...data }))
      .sort((a, b) => b.year - a.year);

    return NextResponse.json({
      totalTaxes,
      totalAmount,
      totalPaid,
      totalUnpaid,
      paidCount,
      unpaidCount,
      byYear,
    });
  } catch (error) {
    console.error("Error fetching tax stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
