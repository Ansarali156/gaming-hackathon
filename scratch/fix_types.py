import re

with open('frontend/app/dashboard/admin/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace specific component props
content = content.replace('{ analytics, sponsors }: { analytics: any; sponsors: any[] }', '{ analytics, sponsors }: { analytics: Record<string, any>; sponsors: Record<string, any>[] }')
content = content.replace('}: { submissions: any[] }', '}: { submissions: Record<string, any>[] }')
content = content.replace('}: { announcements: any[] }', '}: { announcements: Record<string, any>[] }')
content = content.replace('}: { team: any;', '}: { team: Record<string, any>;')
content = content.replace('}: { drafts: any[] }', '}: { drafts: Record<string, any>[] }')

# Replace generic prop definitions
content = content.replace('}: any) {', '}: Record<string, any>) {')

# Replace map/filter callbacks
content = content.replace('(a: any)', '(a: Record<string, any>)')
content = content.replace('(team: any)', '(team: Record<string, any>)')
content = content.replace('(e: any)', '(e: string[])')
content = content.replace('(item: any,', '(item: Record<string, any>,')
content = content.replace('(d: any)', '(d: Record<string, any>)')
content = content.replace('(cat: any)', '(cat: Record<string, any>)')
content = content.replace('(sub: any)', '(sub: Record<string, any>)')
content = content.replace('(payment: any)', '(payment: Record<string, any>)')
content = content.replace('(ann: any)', '(ann: Record<string, any>)')
content = content.replace('(m: any,', '(m: Record<string, any>,')
content = content.replace('(m: any)', '(m: Record<string, any>)')
content = content.replace('(sp: any)', '(sp: Record<string, any>)')
content = content.replace('(inq: any)', '(inq: Record<string, any>)')
content = content.replace('(draft: any)', '(draft: Record<string, any>)')

with open('frontend/app/dashboard/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
