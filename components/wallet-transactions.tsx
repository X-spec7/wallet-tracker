"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface WalletTransactionsProps {
  walletAddress: string
  isLoading: boolean
}

interface Transaction {
  id: string
  type: "in" | "out"
  hash: string
  timestamp: string
  from: string
  to: string
  value: string
  fee: string
}

export function WalletTransactions({ walletAddress, isLoading }: WalletTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // This is just mock data for demonstration
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "in",
        hash: "5Uyz2mTmcHVHcMRGvNpjJjuDiGFmkPXcCgLuPWvYmZL9...",
        timestamp: "2023-05-01 14:32:15",
        from: "DRGNjvBvnXNiQz9dTppGkEcVsLxrYCJ2wh9zMEXHD9T...",
        to: walletAddress,
        value: "2.5 SOL",
        fee: "0.000005 SOL",
      },
      {
        id: "2",
        type: "out",
        hash: "3xGsZvNVvRRQVf6PiA4gX5xgz9RMbj2KjfaJcMUDLBJ...",
        timestamp: "2023-05-01 12:15:45",
        from: walletAddress,
        to: "8HGyAAB1yoM1wMeQXzdvEA9uHjYSFLKQv8CMQjs1nxQ...",
        value: "0.5 SOL",
        fee: "0.000005 SOL",
      },
      {
        id: "3",
        type: "in",
        hash: "4tSEGQkR1PVE4rMrJqQSHxNYmN5w2ynxdKQiYJpQZcB...",
        timestamp: "2023-04-30 23:45:12",
        from: "CZF1BgSsSBbZW7Y1PGNi76PG7LK9TzW7NbFTZsZLVNg...",
        to: walletAddress,
        value: "100 USDC",
        fee: "0.000005 SOL",
      },
      {
        id: "4",
        type: "out",
        hash: "2vkUDkGqPFbT2U8QvZKGBJzKYfLJYJJpZjNVXHvHWqL...",
        timestamp: "2023-04-30 18:22:33",
        from: walletAddress,
        to: "6YxjqXxEKHAYgSRjpLqr3tuHcj7ZPbKFwPZVhxMceyG...",
        value: "25 RAY",
        fee: "0.000005 SOL",
      },
    ]

    if (!isLoading) {
      // Simulate API delay
      const timer = setTimeout(() => {
        setTransactions(mockTransactions)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [walletAddress, isLoading])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No transactions found for this wallet
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center">
                    {tx.type === "in" ? (
                      <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    <span className={tx.type === "in" ? "text-green-500" : "text-amber-500"}>
                      {tx.type === "in" ? "Received" : "Sent"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{tx.hash}</TableCell>
                <TableCell>{tx.timestamp}</TableCell>
                <TableCell>{tx.value}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`https://explorer.solana.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on Solana Explorer</span>
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
