"""Fixed-layout PDF backup from the inspected slide renders, with demo links."""
from pathlib import Path
import os
from reportlab.pdfgen import canvas
from pypdf import PdfReader
root=Path(__file__).resolve().parent.parent
out=root/'outputs/pitch/RepRadar-Pitch-Public.pdf'
previews=root/'.build/public-release/previews'
url=os.environ.get('REPRADAR_DEMO_URL','http://localhost:3001')
c=canvas.Canvas(str(out),pagesize=(960,540));c.setTitle('RepRadar — UZH.ai Syngenta Challenge')
for n in range(1,18):
 c.drawImage(str(previews/f'slide-{n:02}.png'),0,0,width=960,height=540)
 if n==6:
  for x,y,w,h in [(930,275,280,56),(930,344,280,28)]:
   c.linkURL(url,(x*.75,540-(y+h)*.75,(x+w)*.75,540-y*.75),relative=0,thickness=0)
 c.showPage()
c.save()
r=PdfReader(out);assert len(r.pages)==17
links=[a.get_object()['/A']['/URI'] for a in r.pages[5]['/Annots']]
assert links==[url,url]
print('PDF backup: 17 pages, two clickable demo links.')
