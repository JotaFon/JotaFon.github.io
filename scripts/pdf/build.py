"""Build the two printable portfolio editions from localized content."""

import json
import math
import struct
import zlib
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'output/pdf'
TEMP = ROOT / 'tmp/pdfs'
CONTENT = json.loads((Path(__file__).with_name('content.json')).read_text())
WIDTH, HEIGHT = A4
MARGIN = 44
COLUMN = WIDTH - MARGIN * 2
INK = colors.HexColor('#202020')
MUTED = colors.HexColor('#555555')
PALE = colors.HexColor('#f4f4f4')
RULE = colors.HexColor('#c7c7c7')
CONTACTS = [
    ('emailLabel', 'jotaafon@gmail.com', 'mailto:jotaafon@gmail.com'),
    ('phoneLabel', '+55 (12) 99261-3420', 'https://wa.me/5512992613420'),
    ('githubLabel', 'github.com/JotaFon', 'https://github.com/JotaFon'),
    ('linkedinLabel', 'linkedin.com/in/jotafonseca', 'https://linkedin.com/in/jotafonseca'),
    ('siteLabel', 'jotafon.github.io', 'https://jotafon.github.io'),
]


def unpack_woff(source, target):
    data = source.read_bytes()
    signature, flavor, length, count = struct.unpack('>4sIIH', data[:14])
    search_range = 16 * 2 ** int(math.log2(count))
    header = struct.pack('>IHHHH', flavor, count, search_range, int(math.log2(count)), count * 16 - search_range)
    entries = []
    blocks = []
    offset = 12 + 16 * count

    assert signature == b'wOFF'
    for index in range(count):
        tag, start, compressed, original, checksum = struct.unpack('>4sIIII', data[44 + index * 20:64 + index * 20])
        block = data[start:start + compressed]

        if compressed < original:
            block = zlib.decompress(block)

        entries.append(struct.pack('>4sIII', tag, checksum, offset, original))
        padded = block + b'\0' * ((4 - len(block) % 4) % 4)

        blocks.append(padded)
        offset += len(padded)
    target.write_bytes(header + b''.join(entries) + b''.join(blocks))


