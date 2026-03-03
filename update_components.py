import os
import re

components_dir = "src/components"
files = ["status-badge.ts", "value-display.ts", "detail-status.ts", "warning-chips.ts", "slider-control.ts", "quick-actions.ts"]

for file in files:
    path = os.path.join(components_dir, file)
    with open(path, "r") as f:
        content = f.read()

    # Find the tag name from @customElement('tag-name')
    match = re.search(r"@customElement\('([^']+)'\)", content)
    if not match:
        print(f"Skipping {file}: no @customElement found")
        continue

    tag_name = match.group(1)
    new_tag_name = f"vpc-{tag_name}"

    # Find the class name
    class_match = re.search(r"export class ([A-Za-z0-9_]+) extends LitElement", content)
    class_name = class_match.group(1) if class_match else None

    if not class_name:
        print(f"Skipping {file}: no class name found")
        continue

    # Remove @customElement decorator
    content = re.sub(r"@customElement\('[^']+'\)\s*\n", "", content)

    # Check if customElement is imported from lit/decorators.js
    if "customElement," in content:
        content = content.replace("customElement, ", "")
    elif ", customElement" in content:
        content = content.replace(", customElement", "")

    # Replace HTMLElementTagNameMap tag
    content = content.replace(f"'{tag_name}': {class_name};", f"'{new_tag_name}': {class_name};")

    # Add customElements.define at the end
    registration = f"\n\nif (!customElements.get('{new_tag_name}')) {{\n  customElements.define('{new_tag_name}', {class_name});\n}}\n"
    content += registration

    with open(path, "w") as f:
        f.write(content)

    print(f"Updated {file}: replaced {tag_name} with {new_tag_name} and added explicit registration.")
