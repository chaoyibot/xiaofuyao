#!/usr/bin/env python3
"""
【后台任务 #3】小福药 · 合规审查脚本
- 自动扫描所有文案
- 检测违规词
- 输出审查报告
"""

import os
import re
import json
import glob

OUTPUT_DIR = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\小程序项目\小福药"

# 绝对禁止词
FORBIDDEN_WORDS = [
    "治愈", "根治", "完全康复", "彻底治好", "100%有效",
    "最好", "最强", "第一", "唯一", "特效", "祖传",
    "药到病除", "立竿见影", "一次见效",
    "无毒副作用", "零风险", "安全无副作用", "没有任何副作用",
]

# 必须出现的词
REQUIRED_WORDS = {
    "用药提醒": ["请在医生指导下使用", "请遵医嘱", "请仔细阅读说明书"],
    "处方提示": ["处方药", "凭医师处方"],
    "不良反应": ["不良反应", "副作用"],
}

def check_text(text, file_path):
    """检查单个文件"""
    issues = []
    
    # 1. 禁止词检查
    for word in FORBIDDEN_WORDS:
        if word in text:
            issues.append({
                "type": "禁止词",
                "level": "❌ 严重",
                "word": word,
                "file": file_path,
            })
    
    # 2. 必现词检查
    for category, words in REQUIRED_WORDS.items():
        if not any(w in text for w in words):
            # 只对内容文件检查（不是元数据文件）
            if "content" in file_path or "frontend" in file_path:
                issues.append({
                    "type": f"缺少{category}",
                    "level": "⚠️ 警告",
                    "missing": " 或 ".join(words[:2]),
                    "file": file_path,
                })
    
    return issues

def scan_directory(directory, extensions=[".md", ".vue", ".json", ".js", ".ts"]):
    """扫描目录"""
    all_files = []
    for ext in extensions:
        all_files.extend(glob.glob(os.path.join(directory, "**", f"*{ext}"), recursive=True))
    
    print(f"🔍 扫描目录: {directory}")
    print(f"📄 发现 {len(all_files)} 个文件")
    
    all_issues = []
    for filepath in all_files:
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
            issues = check_text(text, filepath)
            all_issues.extend(issues)
        except Exception as e:
            print(f"  ❌ 读取失败: {filepath} - {e}")
    
    return all_issues

def main():
    """主函数"""
    # 扫描内容目录
    content_issues = scan_directory(os.path.join(OUTPUT_DIR, "content"))
    frontend_issues = scan_directory(os.path.join(OUTPUT_DIR, "frontend"))
    
    all_issues = content_issues + frontend_issues
    
    # 输出报告
    report = {
        "scan_time": "2026-06-03",
        "total_files": len(content_issues) + len(frontend_issues),
        "total_issues": len(all_issues),
        "critical_count": sum(1 for i in all_issues if "严重" in i["level"]),
        "warning_count": sum(1 for i in all_issues if "警告" in i["level"]),
        "issues": all_issues,
    }
    
    report_path = os.path.join(OUTPUT_DIR, "compliance", "compliance_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\n📊 审查报告：")
    print(f"  ❌ 严重问题: {report['critical_count']}")
    print(f"  ⚠️ 警告: {report['warning_count']}")
    print(f"  📄 报告位置: {report_path}")
    
    if report['critical_count'] > 0:
        print(f"\n🚨 严重问题清单：")
        for issue in all_issues:
            if "严重" in issue["level"]:
                print(f"  - {issue['file']}: '{issue['word']}'")
    
    return report

if __name__ == "__main__":
    main()
