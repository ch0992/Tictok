import os
import re
import json

def md_to_html(md_text):
    # Simple markdown to HTML converter to avoid external dependencies.
    html = md_text.strip()
    
    # 1. Escape basic HTML tags to prevent broken rendering, but allow some formatting
    # Standard replacement of < and > in code blocks is handled inside code block regex.
    
    # 2. Extract code blocks as placeholders to prevent them from being split by paragraph rules
    code_blocks = []
    def save_code_block(match):
        lang = match.group(1) or 'text'
        code = match.group(2).replace('<', '&lt;').replace('>', '&gt;')
        placeholder = f"<!--CODE_BLOCK_PLACEHOLDER_{len(code_blocks)}-->"
        code_blocks.append(f'<pre><code class="language-{lang}">{code}</code></pre>')
        return placeholder
        
    html = re.sub(r'```(\w*)\n(.*?)\n```', save_code_block, html, flags=re.DOTALL)
    
    # 3. Inline code: `code`
    html = re.sub(r'`([^`\n]+)`', r'<code>\1</code>', html)
    
    # 4. Horizontal rule: ---
    html = re.sub(r'\n---\n', r'\n<hr>\n', html)
    html = re.sub(r'^---\s*$', r'<hr>', html, flags=re.MULTILINE)
    
    # 4.5 Subheadings
    html = re.sub(r'^###\s+(.*)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^####\s+(.*)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    
    # 5. Bold: **text**
    html = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', html)
    
    # 6. Lists: - item or * item
    lines = html.split('\n')
    in_list = False
    new_lines = []
    for line in lines:
        m = re.match(r'^\s*[-*]\s+(.*)', line)
        if m:
            if not in_list:
                new_lines.append('<ul>')
                in_list = True
            new_lines.append(f'<li>{m.group(1)}</li>')
        else:
            if in_list:
                new_lines.append('</ul>')
                in_list = False
            new_lines.append(line)
    if in_list:
        new_lines.append('</ul>')
    html = '\n'.join(new_lines)
    
    # 7. Checkboxes
    html = html.replace('□', '<input type="checkbox" disabled>')
    html = html.replace('[ ]', '<input type="checkbox" disabled>')
    html = html.replace('[x]', '<input type="checkbox" checked disabled>')
    
    # 8. Paragraphs: split by double newlines and wrap in <p> if they don't start with block elements
    paragraphs = html.split('\n\n')
    new_paras = []
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        if (para.startswith('<!--CODE_BLOCK_PLACEHOLDER_') or para.startswith('<ul') or para.startswith('<hr') or 
            para.startswith('<h') or para.startswith('<ul>') or para.startswith('<ol>') or
            para.startswith('<div') or para.startswith('<!')):
            new_paras.append(para)
        else:
            # Replace single newlines with brs to preserve linebreaks in answers
            para_html = para.replace('\n', '<br>')
            new_paras.append(f'<p>{para_html}</p>')
            
    html = '\n\n'.join(new_paras)
    
    # 9. Restore code blocks from placeholders
    for idx, cb in enumerate(code_blocks):
        html = html.replace(f"<!--CODE_BLOCK_PLACEHOLDER_{idx}-->", cb)
        
    return html

def parse_markdown_file(file_path, base_dir):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Relative path from base_dir
    rel_path = os.path.relpath(file_path, base_dir)
    
    # Category detection
    category = "General"
    path_lower = rel_path.lower()
    if "behavioral" in path_lower or "day01" in path_lower:
        category = "Behavioral"
    elif "linux" in path_lower or "day02" in path_lower:
        category = "Linux"
    elif "networking" in path_lower:
        category = "Networking"
    elif "cloud" in path_lower:
        category = "Cloud"
    elif "kubernetes" in path_lower:
        category = "Kubernetes"
    elif "gpu" in path_lower:
        category = "GPU & AI Infrastructure"
    elif "coding" in path_lower:
        category = "Coding"
    elif "system-design" in path_lower:
        category = "System Design"
    
    # H1 Extraction
    title_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"
    
    # Clean only the FIRST H1 to parse sections
    if title_match:
        content_clean = content.replace(title_match.group(0), '', 1).strip()
    else:
        content_clean = content.strip()
    
    # Extract Metadata
    importance = None
    frequency = None
    probability = None
    status = "Studying"
    
    imp_match = re.search(r'###\s+Importance\s*\n+(★+☆*)', content_clean)
    if imp_match:
        importance = imp_match.group(1).strip()
        
    freq_match = re.search(r'###\s+Frequency\s*\n+(★+☆*)', content_clean)
    if freq_match:
        frequency = freq_match.group(1).strip()
        
    prob_match = re.search(r'###\s+Probability\s*\n+([^\n\-\#]+)', content_clean)
    if prob_match:
        probability = prob_match.group(1).strip()
        
    status_match = re.search(r'##\s+Status\s*\n+(\w+)', content_clean)
    if status_match:
        status = status_match.group(1).strip()
        
    # Extract Sections by H1 or H2 headers
    sections = []
    h_matches = list(re.finditer(r'^(?:#|##)\s+(.*)$', content_clean, re.MULTILINE))
    
    if h_matches:
        for i, match in enumerate(h_matches):
            section_title = match.group(1).strip()
            
            # Skip metadata and status headers
            if section_title in ["Importance", "Frequency", "Probability", "Status"]:
                continue
                
            start_pos = match.end()
            end_pos = h_matches[i+1].start() if i+1 < len(h_matches) else len(content_clean)
            
            section_content = content_clean[start_pos:end_pos].strip()
            section_html = md_to_html(section_content)
            
            sections.append({
                "title": section_title,
                "content": section_html
            })
    else:
        sections.append({
            "title": "General",
            "content": md_to_html(content_clean)
        })
        
    return {
        "id": os.path.splitext(os.path.basename(file_path))[0],
        "title": title,
        "category": category,
        "importance": importance,
        "frequency": frequency,
        "probability": probability,
        "status": status,
        "path": rel_path,
        "sections": sections
    }

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    study_data = []
    
    # Traverse docs folder for markdown files
    for root, dirs, files in os.walk(base_dir):
        # Skip hidden folders like .git or node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith('.md') and file != "README.md":
                file_path = os.path.join(root, file)
                try:
                    data = parse_markdown_file(file_path, base_dir)
                    study_data.append(data)
                except Exception as e:
                    print(f"Error parsing {file_path}: {e}")
                    
    # Generate data.js
    output_path = os.path.join(base_dir, "data.js")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("// Automatically generated by compile_study_app.py. Do not edit directly.\n")
        f.write("const STUDY_DATA = ")
        f.write(json.dumps(study_data, indent=2, ensure_ascii=False))
        f.write(";\n")
        
    print(f"Successfully compiled {len(study_data)} files into {output_path}")

if __name__ == "__main__":
    main()
