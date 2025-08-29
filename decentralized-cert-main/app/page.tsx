"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedWalletConnect } from "@/components/enhanced-wallet-connect"
import { useWallet } from "@/lib/wallet-context"
import { CertificateDetailsModal } from "@/components/certificate-details-modal"
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
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedCertificates, setUploadedCertificates] = useState<any[]>([])
  const [showCertificatesModal, setShowCertificatesModal] = useState(false)
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<{file: File, certificate: any} | null>(null)
  const [verificationResults, setVerificationResults] = useState<{[key: string]: any}>({})
  const [formData, setFormData] = useState({
    title: "",
    recipient: "",
    issuer: "",
    date: "",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, JPEG, PNG)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      console.log('File selected:', file.name, file.size, file.type);
    }
  };

  const handleUploadCertificate = async () => {
    if (!wallet.isConnected) {
      alert("Please connect your wallet first")
      return
    }

    if (!formData.title || !formData.recipient || !formData.issuer || !formData.date) {
      alert('Please fill in all required fields')
      return
    }

    if (!uploadedFile) {
      alert('Please select a certificate file first')
      return
    }

    setIsUploading(true)
    
    try {
      // Create certificate metadata
      const certificateMetadata = {
        id: `CERT-${Date.now()}`,
        title: formData.title || 'Untitled Certificate',
        issuer: formData.issuer || 'Unknown',
        recipient: formData.recipient || 'Unknown',
        issueDate: formData.date || new Date().toISOString().split('T')[0],
        description: formData.description || '',
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type,
        uploadDate: new Date().toISOString(),
        walletAddress: wallet.address
      }
      
      console.log('Certificate created:', certificateMetadata)
      
      // Save certificate to uploaded certificates with file
      setUploadedCertificates(prev => [...prev, {
        ...certificateMetadata,
        file: uploadedFile // Store the actual file
      }])
      
      alert(`Certificate created successfully!\n\nCertificate ID: ${certificateMetadata.id}\nTitle: ${certificateMetadata.title}\nIssuer: ${certificateMetadata.issuer}\nRecipient: ${certificateMetadata.recipient}\nFile: ${certificateMetadata.fileName}`)
      
      // Reset form and file
      setFormData({
        title: "",
        recipient: "",
        issuer: "",
        date: "",
      })
      setUploadedFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('certificate-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      alert('Certificate creation failed. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleIssueCertificate = async () => {
    if (!wallet.isConnected) {
      alert("Please connect your wallet first")
      return
    }
    // Simulate certificate issuance
    alert("Certificate issued successfully! Transaction ID: SP5P5E5TQOA6...")
  }

  const verifyCertificate = (certificate: any) => {
    // Enhanced verification process with multiple checks
    const verificationResults = {
      fileIntegrity: checkFileIntegrity(certificate.file),
      metadataValidation: checkMetadataValidation(certificate),
      blockchainVerification: checkBlockchainVerification(certificate),
      digitalSignature: checkDigitalSignature(certificate),
      timestampValidation: checkTimestampValidation(certificate)
    };

    // Calculate overall verification score
    const totalChecks = Object.keys(verificationResults).length;
    const passedChecks = Object.values(verificationResults).filter(result => result.passed).length;
    const verificationScore = (passedChecks / totalChecks) * 100;

    // Determine overall status
    let status = 'invalid';
    let message = 'Certificate verification failed - multiple security issues detected';
    
    if (verificationScore >= 80) {
      status = 'verified';
      message = 'Certificate is authentic and verified on blockchain';
    } else if (verificationScore >= 60) {
      status = 'pending';
      message = 'Certificate verification pending - some checks inconclusive';
    }

    return {
      isVerified: verificationScore >= 80,
      status,
      message,
      verificationDate: new Date().toISOString(),
      verificationScore: Math.round(verificationScore),
      blockHash: verificationResults.blockchainVerification.passed ? `0x${Math.random().toString(16).substr(2, 40)}...` : null,
      transactionId: verificationResults.blockchainVerification.passed ? `SP${Math.random().toString(16).substr(2, 8).toUpperCase()}...` : null,
      detailedResults: verificationResults
    };
  };

  const checkFileIntegrity = (file: File) => {
    // Check file integrity and authenticity
    const fileSize = file.size;
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    // Check for suspicious file characteristics
    const suspiciousPatterns = [
      /\.exe$/, /\.bat$/, /\.cmd$/, /\.scr$/, /\.pif$/, /\.com$/,
      /\.vbs$/, /\.js$/, /\.jar$/, /\.msi$/, /\.dll$/, /\.sys$/
    ];
    
    const hasSuspiciousExtension = suspiciousPatterns.some(pattern => pattern.test(fileName));
    const isReasonableSize = fileSize > 0 && fileSize < 50 * 1024 * 1024; // 50MB limit
    const hasValidType = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(fileType);
    
    return {
      passed: !hasSuspiciousExtension && isReasonableSize && hasValidType,
      details: {
        fileSize: `${(fileSize / 1024 / 1024).toFixed(2)} MB`,
        fileType: fileType,
        hasSuspiciousExtension,
        isReasonableSize,
        hasValidType
      }
    };
  };

  const checkMetadataValidation = (certificate: any) => {
    // Validate certificate metadata
    const requiredFields = ['title', 'recipient', 'issuer', 'issueDate'];
    const hasAllRequiredFields = requiredFields.every(field => 
      certificate[field] && certificate[field].trim().length > 0
    );
    
    const hasValidDate = !isNaN(new Date(certificate.issueDate).getTime());
    const hasValidRecipient = /^SP[0-9A-Z]{38}$/.test(certificate.recipient) || 
                             certificate.recipient.includes('@') || 
                             certificate.recipient.length > 5;
    
    return {
      passed: hasAllRequiredFields && hasValidDate && hasValidRecipient,
      details: {
        hasAllRequiredFields,
        hasValidDate,
        hasValidRecipient,
        missingFields: requiredFields.filter(field => !certificate[field] || certificate[field].trim().length === 0)
      }
    };
  };

  const checkBlockchainVerification = (certificate: any) => {
    // Simulate blockchain verification
    const hasBlockchainRecord = Math.random() > 0.2; // 80% chance of having blockchain record
    const isRecentTransaction = Math.random() > 0.1; // 90% chance of recent transaction
    
    return {
      passed: hasBlockchainRecord && isRecentTransaction,
      details: {
        hasBlockchainRecord,
        isRecentTransaction,
        blockHeight: hasBlockchainRecord ? Math.floor(Math.random() * 1000000) + 1000000 : null
      }
    };
  };

  const checkDigitalSignature = (certificate: any) => {
    // Simulate digital signature verification
    const hasValidSignature = Math.random() > 0.15; // 85% chance of valid signature
    const signatureAlgorithm = hasValidSignature ? 'ECDSA-SHA256' : null;
    
    return {
      passed: hasValidSignature,
      details: {
        hasValidSignature,
        signatureAlgorithm,
        signatureTimestamp: hasValidSignature ? new Date().toISOString() : null
      }
    };
  };

  const checkTimestampValidation = (certificate: any) => {
    // Validate timestamps
    const issueDate = new Date(certificate.issueDate);
    const uploadDate = new Date(certificate.uploadDate);
    const currentDate = new Date();
    
    const isIssueDateValid = issueDate <= currentDate && issueDate >= new Date('2020-01-01');
    const isUploadDateValid = uploadDate <= currentDate && uploadDate >= issueDate;
    const isTimeSequenceValid = uploadDate >= issueDate;
    
    return {
      passed: isIssueDateValid && isUploadDateValid && isTimeSequenceValid,
      details: {
        isIssueDateValid,
        isUploadDateValid,
        isTimeSequenceValid,
        issueDate: issueDate.toISOString(),
        uploadDate: uploadDate.toISOString()
      }
    };
  };

  const handleFilePreview = (certificate: any) => {
    if (certificate.file) {
      setSelectedFileForPreview({ file: certificate.file, certificate });
    }
  };

  const handleVerifyCertificate = (certificate: any) => {
    const verification = verifyCertificate(certificate);
    setVerificationResults(prev => ({
      ...prev,
      [certificate.id]: verification
    }));
  };

  const renderFilePreview = (file: File) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      // Image preview
      const url = URL.createObjectURL(file);
      return (
        <div className="flex justify-center">
          <img 
            src={url} 
            alt="Certificate preview" 
            className="max-w-full max-h-96 object-contain rounded-lg border border-border"
            onLoad={() => URL.revokeObjectURL(url)}
          />
        </div>
      );
    } else if (fileType === 'application/pdf') {
      // PDF preview
      const url = URL.createObjectURL(file);
      return (
        <div className="flex justify-center">
          <iframe
            src={url}
            className="w-full h-96 border border-border rounded-lg"
            title="PDF preview"
            onLoad={() => URL.revokeObjectURL(url)}
          />
        </div>
      );
    } else {
      // Generic file preview
      return (
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      );
    }
  };

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
              <div className="flex items-center space-x-6">
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
                
                {/* Certificates Column */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent/10 p-2 rounded-lg transition-colors duration-200"
                  onClick={() => setShowCertificatesModal(true)}
                >
                  <Award className="h-5 w-5 text-accent" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Certificates</div>
                    <div className="text-xs text-muted-foreground">
                      {uploadedCertificates.length} uploaded
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Database className="h-3 w-3 mr-1" />
                  Stacks Network
                </Badge>
                <EnhancedWalletConnect />
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
                  Add Certificate
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
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setIsModalOpen(true)
                              }}
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
                        <span className="text-sm">Please connect your wallet to add certificates</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-accent/30 bg-accent/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-accent" />
                      <span>Add New Certificate</span>
                    </CardTitle>
                    <CardDescription>Create and add a new certificate on the Stacks blockchain</CardDescription>
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
                      <label className="text-sm font-medium">Certificate File</label>
                      <div className="flex space-x-2">
                        <input
                          id="certificate-file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => document.getElementById('certificate-file')?.click()}
                          disabled={!wallet.isConnected}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadedFile ? uploadedFile.name : 'Select Certificate File'}
                        </Button>
                      </div>
                      {uploadedFile && (
                        <div className="text-xs text-muted-foreground">
                          Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                    {uploadedFile && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!wallet.isConnected || isUploading}
                        onClick={handleUploadCertificate}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    )}
                    <Button className="w-full" onClick={handleIssueCertificate} disabled={!wallet.isConnected}>
                      Add Certificate on Stacks
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      {/* Certificate Details Modal */}
      <CertificateDetailsModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCertificate(null)
        }}
      />

      {/* Certificates Modal */}
      {showCertificatesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-bold">Uploaded Certificates</h2>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  {uploadedCertificates.length} certificates
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCertificatesModal(false)}
                className="h-8 w-8 p-0"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {uploadedCertificates.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Certificates Uploaded</h3>
                  <p className="text-sm text-muted-foreground">Upload your first certificate to see it here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedCertificates.map((cert, index) => {
                    const verification = verificationResults[cert.id];
                    return (
                      <Card key={cert.id} className="border-border/50 bg-card/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{cert.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              {verification ? (
                                <>
                                  {getStatusIcon(verification.status)}
                                  <Badge className={getStatusBadge(verification.status)}>
                                    {verification.status}
                                  </Badge>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerifyCertificate(cert)}
                                  className="text-xs"
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Recipient:</span>
                              <p className="text-foreground">{cert.recipient}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Issuer:</span>
                              <p className="text-foreground">{cert.issuer}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Issue Date:</span>
                              <p className="text-foreground">{cert.issueDate}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">File:</span>
                              <p className="text-foreground">{cert.fileName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Certificate ID:</span>
                              <p className="text-foreground font-mono text-xs">{cert.id}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Upload Date:</span>
                              <p className="text-foreground">{new Date(cert.uploadDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                                                     {verification && (
                             <div className="border-t border-border/50 pt-3">
                               <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center space-x-2">
                                   <Shield className="h-4 w-4 text-primary" />
                                   <span className="text-sm font-medium">Verification Details</span>
                                   <Badge variant="outline" className="text-xs">
                                     {verification.verificationScore}% Score
                                   </Badge>
                                 </div>
                                 {cert.file && (
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleFilePreview(cert)}
                                     className="text-xs"
                                   >
                                     <ExternalLink className="h-3 w-3 mr-1" />
                                     View File
                                   </Button>
                                 )}
                               </div>
                               <p className="text-sm text-muted-foreground mb-3">{verification.message}</p>
                             
                             {/* Detailed Verification Results */}
                             <div className="space-y-2 text-xs">
                               <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                                 <span className="font-medium">File Integrity</span>
                                 <div className="flex items-center space-x-1">
                                   {verification.detailedResults.fileIntegrity.passed ? 
                                     <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                     <XCircle className="h-3 w-3 text-red-500" />
                                   }
                                   <span className={verification.detailedResults.fileIntegrity.passed ? 'text-green-600' : 'text-red-600'}>
                                     {verification.detailedResults.fileIntegrity.passed ? 'Passed' : 'Failed'}
                                   </span>
                                 </div>
                               </div>
                               
                               <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                                 <span className="font-medium">Metadata Validation</span>
                                 <div className="flex items-center space-x-1">
                                   {verification.detailedResults.metadataValidation.passed ? 
                                     <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                     <XCircle className="h-3 w-3 text-red-500" />
                                   }
                                   <span className={verification.detailedResults.metadataValidation.passed ? 'text-green-600' : 'text-red-600'}>
                                     {verification.detailedResults.metadataValidation.passed ? 'Passed' : 'Failed'}
                                   </span>
                                 </div>
                               </div>
                               
                               <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                                 <span className="font-medium">Blockchain Verification</span>
                                 <div className="flex items-center space-x-1">
                                   {verification.detailedResults.blockchainVerification.passed ? 
                                     <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                     <XCircle className="h-3 w-3 text-red-500" />
                                   }
                                   <span className={verification.detailedResults.blockchainVerification.passed ? 'text-green-600' : 'text-red-600'}>
                                     {verification.detailedResults.blockchainVerification.passed ? 'Passed' : 'Failed'}
                                   </span>
                                 </div>
                               </div>
                               
                               <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                                 <span className="font-medium">Digital Signature</span>
                                 <div className="flex items-center space-x-1">
                                   {verification.detailedResults.digitalSignature.passed ? 
                                     <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                     <XCircle className="h-3 w-3 text-red-500" />
                                   }
                                   <span className={verification.detailedResults.digitalSignature.passed ? 'text-green-600' : 'text-red-600'}>
                                     {verification.detailedResults.digitalSignature.passed ? 'Passed' : 'Failed'}
                                   </span>
                                 </div>
                               </div>
                               
                               <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                                 <span className="font-medium">Timestamp Validation</span>
                                 <div className="flex items-center space-x-1">
                                   {verification.detailedResults.timestampValidation.passed ? 
                                     <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                     <XCircle className="h-3 w-3 text-red-500" />
                                   }
                                   <span className={verification.detailedResults.timestampValidation.passed ? 'text-green-600' : 'text-red-600'}>
                                     {verification.detailedResults.timestampValidation.passed ? 'Passed' : 'Failed'}
                                   </span>
                                 </div>
                               </div>
                             </div>
                             
                                                            {verification.isVerified && (
                                 <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                   <div>
                                     <span className="font-medium text-muted-foreground">Block Hash:</span>
                                     <p className="font-mono text-foreground">{verification.blockHash}</p>
                                   </div>
                                   <div>
                                     <span className="font-medium text-muted-foreground">Transaction ID:</span>
                                     <p className="font-mono text-foreground">{verification.transactionId}</p>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <Upload className="h-6 w-6 text-accent" />
                <div>
                  <h2 className="text-xl font-bold">File Preview</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedFileForPreview.certificate.title} - {selectedFileForPreview.file.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFileForPreview(null)}
                className="h-8 w-8 p-0"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {renderFilePreview(selectedFileForPreview.file)}
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">File Name:</span>
                    <p className="text-foreground">{selectedFileForPreview.file.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">File Size:</span>
                    <p className="text-foreground">{(selectedFileForPreview.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">File Type:</span>
                    <p className="text-foreground">{selectedFileForPreview.file.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Certificate ID:</span>
                    <p className="text-foreground font-mono text-xs">{selectedFileForPreview.certificate.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
