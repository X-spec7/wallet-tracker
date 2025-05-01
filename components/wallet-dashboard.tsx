"use client"

import { useState } from "react"
import { PlusCircle, Trash2, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletTransactions } from "@/components/wallet-transactions"
import { WalletTokens } from "@/components/wallet-tokens"
import { WalletOverview } from "@/components/wallet-overview"
import { SolanaWalletInfo } from "@/components/solana-wallet-info"
import { CopyTrading } from "@/components/copy-trading"

export function WalletDashboard() {
  const [wallets, setWallets] = useState<string[]>([])
  const [newWallet, setNewWallet] = useState("")
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addWallet = () => {
    if (newWallet && !wallets.includes(newWallet)) {
      const updatedWallets = [...wallets, newWallet]
      setWallets(updatedWallets)
      setSelectedWallet(newWallet)
      setNewWallet("")
    }
  }

  const removeWallet = (wallet: string) => {
    const updatedWallets = wallets.filter((w) => w !== wallet)
    setWallets(updatedWallets)
    if (selectedWallet === wallet) {
      setSelectedWallet(updatedWallets.length > 0 ? updatedWallets[0] : null)
    }
  }

  const refreshWallet = () => {
    if (selectedWallet) {
      setIsLoading(true)
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Solana Wallet Tracker</h1>
          <p className="text-muted-foreground">Monitor cryptocurrency wallets, track transactions, and copy trades.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Wallets</CardTitle>
                <CardDescription>Add wallets to track</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter wallet address"
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addWallet()}
                  />
                  <Button size="icon" onClick={addWallet}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  {wallets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No wallets added yet</p>
                  ) : (
                    wallets.map((wallet) => (
                      <div
                        key={wallet}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedWallet === wallet ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        <div className="truncate flex-1">
                          <span className="text-sm font-medium">
                            {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeWallet(wallet)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedWallet && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button variant="outline" className="justify-start" onClick={refreshWallet} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh Data
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(`https://explorer.solana.com/address/${selectedWallet}`, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Solana Explorer
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {selectedWallet ? (
            <Card>
              <CardHeader>
                <CardTitle>Wallet Details</CardTitle>
                <CardDescription className="truncate">{selectedWallet}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="staking">Staking</TabsTrigger>
                    <TabsTrigger value="copytrading">Copy Trading</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <WalletOverview walletAddress={selectedWallet} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="tokens">
                    <WalletTokens walletAddress={selectedWallet} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="transactions">
                    <WalletTransactions walletAddress={selectedWallet} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="staking">
                    <SolanaWalletInfo walletAddress={selectedWallet} isLoading={isLoading} />
                  </TabsContent>
                  <TabsContent value="copytrading">
                    <CopyTrading wallets={wallets} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No Wallet Selected</h3>
                  <p className="text-muted-foreground">
                    Add a wallet address to start tracking transactions and balances.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
