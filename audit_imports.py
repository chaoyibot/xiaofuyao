import os, re

ROOT = r"C:\Users\surface\Desktop\知识库\氟尿嘧啶\小程序项目\小福药\frontend\src"
vue_files = []
for root, dirs, files in os.walk(ROOT):
    for f in files:
        if f.endswith('.vue'):
            vue_files.append(os.path.join(root, f))

# 编译器宏，不需要 import
COMPILER_MACROS = {'defineProps', 'defineEmits', 'defineExpose', 'defineOptions', 'defineSlots', 'defineModel'}

# 真正需要 import 的运行时 API
RUNTIME_APIS = {'ref', 'reactive', 'computed', 'watch', 'watchEffect', 'onMounted', 'onUnmounted',
                'onBeforeMount', 'onBeforeUnmount', 'onUpdated', 'nextTick', 'toRefs', 'toRef', 'unref',
                'inject', 'provide'}

bug_files = []
for vf in vue_files:
    with open(vf, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'<script setup[^>]*>(.*?)</script>', content, re.DOTALL)
    if not m:
        continue
    setup_block = m.group(1)

    imports = re.findall(r"import\s*\{([^}]+)\}\s*from\s*['\"]vue['\"]", setup_block)
    imported_names = set()
    for imp in imports:
        for n in imp.split(','):
            imported_names.add(n.strip())

    used = set()
    for api in RUNTIME_APIS:
        code_no_import = re.sub(r"import\s*\{[^}]+\}\s*from\s*['\"]vue['\"]", '', setup_block)
        code_no_comment = re.sub(r"//.*", '', code_no_import)
        if re.search(r'\b' + api + r'\b', code_no_comment):
            used.add(api)

    missing = used - imported_names
    if missing:
        bug_files.append((vf, missing, imported_names))

print("=" * 80)
print("Scan: " + str(len(vue_files)) + " vue files")
print("Bug files: " + str(len(bug_files)))
print("=" * 80)
for vf, missing, imp in bug_files:
    rel = vf.replace(ROOT, "")
    print("\n[BUG] " + rel)
    print("  missing: " + str(missing))
    print("  imported: " + str(imp))
