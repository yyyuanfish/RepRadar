"""Attach standard OOXML website hyperlinks to the authored demo buttons."""
import sys,zipfile,xml.etree.ElementTree as ET
src,dst,url=sys.argv[1:]
if not url.startswith(('http://','https://')):raise ValueError('Demo URL must be HTTP(S).')
P='http://schemas.openxmlformats.org/presentationml/2006/main'
A='http://schemas.openxmlformats.org/drawingml/2006/main'
R='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
PKG='http://schemas.openxmlformats.org/package/2006/relationships'
for prefix,ns in [('p',P),('a',A),('r',R)]:ET.register_namespace(prefix,ns)
with zipfile.ZipFile(src) as zin:
 files={n:zin.read(n) for n in zin.namelist()}
name='ppt/slides/slide6.xml';relsname='ppt/slides/_rels/slide6.xml.rels'
slide=ET.fromstring(files[name]);rels=ET.fromstring(files[relsname]);rid='rIdRepRadarDemo'
ET.SubElement(rels,f'{{{PKG}}}Relationship',Id=rid,Type=f'{R}/hyperlink',Target=url,TargetMode='External')
count=0
for pr in slide.iter(f'{{{P}}}cNvPr'):
 if pr.get('name') in ('live-demo-button','live-demo-address'):
  ET.SubElement(pr,f'{{{A}}}hlinkClick',{f'{{{R}}}id':rid,'tooltip':'Open the RepRadar live demo in your browser'});count+=1
if count!=2:raise RuntimeError(f'Expected two demo targets, found {count}')
files[name]=ET.tostring(slide,encoding='utf-8',xml_declaration=True)
files[relsname]=ET.tostring(rels,encoding='utf-8',xml_declaration=True)
with zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED) as out:
 for n,b in files.items():out.writestr(n,b)
print('Added two demo links:',url)
