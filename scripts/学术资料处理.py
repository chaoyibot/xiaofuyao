#!/usr/bin/env python3
"""
【后台任务 #2】小福药 · 224KB 学术资料处理脚本
- 读取 02_学术文献/研究论文/氟尿嘧啶口服乳学术汇总4.txt
- 提取：研究主题、研究者、发表年份、结论、关键词
- 输出：结构化 JSON + 知识库（供学术培训模块使用）
"""

import os
import re
import json

SOURCE_FILE = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\02_学术文献\研究论文\氟尿嘧啶口服乳学术汇总4.txt"
OUTPUT_DIR = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\小程序项目\小福药\content\学术资料"

# 关键研究主题
RESEARCH_THEMES = {
    "药代动力学": ["药代动力学", "生物利用度", "血药浓度", "代谢", "吸收"],
    "临床疗效": ["疗效", "有效率", "缓解率", "生存率", "中位生存"],
    "安全性": ["不良反应", "安全性", "毒性", "副作用", "耐受性"],
    "适应症": ["适应症", "结直肠", "胃癌", "乳腺癌", "头颈"],
    "联合用药": ["联合", "FOLFOX", "FOLFIRI", "XELOX"],
    "乳剂优势": ["乳剂", "口服", "缓释", "持续释放"],
    "依从性": ["依从性", "生活质量", "满意度"],
}

def detect_themes(text):
    """检测研究主题"""
    found = []
    for theme, keywords in RESEARCH_THEMES.items():
        if any(kw in text for kw in keywords):
            found.append(theme)
    return found if found else ["综合"]

def extract_sections(text):
    """按章节切分文本"""
    sections = re.split(r"\n(?=[\d一二三四五六七八九十]+[、.]?\s*[【（]?[\u4e00-\u9fa5])", text)
    return [s.strip() for s in sections if len(s.strip()) > 100]

def process_academic():
    """处理学术资料"""
    if not os.path.exists(SOURCE_FILE):
        print(f"❌ 源文件不存在: {SOURCE_FILE}")
        return
    
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        text = f.read()
    
    print(f"📖 学术汇总原文：{len(text):,} 字符")
    
    # 切分章节
    sections = extract_sections(text)
    print(f"📑 切分章节：{len(sections)} 个")
    
    # 检测主题
    themes = detect_themes(text)
    print(f"🏷️ 主题分类：{', '.join(themes)}")
    
    # 构建知识库
    knowledge_base = {
        "meta": {
            "title": "氟尿嘧啶口服乳学术研究汇总",
            "source": "学术汇总4.txt",
            "total_chars": len(text),
            "total_sections": len(sections),
            "themes": themes,
        },
        "sections": [],
        "key_findings": [],
        "clinical_data": [],
        "safety_profile": [],
    }
    
    # 处理每个章节
    for i, section in enumerate(sections, 1):
        # 提取章节标题（第一行）
        lines = section.split("\n", 1)
        title = lines[0].strip()[:50] if lines else f"章节{i}"
        body = lines[1].strip() if len(lines) > 1 else section
        
        section_data = {
            "id": i,
            "title": title,
            "summary": body[:300] + ("..." if len(body) > 300 else ""),
            "themes": detect_themes(body),
            "word_count": len(body),
        }
        knowledge_base["sections"].append(section_data)
    
    # 提取关键数据点（用正则）
    data_patterns = [
        (r"(\d+(?:\.\d+)?)\s*%[^，。]{0,30}(有效率|缓解率|生存率|控制率)", "疗效数据"),
        (r"(\d+)\s*例[^，。]{0,30}(患者|病例|入组)", "样本量"),
        (r"(\d+(?:\.\d+)?)\s*mg[^，。]{0,30}/m[²²]", "剂量数据"),
        (r"(\d+(?:\.\d+)?)\s*月[^，。]{0,30}(中位生存|生存期|PFS|OS)", "生存数据"),
    ]
    for pattern, label in data_patterns:
        matches = re.findall(pattern, text)
        for m in matches[:5]:  # 每个类型最多 5 个
            knowledge_base["key_findings"].append({
                "type": label,
                "value": m[0],
                "context": m[1],
            })
    
    # 输出
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 完整知识库
    kb_file = os.path.join(OUTPUT_DIR, "academic_kb.json")
    with open(kb_file, "w", encoding="utf-8") as f:
        json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
    print(f"✅ 知识库入库: {kb_file}")
    
    # 主题分类
    for theme in themes + ["综合"]:
        subset = [s for s in knowledge_base["sections"] if theme in s["themes"] or theme == "综合"]
        if subset:
            theme_file = os.path.join(OUTPUT_DIR, f"theme_{theme}.json")
            with open(theme_file, "w", encoding="utf-8") as f:
                json.dump(subset, f, ensure_ascii=False, indent=2)
            print(f"  📚 {theme}: {len(subset)} 个章节")
    
    # 关键发现
    findings_file = os.path.join(OUTPUT_DIR, "key_findings.json")
    with open(findings_file, "w", encoding="utf-8") as f:
        json.dump(knowledge_base["key_findings"], f, ensure_ascii=False, indent=2)
    print(f"🔍 关键发现: {len(knowledge_base['key_findings'])} 条 → {findings_file}")
    
    # 生成 Markdown 摘要（供人工 review）
    md_file = os.path.join(OUTPUT_DIR, "学术资料摘要.md")
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(f"# 氟尿嘧啶口服乳学术资料摘要\n\n")
        f.write(f"> 源文件：{os.path.basename(SOURCE_FILE)} ({len(text):,} 字符)\n\n")
        f.write(f"## 主题分类\n\n")
        for t in themes:
            f.write(f"- **{t}**\n")
        f.write(f"\n## 章节列表（{len(knowledge_base['sections'])} 个）\n\n")
        for s in knowledge_base["sections"][:20]:
            f.write(f"### {s['id']}. {s['title']}\n")
            f.write(f"> {s['summary']}\n\n")
        f.write(f"\n## 关键数据点\n\n")
        for kf in knowledge_base["key_findings"][:20]:
            f.write(f"- **[{kf['type']}]** {kf['value']} - {kf['context']}\n")
    print(f"📝 Markdown 摘要: {md_file}")
    print(f"\n🎉 学术资料处理完成！")

if __name__ == "__main__":
    process_academic()
