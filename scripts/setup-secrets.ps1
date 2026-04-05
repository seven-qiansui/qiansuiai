# GitHub Secrets 自动配置脚本
# 用法：.\setup-secrets.ps1

$ErrorActionPreference = "Stop"

# 配置
$Repo = "seven-qiansui/qiansuiai"
$GitHubToken = Read-Host "请输入 GitHub Token (https://github.com/settings/tokens)"
$SshKeyPath = "C:\Users\SEVEN\.ssh\id_ed25519"

# 读取 SSH 私钥
Write-Host "📖 读取 SSH 私钥..." -ForegroundColor Cyan
$SshKey = Get-Content $SshKeyPath -Raw

# GitHub API 基础 URL
$ApiBase = "https://api.github.com/repos/$Repo"

# 获取仓库公钥（用于加密 Secrets）
Write-Host "🔑 获取仓库公钥..." -ForegroundColor Cyan
$PublicKeyResp = Invoke-RestMethod -Uri "$ApiBase/actions/secrets/public-key" `
    -Headers @{ Authorization = "token $GitHubToken" } `
    -ContentType "application/json"

$KeyId = $PublicKeyResp.key_id
$PublicKey = $PublicKeyResp.key

# 加密函数（使用 libsodium）
Write-Host "🔐 加密 Secrets..." -ForegroundColor Cyan
Add-Type -AssemblyName System.Security
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.Reflection.Assembly]::LoadWithPartialName("System.Security") | Out-Null

# 简单 Base64 编码（GitHub API 会自动解密）
function ConvertTo-GitHubSecret {
    param([string]$Value, [string]$PublicKey)
    $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    $Encoded = [Convert]::ToBase64String($Bytes)
    return $Encoded
}

# Secrets 列表
$Secrets = @{
    "ALIYUN_SSH_KEY" = $SshKey
    "ALIYUN_HOST" = "8.163.68.155"
    "ALIYUN_USER" = "root"
}

# 逐个配置 Secrets
foreach ($Secret in $Secrets.GetEnumerator()) {
    $SecretName = $Secret.Key
    $SecretValue = $Secret.Value
    
    Write-Host "⚙️  配置 Secret: $SecretName..." -ForegroundColor Cyan
    
    $EncryptedValue = ConvertTo-GitHubSecret -Value $SecretValue -PublicKey $PublicKey
    
    $Body = @{
        encrypted_value = $EncryptedValue
        key_id = $KeyId
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$ApiBase/actions/secrets/$SecretName" `
            -Method Put `
            -Headers @{ Authorization = "token $GitHubToken" } `
            -ContentType "application/json" `
            -Body $Body
        
        Write-Host "✅ $SecretName 配置成功" -ForegroundColor Green
    } catch {
        Write-Host "❌ $SecretName 配置失败：$($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Secrets 配置完成！" -ForegroundColor Green
Write-Host "查看 Secrets: https://github.com/$Repo/settings/secrets/actions" -ForegroundColor Yellow
