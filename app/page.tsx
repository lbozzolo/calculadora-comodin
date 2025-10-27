"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const calculatePaymentOptions = () => {
    const amount = Number.parseFloat(loanAmount) || 0
    if (amount <= 0) return []

    // Leer tasas de interés desde variables de entorno
    const rates = [
      Number(process.env.NEXT_PUBLIC_RATE_1) || 0.2,
      Number(process.env.NEXT_PUBLIC_RATE_2) || 0.052,
      Number(process.env.NEXT_PUBLIC_RATE_3) || 0.076,
      Number(process.env.NEXT_PUBLIC_RATE_6) || 0.135,
      Number(process.env.NEXT_PUBLIC_RATE_9) || 0.196,
      Number(process.env.NEXT_PUBLIC_RATE_12) || 0.255,
    ];

    const options = [
      {
        installments: 1,
        type: "En un pago",
        totalInterest: rates[0],
        bgColor: "bg-white",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      },
      {
        installments: 2,
        type: "2 Cuotas de",
        totalInterest: rates[1],
        bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100",
        textColor: "text-gray-700",
        borderColor: "border-blue-100",
      },
      {
        installments: 3,
        type: "3 Cuotas de",
        totalInterest: rates[2],
        bgColor: "bg-green-50",
        textColor: "text-gray-700",
        borderColor: "border-green-100",
      },
      {
        installments: 6,
        type: "6 Cuotas de",
        totalInterest: rates[3],
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        borderColor: "border-gray-150",
      },
      {
        installments: 9,
        type: "9 Cuotas de",
        totalInterest: rates[4],
        bgColor: "bg-slate-50",
        textColor: "text-gray-700",
        borderColor: "border-slate-150",
      },
      {
        installments: 12,
        type: "12 Cuotas de",
        totalInterest: rates[5],
        bgColor: "bg-neutral-50",
        textColor: "text-gray-700",
        borderColor: "border-neutral-150",
      },
    ];

    return options.map((option) => {
      const totalAmount = amount * (1 + option.totalInterest);
      const monthlyPayment = totalAmount / option.installments;
      const interestAmount = totalAmount - amount;

      return {
        ...option,
        monthlyPayment,
        totalAmount,
        interestAmount,
        description:
          option.installments === 1
            ? `Incluye ${(option.totalInterest * 100).toFixed(1)}% de interés`
            : `Total: ${formatCurrency(totalAmount)} | Interés: ${(option.totalInterest * 100).toFixed(1)}%`,
      };
    });
  }

  const paymentOptions = calculatePaymentOptions()

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="max-w-2xl mx-auto">
          <div>
            <Label htmlFor="loan" className="text-gray-700 font-medium text-lg mb-3 block">
              Ingrese monto
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
              <Input
                id="loan"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="pl-10 text-xl py-4 h-14 bg-white border-2 border-gray-300 rounded-lg shadow-sm w-full"
                placeholder="Ingrese el monto"
              />
            </div>
          </div>
        </div>

        {paymentOptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Opciones de Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {paymentOptions.map((option, index) => (
                <Card
                  key={index}
                  className={`${option.bgColor} ${option.borderColor} border-2 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg`}
                >
                  <CardContent className="p-3">
                    <div className="text-center space-y-1">
                      <h3 className={`text-xs font-semibold ${option.textColor}`}>{option.type}</h3>
                      <div className={`text-xl font-bold ${option.textColor}`}>
                        {formatCurrency(option.monthlyPayment)}
                      </div>
                      <p className={`text-xs ${option.textColor} opacity-75 leading-tight`}>{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {paymentOptions.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-comodin-0X3K0iAFDHIjtwJiyicSJHWvybJ5ag.webp"
              alt="Comodín Logo"
              className="w-80 h-auto drop-shadow-lg brightness-110 saturate-125 contrast-105"
            />
          </div>
        )}

        <div className="flex justify-center mt-8">
          <img
            src="https://calculadora-de-costos.vercel.app/logo_mercado_pago.webp"
            alt="Mercado Pago"
            className="h-12 w-auto"
          />
        </div>
      </div>
    </div>
  )
}
