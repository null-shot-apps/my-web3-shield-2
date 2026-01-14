'use client';

import { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, Flag, TrendingUp, Database } from 'lucide-react';

type RiskLevel = 'safe' | 'warning' | 'danger' | 'unknown';

interface ScanResult {
  url?: string;
  address?: string;
  riskLevel: RiskLevel;
  threats: string[];
  details: string;
  timestamp: Date;
}

export default function Web3Shield() {
  const [activeTab, setActiveTab] = useState<'url' | 'address'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);

  const scanUrl = async (url: string): Promise<ScanResult> => {
    // Simulate API call - in production, this would call real scam detection APIs
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerUrl = url.toLowerCase();
    
    // Pattern matching for common phishing attempts
    const dangerousPatterns = [
      'metam4sk', 'metamask-', 'unisvvap', 'pancakeswap-', 'opensea-',
      'coinbase-', 'binance-', 'wallet-connect', 'web3-wallet'
    ];
    
    const suspiciousPatterns = [
      'airdrop', 'claim', 'free-nft', 'giveaway', 'urgent', 'verify-wallet'
    ];
    
    const isDangerous = dangerousPatterns.some(pattern => lowerUrl.includes(pattern));
    const isSuspicious = suspiciousPatterns.some(pattern => lowerUrl.includes(pattern));
    
    const threats: string[] = [];
    let riskLevel: RiskLevel = 'unknown';
    let details = '';
    
    if (isDangerous) {
      riskLevel = 'danger';
      threats.push('Known phishing domain pattern detected');
      threats.push('Mimics legitimate Web3 platform');
      details = 'This site appears to impersonate a legitimate cryptocurrency platform. Do not connect your wallet or enter any sensitive information.';
    } else if (isSuspicious) {
      riskLevel = 'warning';
      threats.push('Suspicious keywords detected');
      threats.push('Common scam tactics identified');
      details = 'This site uses language commonly associated with crypto scams. Proceed with extreme caution and verify authenticity.';
    } else if (lowerUrl.includes('uniswap.org') || lowerUrl.includes('metamask.io') || lowerUrl.includes('opensea.io')) {
      riskLevel = 'safe';
      details = 'This appears to be a legitimate Web3 platform. Always verify the exact URL matches the official site.';
    } else {
      riskLevel = 'unknown';
      details = 'No threats detected in our database. However, always exercise caution when connecting wallets or signing transactions.';
    }
    
    return {
      url,
      riskLevel,
      threats,
      details,
      timestamp: new Date()
    };
  };

  const scanAddress = async (address: string): Promise<ScanResult> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate address validation
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(address);
    
    if (!isValidFormat) {
      return {
        address,
        riskLevel: 'danger',
        threats: ['Invalid wallet address format'],
        details: 'This does not appear to be a valid Ethereum wallet address.',
        timestamp: new Date()
      };
    }
    
    // Simulate checking against scam database
    const knownScamAddresses = [
      '0x0000000000000000000000000000000000000000',
      '0x1111111111111111111111111111111111111111'
    ];
    
    if (knownScamAddresses.includes(address.toLowerCase())) {
      return {
        address,
        riskLevel: 'danger',
        threats: ['Flagged in scam database', 'Multiple user reports'],
        details: 'This address has been reported for fraudulent activity. Do not send funds to this address.',
        timestamp: new Date()
      };
    }
    
    return {
      address,
      riskLevel: 'safe',
      threats: [],
      details: 'No reports found for this address. Always verify transaction details before confirming.',
      timestamp: new Date()
    };
  };

  const handleScan = async () => {
    if (!inputValue.trim()) return;
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const result = activeTab === 'url' 
        ? await scanUrl(inputValue)
        : await scanAddress(inputValue);
      
      setScanResult(result);
      setRecentScans(prev => [result, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBg = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe': return 'bg-green-500/10 border-green-500/30';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'danger': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe': return <CheckCircle className="w-12 h-12" />;
      case 'warning': return <AlertTriangle className="w-12 h-12" />;
      case 'danger': return <XCircle className="w-12 h-12" />;
      default: return <Shield className="w-12 h-12" />;
    }
  };

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'safe': return 'Safe';
      case 'warning': return 'Suspicious';
      case 'danger': return 'Dangerous';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Web3 Shield</h1>
          </div>
          <p className="text-gray-400 mt-2">Real-time protection against crypto scams</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Scanner Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Scan for Threats</h2>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Website URL
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'address'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Wallet Address
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              placeholder={
                activeTab === 'url'
                  ? 'Enter website URL (e.g., https://example.com)'
                  : 'Enter wallet address (0x...)'
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleScan}
              disabled={isScanning || !inputValue.trim()}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan
                </>
              )}
            </button>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className={`border rounded-xl p-6 ${getRiskBg(scanResult.riskLevel)}`}>
              <div className="flex items-start gap-4">
                <div className={getRiskColor(scanResult.riskLevel)}>
                  {getRiskIcon(scanResult.riskLevel)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-2xl font-bold ${getRiskColor(scanResult.riskLevel)}`}>
                      {getRiskLabel(scanResult.riskLevel)}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {scanResult.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{scanResult.details}</p>
                  
                  {scanResult.threats.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-semibold text-gray-400">Detected Threats:</p>
                      {scanResult.threats.map((threat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <AlertTriangle className="w-4 h-4" />
                          {threat}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    <Flag className="w-4 h-4" />
                    Report this {activeTab === 'url' ? 'site' : 'address'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-gray-400 text-sm font-medium">Known Scams</h3>
            </div>
            <p className="text-3xl font-bold text-white">12,847</p>
            <p className="text-sm text-gray-500 mt-1">Updated daily</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-gray-400 text-sm font-medium">Threats Blocked</h3>
            </div>
            <p className="text-3xl font-bold text-white">847K+</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
            </div>
            <p className="text-3xl font-bold text-white">156K+</p>
            <p className="text-sm text-gray-500 mt-1">Protected daily</p>
          </div>
        </div>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Scans</h2>
            <div className="space-y-3">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={getRiskColor(scan.riskLevel)}>
                      {getRiskIcon(scan.riskLevel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {scan.url || scan.address}
                      </p>
                      <p className="text-sm text-gray-400">
                        {scan.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getRiskColor(scan.riskLevel)}`}>
                    {getRiskLabel(scan.riskLevel)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

