"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Copy,
  ExternalLink,
  Download,
  FileText,
  Hash,
  Calendar,
  User,
  Building,
  QrCode,
  Eye,
  Lock,
  Globe,
  Activity,
  BarChart3,
  History,
  AlertTriangle,
  Info,
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
  description?: string
  expiryDate?: string
  category?: string
  level?: string
  score?: number
  verificationCount?: number
  lastVerified?: string
  blockchainNetwork?: string
  contractAddress?: string
  gasUsed?: string
  blockNumber?: number
  confirmations?: number
}

interface CertificateDetailsModalProps {
  certificate: Certificate | null
  isOpen: boolean
  onClose: () => void
}

export function CertificateDetailsModal({ certificate, isOpen, onClose }: CertificateDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!certificate) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "invalid":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const generateQRCode = () => {
    // This would generate a QR code for the certificate
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <span>Certificate Details</span>
            {getStatusIcon(certificate.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Header */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{certificate.title}</CardTitle>
                  <CardDescription className="text-base">
                    Issued by {certificate.issuer} to {certificate.recipient}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusBadge(certificate.status)}>
                    {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Blockchain Verified
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Blockchain</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Verification</span>
              </TabsTrigger>
              <TabsTrigger value="metadata" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Metadata</span>
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Actions</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Certificate Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{certificate.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{certificate.category || "Professional Development"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{certificate.level || "Advanced"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-medium">{certificate.score || "95/100"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Issuer Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuer:</span>
                      <span className="font-medium">{certificate.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium">{certificate.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issue Date:</span>
                      <span className="font-medium">{certificate.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className="font-medium">{certificate.expiryDate || "No Expiry"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {certificate.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Description</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{certificate.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Blockchain Tab */}
            <TabsContent value="blockchain" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>Transaction Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">Transaction ID:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1">{certificate.transactionId}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(certificate.transactionId)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">Block Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded flex-1">{certificate.blockHash}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(certificate.blockHash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Block Number:</span>
                      <span className="font-medium">{certificate.blockNumber || "1,234,567"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmations:</span>
                      <span className="font-medium">{certificate.confirmations || "156"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Network Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium">{certificate.blockchainNetwork || "Stacks Mainnet"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Address:</span>
                      <span className="font-medium text-sm">{certificate.contractAddress || "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifychain"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas Used:</span>
                      <span className="font-medium">{certificate.gasUsed || "45,678"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Fee:</span>
                      <span className="font-medium">{certificate.gasUsed ? `${parseInt(certificate.gasUsed) * 0.000001} STX` : "0.045678 STX"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verification Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(certificate.status)}
                      <div>
                        <div className="font-medium">Status: {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}</div>
                        <div className="text-sm text-muted-foreground">
                          {certificate.status === "verified" && "Certificate is authentic and verified on blockchain"}
                          {certificate.status === "pending" && "Certificate verification is in progress"}
                          {certificate.status === "invalid" && "Certificate verification failed"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verification Count:</span>
                        <span className="font-medium">{certificate.verificationCount || "23"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Verified:</span>
                        <span className="font-medium">{certificate.lastVerified || "2024-01-15 14:30:22"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Verification History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "2024-01-15 14:30:22", status: "verified", user: "John Doe" },
                        { date: "2024-01-10 09:15:45", status: "verified", user: "Jane Smith" },
                        { date: "2024-01-05 16:22:10", status: "verified", user: "Mike Johnson" },
                      ].map((verification, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-sm">{verification.date}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{verification.user}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Certificate Metadata</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Certificate ID</label>
                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">{certificate.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Issuer Address</label>
                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Recipient Address</label>
                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">SP2K1A1PMGW2ZJSRTPGZGM</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contract Version</label>
                        <p className="text-sm bg-muted px-2 py-1 rounded mt-1">v1.0.0</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Raw Certificate Data</h4>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{JSON.stringify({
  id: certificate.id,
  title: certificate.title,
  issuer: certificate.issuer,
  recipient: certificate.recipient,
  issueDate: certificate.issueDate,
  status: certificate.status,
  blockHash: certificate.blockHash,
  transactionId: certificate.transactionId,
  metadata: {
    category: certificate.category,
    level: certificate.level,
    score: certificate.score,
    description: certificate.description
  }
}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Certificate Link
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Security Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Cryptographically Signed</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Immutable on Blockchain</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Tamper-Proof</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Info className="h-4 w-4" />
                      <span className="text-sm">Publicly Verifiable</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