def register_fonts():
    font_dir = TEMP / 'fonts'
    sources = {
        'Display': 'node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff',
        'Mono': 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff',
    }

    font_dir.mkdir(parents=True, exist_ok=True)
    for name, source in sources.items():
        target = font_dir / (name + '.ttf')

        unpack_woff(ROOT / source, target)
        pdfmetrics.registerFont(TTFont(name, str(target)))
    pdfmetrics.registerFont(TTFont('Body', '/System/Library/Fonts/Supplemental/Arial.ttf'))
    pdfmetrics.registerFont(TTFont('BodyBold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold')


class Portfolio:
    def __init__(self, locale):
        self.copy = CONTENT[locale]
        self.locale = locale
        self.path = OUTPUT / f'joao-victor-fonseca-portfolio-{locale}.pdf'
        self.pdf = canvas.Canvas(str(self.path), pagesize=A4, pageCompression=1, lang='pt-BR' if locale == 'pt' else 'en')
        self.pdf.setTitle(self.t('metaTitle'))
        self.pdf.setAuthor('João Victor Fonseca')
        self.pdf.setSubject(self.t('role'))
        self.pdf.setCreator('João Victor Fonseca - Portfolio')

    def t(self, key):

        return self.copy[key]

    def text(self, value, x, top, font='Body', size=10.5, color=INK, right=False):
        pdf = self.pdf

        pdf.setFillColor(color)
        pdf.setFont(font, size)
        if right:
            pdf.drawRightString(x, HEIGHT - top - size, value)
        else:
            pdf.drawString(x, HEIGHT - top - size, value)

    def paragraph(self, value, x, top, width, size=10.6, leading=15.6, color=INK, font='Body'):
        style = ParagraphStyle('body', fontName=font, fontSize=size, leading=leading, textColor=color, spaceAfter=0)
        paragraph = Paragraph(escape(value), style)
        _, height = paragraph.wrap(width, HEIGHT)

        paragraph.drawOn(self.pdf, x, HEIGHT - top - height)

        return top + height

    def line(self, top, x=MARGIN, width=COLUMN, color=RULE, thickness=.65):
        pdf = self.pdf

        pdf.setStrokeColor(color)
        pdf.setLineWidth(thickness)
        pdf.line(x, HEIGHT - top, x + width, HEIGHT - top)

    def box(self, x, top, width, height, fill=PALE, radius=12, stroke=INK, thickness=1):
        pdf = self.pdf

        pdf.setFillColor(fill)
        pdf.setStrokeColor(stroke)
        pdf.setLineWidth(thickness)
        pdf.roundRect(x, HEIGHT - top - height, width, height, radius, stroke=1, fill=1)

    def star(self, x, top, radius=8):
        pdf = self.pdf
        path = pdf.beginPath()
        points = [(x, top-radius), (x+radius*.24, top-radius*.24), (x+radius, top), (x+radius*.24, top+radius*.24), (x, top+radius), (x-radius*.24, top+radius*.24), (x-radius, top), (x-radius*.24, top-radius*.24)]

        path.moveTo(points[0][0], HEIGHT - points[0][1])
        for px, py in points[1:]:
            path.lineTo(px, HEIGHT - py)
        path.close()
        pdf.setFillColor(INK)
        pdf.drawPath(path, fill=1, stroke=0)

    def footer(self, page):
        self.line(795, color=INK)
        self.line(799, color=INK, thickness=.4)
        self.text('João Victor Fonseca', MARGIN, 810, size=8.2)
        self.text(self.t('footer'), WIDTH/2, 811, font='Mono', size=6.7)
        self.text(f'{page} / 2', WIDTH-MARGIN, 810, font='Mono', size=8, right=True)

    def page_one(self):
        pdf = self.pdf

        self.text(self.t('document'), MARGIN, 34, font='Mono', size=8)
        self.text(self.t('edition'), WIDTH-MARGIN, 34, font='Mono', size=8, right=True)
        self.line(55, color=INK, thickness=1.2)
        self.text(self.t('nameFirst'), MARGIN-2, 75, font='Display', size=49)
        self.text(self.t('nameLast'), MARGIN-2, 123, font='Display', size=49)
        self.text(self.t('role'), MARGIN, 183, font='BodyBold', size=14)
        self.paragraph(self.t('summary'), MARGIN, 217, COLUMN, size=11, leading=16.2)
        self.text(self.t('location'), MARGIN, 278, font='Mono', size=8.1)
        self.text(self.t('availability'), WIDTH-MARGIN, 278, font='Mono', size=8.1, right=True)
        self.line(307, color=INK)
        self.text(self.t('experience'), MARGIN, 327, font='Display', size=24)
        for index, job in enumerate(self.t('jobs')):
            top = [380, 520, 660][index]
            company, role, date, description, stack = (job[key] for key in ('company', 'role', 'date', 'description', 'stack'))

            self.text(company, MARGIN, top, font='BodyBold', size=12.5)
            self.text(date, WIDTH-MARGIN, top+2, font='Mono', size=7.7, right=True)
            self.text(role, MARGIN, top+22, size=10.6, color=MUTED)
            bottom = self.paragraph(description, MARGIN, top+45, COLUMN, size=10.5, leading=15)

            self.text(stack, MARGIN, bottom+10, font='Mono', size=7.6, color=MUTED)
            if index < 2:
                self.line(top+124)

        self.footer(1)
        pdf.showPage()

    def page_two(self):
        self.text(self.t('document'), MARGIN, 34, font='Mono', size=8)
        self.text(self.t('edition'), WIDTH-MARGIN, 34, font='Mono', size=8, right=True)
        self.line(55, color=INK, thickness=1.2)
        self.text(self.t('profile'), MARGIN, 76, font='Display', size=37)
        self.star(WIDTH-MARGIN-13, 99, radius=14)
        self.paragraph(self.t('profileIntro'), MARGIN, 127, COLUMN-25, size=11, leading=16)
        self.text(self.t('skills'), MARGIN, 175, font='BodyBold', size=14)
        card_width = (COLUMN - 24) / 3

        for index, group in enumerate(self.t('skillGroups')):
            x = MARGIN + index * (card_width + 12)
            title, items = (group[key] for key in ('title', 'items'))

            self.box(x, 204, card_width, 115, fill=PALE, radius=11, stroke=RULE, thickness=.7)
            self.text(title, x+14, 219, font='BodyBold', size=12)
            self.paragraph(items, x+14, 246, card_width-28, size=10.2, leading=15.5)
        self.text(self.t('creativeLabel'), MARGIN, 337, font='Mono', size=7.8)
        self.paragraph(self.t('creative'), MARGIN, 354, COLUMN, size=10.1, color=MUTED)
        self.line(389, color=INK)
        right_x = 330

        self.text(self.t('background'), MARGIN, 409, font='BodyBold', size=14)
        self.text(self.t('teachingRole'), MARGIN, 441, font='BodyBold', size=10.6)
        self.text(self.t('teachingSchool'), MARGIN, 459, size=10, color=MUTED)
        self.text(self.t('teachingDate'), MARGIN, 480, font='Mono', size=7.7, color=MUTED)
        self.paragraph(self.t('teachingDescription'), MARGIN, 504, 244, size=10.1, leading=15.2)
        self.text(self.t('education'), right_x, 409, font='BodyBold', size=14)
        bottom = self.paragraph(self.t('degree'), right_x, 442, 210, size=10.6, leading=14.3, font='BodyBold')

        self.text(self.t('university'), right_x, bottom+8, size=10)
        self.text(self.t('universityLocation'), right_x, bottom+24, size=9, color=MUTED)
        self.text(self.t('highSchool'), right_x, 525, font='BodyBold', size=10.6)
        self.text(self.t('highSchoolName'), right_x, 544, size=10)
        self.text(self.t('highSchoolLocation'), right_x, 560, size=9, color=MUTED)
        self.line(603)
        self.text(self.t('languages'), MARGIN, 622, font='BodyBold', size=12)
        for index, language in enumerate(self.t('languageList')):
            name, level = (language[key] for key in ('name', 'level'))
            x = 188 + index * 124

            self.text(name, x, 621, size=10.2)
            self.text(level, x, 640, font='Mono', size=8, color=MUTED)
        self.box(MARGIN, 684, COLUMN, 91, fill=colors.white, radius=12)
        for index, (label, display, url) in enumerate(CONTACTS):
            column, row = index % 3, index // 3
            x, top = MARGIN + 15 + column * 164, 697 + row * 36

            self.text(self.t(label), x, top, font='Mono', size=6.6, color=MUTED)
            self.text(display, x, top+12, size=8.5)
            self.pdf.linkURL(url, (x, HEIGHT-top-25, x+153, HEIGHT-top), relative=0, thickness=0)
        self.text(self.t('contactNote'), MARGIN+343, 749, font='Mono', size=6.8, color=MUTED)
        self.footer(2)
        self.pdf.showPage()

    def build(self):
        self.page_one()
        self.page_two()
        self.pdf.save()
        print(self.path)


OUTPUT.mkdir(parents=True, exist_ok=True)
register_fonts()
for locale in CONTENT:
    Portfolio(locale).build()
