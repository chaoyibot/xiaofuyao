#!/usr/bin/env python3
"""
【后台任务 #4】小福药 · 违规词过滤脚本
- 在内容展示前自动过滤违规词
- 替换为合规表述
- 输出过滤后的内容
"""

import os
import json
import re
import glob

OUTPUT_DIR = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\小程序项目\小福药"

# 违规词 → 合规替换
FORBIDDEN_REPLACEMENTS = {
    "100%有效": "在医生指导下规范使用，多数患者可获得较好疗效",
    "完全康复": "病情得到有效控制",
    "彻底治好": "获得良好疗效",
    "治愈": "病情缓解（请遵医嘱）",
    "根治": "控制病情进展",
    "特效": "有效",
    "祖传": "经典",
    "最好": "较好",
    "最强": "较强",
    "第一": "领先",
    "唯一": "之一",
    "药到病除": "按疗程服用可见疗效",
    "立竿见影": "在治疗周期内逐步起效",
    "一次见效": "持续治疗方可见效",
    "无毒副作用": "本品为化疗药物，需在医生指导下使用，可能有不良反应",
    "零风险": "存在一定不良反应风险，需在医生指导下使用",
    "安全无副作用": "本品为化疗药物，需在医生指导下使用",
    "没有任何副作用": "本品为化疗药物，可能引起不良反应",
}

def filter_text(text):
    """过滤文本中的违规词"""
    original = text
    replacements = []
    
    for forbidden, replacement in FORBIDDEN_REPLACEMENTS.items():
        if forbidden in text:
            text = text.replace(forbidden, replacement)
            replacements.append({
                "from": forbidden,
                "to": replacement,
            })
    
    return text, replacements

def filter_file(filepath):
    """过滤单个文件"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    filtered, replacements = filter_text(content)
    
    return {
        "original": content,
        "filtered": filtered,
        "replacements": replacements,
        "has_changes": len(replacements) > 0,
    }

def main():
    """主函数"""
    content_dir = os.path.join(OUTPUT_DIR, "content")
    
    # 找所有结构化 JSON
    json_files = glob.glob(os.path.join(content_dir, "**", "*.json"), recursive=True)
    print(f"🔍 找到 {len(json_files)} 个 JSON 文件")
    
    total_replaced = 0
    files_modified = 0
    
    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            if isinstance(data, list):
                # 文章列表
                for article in data:
                    if "title" in article:
                        new_title, _ = filter_text(article["title"])
                        if new_title != article["title"]:
                            article["title"] = new_title
                            total_replaced += 1
                    if "summary" in article:
                        new_sum, _ = filter_text(article["summary"])
                        if new_sum != article["summary"]:
                            article["summary"] = new_sum
                            total_replaced += 1
                    if "content_preview" in article:
                        new_prev, _ = filter_text(article["content_preview"])
                        if new_prev != article["content_preview"]:
                            article["content_preview"] = new_prev
                            total_replaced += 1
                files_modified += 1
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"  ❌ 处理失败: {json_file} - {e}")
    
    print(f"\n✅ 过滤完成")
    print(f"  修改文件: {files_modified}")
    print(f"  替换次数: {total_replaced}")
    print(f"  违规词库大小: {len(FORBIDDEN_REPLACEMENTS)}")
    
    # 保存违规词库供前端使用
    wordlist_path = os.path.join(OUTPUT_DIR, "compliance", "forbidden_words.json")
    with open(wordlist_path, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0",
            "replacements": FORBIDDEN_REPLACEMENTS,
            "forbidden_words": list(FORBIDDEN_REPLACEMENTS.keys()),
        }, f, ensure_ascii=False, indent=2)
    print(f"  违规词库: {wordlist_path}")

if __name__ == "__main__":
    main()
