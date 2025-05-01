"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface WalletTokensProps {
  walletAddress: string
  isLoading: boolean
}

interface Token {
  id: string
  name: string
  symbol: string
  balance: string
  value: string
  price: string
  change24h: number
}

export function WalletTokens({ walletAddress, isLoading }: WalletTokensProps) {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // This is just mock data for demonstration
    const mockTokens: Token[] = [
      {
        id: "1",
        name: "Ethereum",
        symbol: "ETH",
        balance: "1.245",
        value: "$2,456.78",
        price: "$1,972.51",
        change24h: 2.34,
      },
      {
        id: "2",
        name: "USD Coin",
        symbol: "USDC",
        balance: "350.00",
        value: "$350.00",
        price: "$1.00",
        change24h: 0.01,
      },
      {
        id: "3",
        name: "Chainlink",
        symbol: "LINK",
        balance: "45.75",
        value: "$567.30",
        price: "$12.40",
        change24h: -1.23,
      },
      {
        id: "4",
        name: "Uniswap",
        symbol: "UNI",
        balance: "12.5",
        value: "$62.50",
        price: "$5.00",
        change24h: 3.45,
      },
    ]

    if (!isLoading) {
      // Simulate API delay
      const timer = setTimeout(() => {
        setTokens(mockTokens)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [walletAddress, isLoading])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No tokens found for this wallet
              </TableCell>
            </TableRow>
          ) : (
            tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-muted-foreground">{token.symbol}</div>
                </TableCell>
                <TableCell className="text-right">{token.balance}</TableCell>
                <TableCell className="text-right">{token.value}</TableCell>
                <TableCell className="text-right">{token.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {token.change24h > 0 ? (
                      <>
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">+{token.change24h}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-500">{token.change24h}%</span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
