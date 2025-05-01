"use client"

import { useState } from "react"
import { Copy, Settings, AlertTriangle, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CopyTradingProps {
  wallets: string[]
}

interface CopyWallet {
  address: string
  isActive: boolean
  maxAmount: number
  minAmount: number
  copyPercent: number
  excludedTokens: string[]
}

interface CopiedTrade {
  id: string
  timestamp: string
  sourceWallet: string
  token: string
  action: "buy" | "sell"
  amount: string
  status: "completed" | "pending" | "failed"
}

export function CopyTrading({ wallets }: CopyTradingProps) {
  const [copyWallets, setCopyWallets] = useState<CopyWallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [copiedTrades, setCopiedTrades] = useState<CopiedTrade[]>([
    {
      id: "1",
      timestamp: "2023-05-01 14:32:15",
      sourceWallet: "DRGNjvBvnXNiQz9dTppGkEcVsLxrYCJ2wh9zMEXHD9T...",
      token: "RAY",
      action: "buy",
      amount: "25 RAY ($28.75)",
      status: "completed",
    },
    {
      id: "2",
      timestamp: "2023-05-01 12:15:45",
      sourceWallet: "DRGNjvBvnXNiQz9dTppGkEcVsLxrYCJ2wh9zMEXHD9T...",
      token: "SOL",
      action: "buy",
      amount: "0.5 SOL ($18.35)",
      status: "completed",
    },
    {
      id: "3",
      timestamp: "2023-04-30 23:45:12",
      sourceWallet: "8HGyAAB1yoM1wMeQXzdvEA9uHjYSFLKQv8CMQjs1nxQ...",
      token: "BONK",
      action: "sell",
      amount: "50000 BONK ($2.50)",
      status: "failed",
    },
  ])

  const [newExcludedToken, setNewExcludedToken] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)

  const addCopyWallet = (wallet: string) => {
    if (!copyWallets.some((w) => w.address === wallet)) {
      setCopyWallets([
        ...copyWallets,
        {
          address: wallet,
          isActive: false,
          maxAmount: 100,
          minAmount: 5,
          copyPercent: 100,
          excludedTokens: [],
        },
      ])
      setSelectedWallet(wallet)
    } else {
      setSelectedWallet(wallet)
    }
  }

  const toggleWalletActive = (wallet: string) => {
    setCopyWallets(copyWallets.map((w) => (w.address === wallet ? { ...w, isActive: !w.isActive } : w)))
  }

  const updateWalletSettings = (wallet: string, settings: Partial<CopyWallet>) => {
    setCopyWallets(copyWallets.map((w) => (w.address === wallet ? { ...w, ...settings } : w)))
  }

  const addExcludedToken = (wallet: string) => {
    if (newExcludedToken && !getWalletSettings(wallet)?.excludedTokens.includes(newExcludedToken)) {
      updateWalletSettings(wallet, {
        excludedTokens: [...(getWalletSettings(wallet)?.excludedTokens || []), newExcludedToken],
      })
      setNewExcludedToken("")
    }
  }

  const removeExcludedToken = (wallet: string, token: string) => {
    updateWalletSettings(wallet, {
      excludedTokens: getWalletSettings(wallet)?.excludedTokens.filter((t) => t !== token) || [],
    })
  }

  const getWalletSettings = (wallet: string) => {
    return copyWallets.find((w) => w.address === wallet)
  }

  const connectWallet = () => {
    // In a real app, this would connect to a Solana wallet like Phantom
    setWalletConnected(true)
  }

  return (
    <div className="space-y-6">
      {!walletConnected && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            You need to connect a wallet to execute copy trades.
            <Button variant="outline" size="sm" className="ml-2" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="wallets">
        <TabsList>
          <TabsTrigger value="wallets">Copy Wallets</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {wallets.map((wallet) => (
              <Card key={wallet} className="w-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium truncate">
                      {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
                    </CardTitle>
                    {copyWallets.some((w) => w.address === wallet) ? (
                      <Badge variant={getWalletSettings(wallet)?.isActive ? "default" : "outline"}>
                        {getWalletSettings(wallet)?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  {copyWallets.some((w) => w.address === wallet) ? (
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedWallet(wallet)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant={getWalletSettings(wallet)?.isActive ? "destructive" : "default"}
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleWalletActive(wallet)}
                      >
                        {getWalletSettings(wallet)?.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Stop Copying
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Copying
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="default" size="sm" className="w-full" onClick={() => addCopyWallet(wallet)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy This Wallet
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedWallet && getWalletSettings(selectedWallet) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Copy Settings for {selectedWallet.substring(0, 6)}...
                  {selectedWallet.substring(selectedWallet.length - 4)}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Copy Trading Settings</DialogTitle>
                  <DialogDescription>Configure how you want to copy trades from this wallet.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="active" className="col-span-3">
                      Active
                    </Label>
                    <Switch
                      id="active"
                      checked={getWalletSettings(selectedWallet)?.isActive}
                      onCheckedChange={(checked) => updateWalletSettings(selectedWallet, { isActive: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Copy Percentage ({getWalletSettings(selectedWallet)?.copyPercent}%)</Label>
                    <Slider
                      value={[getWalletSettings(selectedWallet)?.copyPercent || 100]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateWalletSettings(selectedWallet, { copyPercent: value[0] })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Copy {getWalletSettings(selectedWallet)?.copyPercent}% of each trade amount
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Min Amount (SOL)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={getWalletSettings(selectedWallet)?.minAmount}
                        onChange={(e) =>
                          updateWalletSettings(selectedWallet, {
                            minAmount: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">Max Amount (SOL)</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={getWalletSettings(selectedWallet)?.maxAmount}
                        onChange={(e) =>
                          updateWalletSettings(selectedWallet, {
                            maxAmount: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Excluded Tokens</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Token symbol (e.g., BONK)"
                        value={newExcludedToken}
                        onChange={(e) => setNewExcludedToken(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addExcludedToken(selectedWallet)}
                      />
                      <Button type="button" variant="secondary" onClick={() => addExcludedToken(selectedWallet)}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getWalletSettings(selectedWallet)?.excludedTokens.map((token) => (
                        <Badge key={token} variant="secondary" className="flex items-center gap-1">
                          {token}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeExcludedToken(selectedWallet, token)}
                          >
                            <span className="sr-only">Remove</span>
                            <span>×</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Copied Trades</CardTitle>
              <CardDescription>History of trades copied from tracked wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {copiedTrades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No copied trades yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    copiedTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.timestamp}</TableCell>
                        <TableCell className="font-mono text-xs">{trade.sourceWallet.substring(0, 6)}...</TableCell>
                        <TableCell>
                          <Badge variant={trade.action === "buy" ? "default" : "destructive"}>
                            {trade.action.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.token}</TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.status === "completed"
                                ? "default"
                                : trade.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {trade.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
