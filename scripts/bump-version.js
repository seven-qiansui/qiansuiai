const fs = require('fs');
const { execSync } = require('child_process');

// 获取当前版本号
const currentVersion = fs.readFileSync('VERSION', 'utf8').trim();
const [major, minor, patch] = currentVersion.split('.').map(Number);

// 获取最后一个提交信息
let lastCommit = '';
try {
    lastCommit = execSync('git log -1 --oneline').toString().trim();
} catch (e) {
    console.log('⚠️ 无法获取提交信息，使用 patch 版本');
}

// 自动判断版本类型
let newVersion;
let bumpType = process.argv[2] || 'auto';

if (bumpType === 'major' || lastCommit.includes('BREAKING CHANGE') || lastCommit.includes('feat!:')) {
    newVersion = `${major + 1}.0.0`;
    bumpType = 'major';
} else if (bumpType === 'minor' || lastCommit.startsWith('feat:')) {
    newVersion = `${major}.${minor + 1}.0`;
    bumpType = 'minor';
} else {
    newVersion = `${major}.${minor}.${patch + 1}`;
    bumpType = 'patch';
}

// 写入新版本
fs.writeFileSync('VERSION', newVersion);
console.log(`📦 版本号：${currentVersion} → ${newVersion} (${bumpType})`);

// 创建 Git Tag
try {
    execSync(`git add VERSION`);
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'ignore' });
    execSync(`git tag v${newVersion}`);
    console.log(`✅ Tag 创建：v${newVersion}`);
    console.log(`📤 推送中...`);
    execSync(`git push && git push --tags`, { stdio: 'inherit' });
    console.log(`✅ 推送完成！`);
} catch (e) {
    console.log('⚠️ Git 操作失败，请手动推送');
}
