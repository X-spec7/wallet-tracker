"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface WalletOverviewProps {
  walletAddress: string
  isLoading: boolean
}

interface WalletStats {
  totalBalance: string
  totalValue: string
  change24h: number
  lastActivity: string
}

export function WalletOverview({ walletAddress, isLoading }: WalletOverviewProps) {
  const [stats, setStats] = useState<WalletStats | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // This is just mock data for demonstration
    const mockData: WalletStats = {
      totalBalance: "12.45 SOL",
      totalValue: "$456.78",
      change24h: 3.45,
      lastActivity: "2 hours ago",
    }

    if (!isLoading) {
      // Simulate API delay
      const timer = setTimeout(() => {
        setStats(mockData)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [walletAddress, isLoading])

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBalance}</div>
          <p className="text-xs text-muted-foreground">{stats.totalValue}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            {stats.change24h > 0 ? (
              <>
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+{stats.change24h}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{stats.change24h}%</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Compared to yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lastActivity}</div>
          <p className="text-xs text-muted-foreground">Last transaction time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Solana</div>
          <p className="text-xs text-muted-foreground">Mainnet</p>
        </CardContent>
      </Card>
    </div>
  )
}
