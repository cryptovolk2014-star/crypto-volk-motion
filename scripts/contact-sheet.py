"""Build a labelled review sheet from native composition renders (requires Pillow)."""
import argparse,json,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
parser=argparse.ArgumentParser();parser.add_argument('--composition',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
config=json.loads((root/'compositions'/f'{args.composition}.json').read_text())
directory=root/config['previewDirectory'];items=config['previews']
font=ImageFont.truetype(str(root/'assets/fonts/RobotoMono.ttf'),18)
sets=[('contact-sheet',items,4)]
if args.composition=='scan-ai-emotion':sets.append(('dark-light-transition',[items[i] for i in [4,5,6]],3))
if args.composition=='scan-ai-oil':sets.append(('oil-to-analysis',[items[i] for i in [0,2,4,7,10,12]],3))
for name,selected,cols in sets:
    width,height,gap=270,480,24
    rows=math.ceil(len(selected)/cols)
    sheet=Image.new('RGB',(cols*(width+gap)+gap,rows*(height+62)+gap),'#050718')
    draw=ImageDraw.Draw(sheet)
    for i,item in enumerate(selected):
        x=gap+i%cols*(width+gap);y=gap+i//cols*(height+62)
        with Image.open(directory/(item['id']+'.png')) as frame:
            frame=frame.convert('RGB');frame.thumbnail((width,height));sheet.paste(frame,(x,y))
        draw.text((x,y+height+12),f"{item['id'].split('-')[0]} / {item['time']:.2f}s",font=font,fill='#F3EFE9')
    path=directory/(name+'.jpg');sheet.save(path,quality=93);print(path.relative_to(root))
