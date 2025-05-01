"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SolanaWalletInfoProps {
  walletAddress: string
  isLoading: boolean
}

interface StakeInfo {
  totalStaked: string
  activeStake: string
  rewards: string
  validators: number
}

export function SolanaWalletInfo({ walletAddress, isLoading }: SolanaWalletInfoProps) {
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from Solana's API
    // This is just mock data for demonstration
    const mockStakeInfo: StakeInfo = {
      totalStaked: "5.75 SOL",
      activeStake: "5.75 SOL",
      rewards: "0.12 SOL",
      validators: 2,
    }

    if (!isLoading) {
      // Simulate API delay
      const timer = setTimeout(() => {
        setStakeInfo(mockStakeInfo)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [walletAddress, isLoading])

  if (isLoading || !stakeInfo) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stakeInfo.totalStaked}</div>
          <p className="text-xs text-muted-foreground">Staked SOL</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stakeInfo.activeStake}</div>
          <p className="text-xs text-muted-foreground">Currently earning rewards</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Stake Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stakeInfo.rewards}</div>
          <p className="text-xs text-muted-foreground">Earned from staking</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Validators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stakeInfo.validators}</div>
          <p className="text-xs text-muted-foreground">Staked with</p>
        </CardContent>
      </Card>
    </div>
  )
}
