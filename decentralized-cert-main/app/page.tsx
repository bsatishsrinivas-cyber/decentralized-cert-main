"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/lib/wallet-context"
import {
  Shield,
  Search,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Users,
  Database,
  Zap,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react"

interface Certificate {
  id: string
  title: string
  issuer: string
  recipient: string
  issueDate: string
  status: "verified" | "pending" | "invalid"
  blockHash: string
  transactionId: string
}

const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "Blockchain Developer Certification",
    issuer: "Stacks Foundation",
    recipient: "John Doe",
    issueDate: "2024-01-15",
    status: "verified",
    blockHash: "0x1a2b3c4d5e6f...",
    transactionId: "SP1K1A1PMGW2...",
  },
  {
    id: "2",
    title: "Smart Contract Auditor",
    issuer: "CryptoAcademy",
    recipient: "Jane Smith",
    issueDate: "2024-02-20",
    status: "verified",
    blockHash: "0x7g8h9i0j1k2l...",
    transactionId: "SP2M2B2QNHX3...",
  },
  {
    id: "3",
    title: "DeFi Specialist",
    issuer: "Web3 Institute",
    recipient: "Mike Johnson",
    issueDate: "2024-03-10",
    status: "pending",
    blockHash: "0x3m4n5o6p7q8r...",
    transactionId: "SP3N3C3ROIA4...",
  },
]

export default function CertificateVerifier() {
  const [searchQuery, setSearchQuery] = useState("")
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("verify")
  const [verificationResult, setVerificationResult] = useState<Certificate | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    recipient: "",
    issuer: "",
    date: "",
    description: "",
  })
  const { wallet } = useWallet()

  useEffect(() => {
    // Simulate loading certificates
    const timer = setTimeout(() => {
      setCertificates(mockCertificates)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = async () => {
    setIsLoading(true)
    setShowResult(false)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (searchQuery.trim()) {
      const mockResult = mockCertificates.find(
        (cert) =>
          cert.id === searchQuery ||
          cert.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.blockHash.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || {
        id: "verified-001",
        title: "Blockchain Security Specialist",
        issuer: "Crypto Institute",
        recipient: "Alex Thompson",
        issueDate: "2024-03-15",
        status: "verified" as const,
        blockHash: "0x9f8e7d6c5b4a...",
        transactionId: "SP4O4D4SPMZ5...",
      }
      setVerificationResult(mockResult)
      setShowResult(true)
    }
    setIsLoading(false)
  }



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleIssueCertificate = async () => {
    if (!wallet.isConnected) {
      alert("Please connect your wallet first")
      return
    }
    // Simulate certificate issuance
    alert("Certificate issued successfully! Transaction ID: SP5P5E5TQOA6...")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "invalid":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "bg-primary/10 text-primary border-primary/20",
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      invalid: "bg-destructive/10 text-destructive border-destructive/20",
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-lg animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-secondary/10 rounded-full blur-lg animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    CertifyChain
                  </h1>
                  <p className="text-sm text-muted-foreground">Decentralized Certificate Verification</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Database className="h-3 w-3 mr-1" />
                  Stacks Network
                </Badge>
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="animate-slide-up">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent text-balance">
                Verify Certificates on the Blockchain
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Instantly verify the authenticity of digital certificates using the power of Stacks blockchain
                technology
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {[
                { icon: Award, label: "Certificates Verified", value: "12,847" },
                { icon: Users, label: "Active Institutions", value: "234" },
                { icon: Zap, label: "Avg. Verification Time", value: "2.3s" },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 animate-slide-up hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-20">
          <div className="container mx-auto max-w-6xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 backdrop-blur-sm">
                <TabsTrigger
                  value="verify"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Verify Certificate
                </TabsTrigger>
                <TabsTrigger
                  value="browse"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Browse Certificates
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Issue Certificate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="verify" className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5 text-primary" />
                      <span>Certificate Verification</span>
                    </CardTitle>
                    <CardDescription>
                      Enter a certificate ID, transaction hash, or recipient address to verify authenticity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter certificate ID or transaction hash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-background/50"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button onClick={handleSearch} disabled={isLoading} className="px-8">
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {isLoading && (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center space-x-2 text-muted-foreground">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                          <span>Verifying on Stacks blockchain...</span>
                        </div>
                      </div>
                    )}

                    {showResult && verificationResult && (
                      <Card className="border-primary/20 bg-primary/5 animate-slide-up">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-primary">
                            {getStatusIcon(verificationResult.status)}
                            <span>Verification Result</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Certificate Title</label>
                              <p className="text-foreground font-medium">{verificationResult.title}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusBadge(verificationResult.status)}>
                                  {verificationResult.status.charAt(0).toUpperCase() +
                                    verificationResult.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Issuer</label>
                              <p className="text-foreground">{verificationResult.issuer}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                              <p className="text-foreground">{verificationResult.recipient}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                              <p className="text-foreground">{verificationResult.issueDate}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                              <div className="flex items-center space-x-2">
                                <p className="text-foreground font-mono text-sm">{verificationResult.transactionId}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(verificationResult.transactionId)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-4">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </Button>
                            <Button variant="outline" size="sm">
                              Download Certificate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="browse" className="space-y-6">
                <div className="grid gap-6">
                  {certificates.map((cert, index) => (
                    <Card
                      key={cert.id}
                      className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group animate-slide-up hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {cert.title}
                              </h3>
                              {getStatusIcon(cert.status)}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>
                                  <strong>Issuer:</strong> {cert.issuer}
                                </span>
                                <span>
                                  <strong>Recipient:</strong> {cert.recipient}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span>
                                  <strong>Issue Date:</strong> {cert.issueDate}
                                </span>
                                <span>
                                  <strong>Block Hash:</strong> {cert.blockHash}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <strong>Transaction ID:</strong>
                                <span className="font-mono">{cert.transactionId}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(cert.transactionId)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusBadge(cert.status)}>
                              {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                {!wallet.isConnected && (
                  <Card className="border-yellow-500/20 bg-yellow-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Please connect your wallet to issue certificates</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>Issue New Certificate</span>
                    </CardTitle>
                    <CardDescription>Create and issue a new certificate on the Stacks blockchain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Certificate Title</label>
                        <Input
                          placeholder="e.g., Blockchain Developer Certification"
                          className="bg-background/50"
                          value={formData.title}
                          onChange={(e) => handleFormChange("title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Recipient Address</label>
                        <Input
                          placeholder="SP1K1A1PMGW2..."
                          className="bg-background/50"
                          value={formData.recipient}
                          onChange={(e) => handleFormChange("recipient", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issuer Organization</label>
                        <Input
                          placeholder="Your Organization Name"
                          className="bg-background/50"
                          value={formData.issuer}
                          onChange={(e) => handleFormChange("issuer", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issue Date</label>
                        <Input
                          type="date"
                          className="bg-background/50"
                          value={formData.date}
                          onChange={(e) => handleFormChange("date", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Certificate Description</label>
                      <textarea
                        className="w-full p-3 rounded-md border border-border bg-background/50 text-sm resize-none"
                        rows={3}
                        placeholder="Describe the certificate and its requirements..."
                        value={formData.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                      />
                    </div>
                    <Button className="w-full" onClick={handleIssueCertificate} disabled={!wallet.isConnected}>
                      Issue Certificate on Stacks
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  )
}
