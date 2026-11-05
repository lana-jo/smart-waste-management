import xml.etree.ElementTree as ET

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#16a34a"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold">♻</text>
</svg>'''

with open('/home/mrj/smart-waste-management/mobile-app/assets/icon.svg', 'w') as f:
    f.write(svg_content)

print('SVG icon written successfully.')
