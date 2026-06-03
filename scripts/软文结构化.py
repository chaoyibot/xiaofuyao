#!/usr/bin/env python3
"""
【后台任务 #1】小福药 · 100+ 软文结构化脚本
- 读取 知识库/氟尿嘧啶/氟尿嘧啶软文100篇/ 下的 .md 文件
- 提取：标题、核心卖点、适应症、关键词、摘要、推荐位
- 输出：JSON 格式，存入 content/软文结构化/
- 自动打标签：结直肠癌/胃癌/乳腺癌/头颈肿瘤

用法：python scripts/软文结构化.py
"""

import os
import re
import json
import glob
from datetime import datetime

# 路径配置
SOURCE_DIR = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\氟尿嘧啶软文100篇"
OUTPUT_DIR = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\小程序项目\小福药\content\软文结构化"

# 适应症标签
TAG_RULES = {
    "结直肠癌": ["结直肠", "肠癌", "结肠", "直肠"],
    "胃癌": ["胃癌", "胃肿瘤", "胃部"],
    "乳腺癌": ["乳腺癌", "乳腺肿瘤"],
    "头颈肿瘤": ["头颈", "口腔癌", "咽癌", "喉癌", "鼻咽"],
    "肝癌": ["肝癌", "肝肿瘤"],
    "胰腺癌": ["胰腺", "胰癌"],
}

# 卖点标签
SELLING_POINTS = {
    "便捷": ["便捷", "方便", "在家", "居家", "口服"],
    "安全": ["安全", "副作用小", "耐受", "低毒"],
    "经济": ["经济", "省钱", "省下", "便宜", "费用"],
    "精准": ["精准", "靶向", "个体化"],
    "依从性": ["依从", "坚持", "完成治疗"],
}

def detect_tags(text, rules):
    """根据规则匹配标签"""
    found = []
    for tag, keywords in rules.items():
        if any(kw in text for kw in keywords):
            found.append(tag)
    return found if found else ["通用"]

def extract_summary(text, max_chars=200):
    """提取摘要"""
    # 找第一个非空段落
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip() and not p.strip().startswith("#")]
    if not paragraphs:
        return ""
    summary = paragraphs[0]
    if len(summary) > max_chars:
        summary = summary[:max_chars] + "..."
    return summary

def parse_filename(filename):
    """解析文件名：001_xxx.md → 提取编号和标题"""
    base = os.path.splitext(filename)[0]
    m = re.match(r"(\d+)_(.+)", base)
    if m:
        return m.group(1), m.group(2)
    return "0", base

def process_article(filepath):
    """处理单篇文章"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    article_id, title = parse_filename(filename)
    
    # 移除 markdown 标记
    plain = re.sub(r"#+\s*", "", content)
    plain = re.sub(r"\*+", "", plain)
    plain = re.sub(r"_+", "", plain)
    
    # 检测标签
    indications = detect_tags(plain, TAG_RULES)
    selling_points = detect_tags(plain, SELLING_POINTS)
    
    # 提取摘要
    summary = extract_summary(plain)
    
    return {
        "id": int(article_id) if article_id.isdigit() else 0,
        "title": title.replace("_", "：").replace("-", "："),
        "filename": filename,
        "summary": summary,
        "indications": indications,
        "selling_points": selling_points,
        "word_count": len(plain),
        "content_preview": plain[:500] + ("..." if len(plain) > 500 else ""),
        "processed_at": datetime.now().isoformat(),
    }

def main():
    """主函数"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    md_files = glob.glob(os.path.join(SOURCE_DIR, "*.md"))
    print(f"📚 发现 {len(md_files)} 篇软文")
    
    articles = []
    for filepath in md_files:
        try:
            article = process_article(filepath)
            articles.append(article)
        except Exception as e:
            print(f"  ❌ 处理失败: {os.path.basename(filepath)} - {e}")
    
    # 按 ID 排序
    articles.sort(key=lambda x: x["id"])
    
    # 输出全量
    output_file = os.path.join(OUTPUT_DIR, "all_articles.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    print(f"✅ 全量入库: {output_file}")
    
    # 按适应症分类输出
    for indication in ["结直肠癌", "胃癌", "乳腺癌", "头颈肿瘤", "肝癌", "胰腺癌", "通用"]:
        subset = [a for a in articles if indication in a["indications"]]
        if subset:
            cat_file = os.path.join(OUTPUT_DIR, f"category_{indication}.json")
            with open(cat_file, "w", encoding="utf-8") as f:
                json.dump(subset, f, ensure_ascii=False, indent=2)
            print(f"  📁 {indication}: {len(subset)} 篇")
    
    # 统计
    print(f"\n📊 处理统计：")
    print(f"  总文章数: {len(articles)}")
    print(f"  适应症分布:")
    for ind in ["结直肠癌", "胃癌", "乳腺癌", "头颈肿瘤", "肝癌", "胰腺癌", "通用"]:
        count = sum(1 for a in articles if ind in a["indications"])
        if count > 0:
            print(f"    {ind}: {count} 篇")
    print(f"  总字数: {sum(a['word_count'] for a in articles):,}")

if __name__ == "__main__":
    main()
