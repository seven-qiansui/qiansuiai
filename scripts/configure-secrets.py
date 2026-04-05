#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GitHub Secrets 自动配置脚本"""

import base64
import json
import os
import sys
from pathlib import Path
from getpass import getpass

# 设置 UTF-8 编码
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import requests

# 配置
REPO = "seven-qiansui/qiansuiai"
SSH_KEY_PATH = Path.home() / ".ssh" / "id_ed25519"

print("GitHub Secrets Auto-Configuration Tool")
print("=" * 50)

# 获取 GitHub Token
token = getpass("Enter GitHub Token: ")

# 读取 SSH 私钥
print("\nReading SSH private key...")
try:
    with open(SSH_KEY_PATH, 'r', encoding='utf-8') as f:
        ssh_key = f.read()
    print("OK - SSH key loaded")
except FileNotFoundError:
    print(f"ERROR - SSH key not found: {SSH_KEY_PATH}")
    exit(1)

# GitHub API
api_base = f"https://api.github.com/repos/{REPO}"
headers = {
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github.v3+json"
}

# 获取公钥
print("\nFetching repository public key...")
resp = requests.get(f"{api_base}/actions/secrets/public-key", headers=headers)
if resp.status_code != 200:
    print(f"ERROR - Failed to get public key: {resp.text}")
    exit(1)

public_key = resp.json()
key_id = public_key["key_id"]
pk = public_key["key"]

print(f"OK - Public key loaded (ID: {key_id})")

# 导入 PyNaCl 用于加密
try:
    import base64
    from nacl import encoding, public
except ImportError:
    print("\nWARNING - Installing PyNaCl...")
    os.system("pip install pynacl")
    from nacl import encoding, public

# 加密函数
def encrypt_secret(value: str, key: str) -> str:
    """使用 libsodium 加密 Secret"""
    public_key_bytes = base64.b64decode(key)
    sealed_box = public.SealedBox(public_key_bytes)
    encrypted = sealed_box.encrypt(value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

# Secrets 配置
secrets = {
    "ALIYUN_SSH_KEY": ssh_key,
    "ALIYUN_HOST": "8.163.68.155",
    "ALIYUN_USER": "root",
}

# 逐个配置
print("\nConfiguring Secrets...")
for name, value in secrets.items():
    print(f"  {name}... ", end="")
    
    encrypted_value = encrypt_secret(value, pk)
    
    payload = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }
    
    resp = requests.put(
        f"{api_base}/actions/secrets/{name}",
        headers=headers,
        json=payload
    )
    
    if resp.status_code in [201, 204]:
        print("OK")
    else:
        print(f"FAILED: {resp.text}")

print("\n" + "=" * 50)
print("DONE! Secrets configured successfully!")
print(f"\nView: https://github.com/{REPO}/settings/secrets/actions")
print("\nNext step: Test auto-deployment")
print("  git push origin main")
