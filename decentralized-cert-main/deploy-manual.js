#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 CertifyChain Smart Contract Deployment');
console.log('==========================================\n');

// Read contract source
const contractPath = path.join(__dirname, 'contracts', 'certifychain.clar');
const contractSource = fs.readFileSync(contractPath, 'utf8');

console.log('✅ Contract loaded successfully!');
console.log('📝 Contract length:', contractSource.length, 'characters');
console.log('📁 Contract path:', contractPath);

console.log('\n🔧 DEPLOYMENT OPTIONS:');
console.log('=====================\n');

console.log('1️⃣  HIRO EXPLORER (Easiest):');
console.log('   • Go to: https://explorer.hiro.so/');
console.log('   • Connect your Leather wallet');
console.log('   • Click "Deploy Contract"');
console.log('   • Paste the contract code below');
console.log('   • Set contract name: certifychain');
console.log('   • Deploy!');

console.log('\n2️⃣  CLARINET (Local Development):');
console.log('   • Install: curl -L https://raw.githubusercontent.com/hirosystems/clarinet/master/install.sh | bash');
console.log('   • Create project: clarinet new certifychain-project');
console.log('   • Add contract: clarinet contract new certifychain');
console.log('   • Copy contract code below');
console.log('   • Run: clarinet dev');

console.log('\n3️⃣  STACKS CLI:');
console.log('   • Install Stacks CLI');
console.log('   • Use: stacks deploy-contract certifychain ./contracts/certifychain.clar');

console.log('\n📋 CONTRACT SOURCE CODE:');
console.log('========================');
console.log(contractSource);

console.log('\n🎯 CONTRACT FUNCTIONS:');
console.log('=====================');
console.log('• initialize() - Initialize contract');
console.log('• authorize-issuer(issuer) - Authorize issuer');
console.log('• issue-certificate(recipient, title, description, expiry-date?) - Issue certificate');
console.log('• verify-certificate(certificate-id) - Verify certificate');
console.log('• revoke-certificate(certificate-id) - Revoke certificate');
console.log('• get-certificate(certificate-id) - Get certificate');
console.log('• get-certificate-count() - Get total count');

console.log('\n🔗 AFTER DEPLOYMENT:');
console.log('===================');
console.log('• Contract address: YOUR_ADDRESS.certifychain');
console.log('• View on explorer: https://explorer.hiro.so/address/YOUR_ADDRESS.certifychain');
console.log('• Initialize contract by calling initialize() function');

console.log('\n✅ Ready for deployment!');
console.log('Choose your preferred method above.');
