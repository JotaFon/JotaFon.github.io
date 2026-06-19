import os
from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PT = OUTPUT_DIR / "joao-victor-fonseca-portfolio-pt.pdf"
OUTPUT_EN = OUTPUT_DIR / "joao-victor-fonseca-portfolio-en.pdf"
OUTPUT_LEGACY = OUTPUT_DIR / "joao-victor-fonseca-portfolio.pdf"
FONT_PATH = Path("/Users/jota/Library/Fonts/Inter-VariableFont_opsz,wght.ttf")
PAGE_W, PAGE_H = A4
MARGIN = 42

PALETTE = {
    "primary_bg": "#05070b",
    "top_band": "#080c13",
    "footer_band": "#070b11",
    "secondary_bg": "#0c1220",
    "card_bg": "#111827",
    "card_hover": "#182235",
    "item_bg": "#0f1724",
    "gold": "#d4af37",
    "gold_dark": "#9f7a18",
    "gold_light": "#f7e7a6",
    "text": "#ffffff",
    "text_secondary": "#edf2f7",
    "muted": "#a7b3c5",
    "border": "#334155",
    "grid": "#1e293b",
}

LINKS = {
    "email": "mailto:jotaafon@gmail.com",
    "phone": "tel:+5512992613420",
    "linkedin": "https://linkedin.com/in/jotafonseca",
    "github": "https://github.com/JotaFon",
    "site": "https://jotafon.github.io/",
}

CONTENT = {
    "pt": {
        "badge": "DISPONÍVEL PARA OPORTUNIDADES",
        "role": "Desenvolvedor Full Stack",
        "location": "Londrina - PR, Brasil",
        "cover_summary":
            "Desenvolvedor Full Stack com atuação em front-end, back-end e mobile, construindo soluções digitais claras, sustentáveis e conectadas ao negócio.",
        "stats": [
            ("2+ anos", "de experiência profissional"),
            ("Full Stack", "TypeScript, AdonisJS, React"),
            ("Remoto", "aberto a oportunidades"),
        ],
        "profile_title": "Perfil Técnico",
        "summary_label": "Resumo",
        "summary": [
            "Atuo em front-end, back-end e mobile, transformando necessidades operacionais em produtos digitais claros e fáceis de manter.",
            "Minha stack atual inclui TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite, React Native e Flutter.",
            "A base anterior em pintura digital ajuda a conectar clareza visual, comunicação e atenção aos detalhes.",
        ],
        "skills_label": "Competências",
        "skill_sections": [
            ("Front-end", ["JavaScript", "TypeScript", "React", "Next.js", "Redux", "Vite", "HTML5", "CSS3"]),
            ("Back-end", ["AdonisJS", "Nest.js", "Node.js", "PostgreSQL"]),
            ("Mobile", ["React Native", "Flutter"]),
        ],
        "languages_label": "Idiomas",
        "languages": [("Português", "Nativo"), ("Inglês", "B2"), ("Alemão", "A2")],
        "differentials_label": "Diferenciais",
        "differentials": [
            "Experiência em produtos internos e fluxos operacionais reais.",
            "Olhar visual vindo da pintura digital, aplicado a interface, clareza e detalhe.",
        ],
        "experience_title": "Experiência Profissional",
        "experience_subtitle": "Trajetória em desenvolvimento web, mobile e produtos de operação.",
        "experience": [
            {
                "title": "Desenvolvedor Full Stack",
                "company": "Carga Online - Londrina, PR",
                "period": "Mar 2026 - Presente",
                "bullets": [
                    "Desenvolvimento front-end, back-end e mobile de uma aplicação para gerenciamento de frotas, caminhões e caminhoneiros.",
                    "Atuação com TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite e React Native em fluxos web e mobile.",
                    "Entrega de recursos com foco em manutenção, clareza operacional e integração entre produto e regras de negócio.",
                ],
            },
            {
                "title": "Desenvolvedor Front-end Junior",
                "company": "X-Brain Desenvolvimento de Sistemas - Londrina, PR",
                "period": "Abr 2025 - Fev 2026",
                "bullets": [
                    "Atuação no front-end do sistema de vendas da Claro com React, JavaScript e Redux.",
                    "Transformação de regras de negócio e requisitos em interfaces responsivas, consistentes e usáveis.",
                    "Colaboração com o time em entregas iterativas, revisões e manutenção de fluxos de produto.",
                ],
            },
            {
                "title": "Estagiário de Desenvolvimento Web",
                "company": "X-Brain Desenvolvimento de Sistemas - Londrina, PR",
                "period": "Ago 2024 - Mar 2025",
                "bullets": [
                    "Início profissional em desenvolvimento, apoiando o front-end do sistema de vendas da Claro.",
                    "Participação em rotina real de projeto, revisão de código e aprendizado aplicado com React, JavaScript e Redux.",
                ],
            },
        ],
        "complementary_title": "Experiência Complementar",
        "complementary_subtitle": "Vivência anterior que fortalece comunicação, autonomia e leitura visual de produto.",
        "complementary": [
            {
                "title": "Professor de Pintura Digital",
                "company": "Escola Imago - Taubaté, SP",
                "period": "Fev 2021 - Nov 2021",
                "bullets": [
                    "Ensino de fundamentos visuais e processo criativo, reforçando didática, feedback e clareza de comunicação.",
                    "Experiência criativa que ainda influencia a atenção a interface, hierarquia visual e detalhes.",
                ],
            },
        ],
        "education_label": "Formação",
        "education": [
            ("Análise e Desenvolvimento de Sistemas", "Universidade Positivo - Londrina, PR", "Formação base em lógica, desenvolvimento web, bancos de dados e projetos de software."),
            ("Ensino Médio", "Universidade de Taubaté - Taubaté, SP", ""),
        ],
        "contact_label": "Contato",
        "phone_label": "Telefone",
        "footer_note": "Portfólio PDF - 2026",
        "meta_title": "Portfólio Profissional - João Victor Fonseca",
        "meta_subject": "Portfólio profissional de João Victor Fonseca",
    },
    "en": {
        "badge": "OPEN TO OPPORTUNITIES",
        "role": "Full Stack Developer",
        "location": "Londrina - PR, Brazil",
        "cover_summary":
            "Full Stack Developer working across front-end, back-end and mobile, building clear, maintainable digital products connected to business needs.",
        "stats": [
            ("2+ years", "of professional experience"),
            ("Full Stack", "TypeScript, AdonisJS, React"),
            ("Remote", "open to opportunities"),
        ],
        "profile_title": "Technical Profile",
        "summary_label": "Summary",
        "summary": [
            "I work across front-end, back-end and mobile, turning operational needs into clear and maintainable digital products.",
            "My current stack includes TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite, React Native and Flutter.",
            "My background in digital painting helps me connect visual clarity, communication and attention to detail.",
        ],
        "skills_label": "Skills",
        "skill_sections": [
            ("Front-end", ["JavaScript", "TypeScript", "React", "Next.js", "Redux", "Vite", "HTML5", "CSS3"]),
            ("Back-end", ["AdonisJS", "Nest.js", "Node.js", "PostgreSQL"]),
            ("Mobile", ["React Native", "Flutter"]),
        ],
        "languages_label": "Languages",
        "languages": [("Portuguese", "Native"), ("English", "B2"), ("German", "A2")],
        "differentials_label": "Strengths",
        "differentials": [
            "Experience with internal products and real operational workflows.",
            "Visual background from digital painting, applied to interface clarity and details.",
        ],
        "experience_title": "Professional Experience",
        "experience_subtitle": "Experience in web, mobile and operational products.",
        "experience": [
            {
                "title": "Full Stack Developer",
                "company": "Carga Online - Londrina, PR",
                "period": "Mar 2026 - Present",
                "bullets": [
                    "Front-end, back-end and mobile development for an application that manages fleets, trucks and drivers.",
                    "Work with TypeScript, AdonisJS, PostgreSQL, React, Redux, Vite and React Native across web and mobile flows.",
                    "Delivery of features focused on maintainability, operational clarity and business-rule integration.",
                ],
            },
            {
                "title": "Junior Front-end Developer",
                "company": "X-Brain Desenvolvimento de Sistemas - Londrina, PR",
                "period": "Apr 2025 - Feb 2026",
                "bullets": [
                    "Front-end work on Claro's sales system using React, JavaScript and Redux.",
                    "Translation of business rules and requirements into responsive, consistent and usable interfaces.",
                    "Collaboration with the team on iterative delivery, code review and product-flow maintenance.",
                ],
            },
            {
                "title": "Web Development Intern",
                "company": "X-Brain Desenvolvimento de Sistemas - Londrina, PR",
                "period": "Aug 2024 - Mar 2025",
                "bullets": [
                    "Professional start in development, supporting the front-end of Claro's sales system.",
                    "Participation in real project routines, code review and applied learning with React, JavaScript and Redux.",
                ],
            },
        ],
        "complementary_title": "Complementary Experience",
        "complementary_subtitle": "Earlier experience that strengthens communication, autonomy and visual product understanding.",
        "complementary": [
            {
                "title": "Digital Painting Teacher",
                "company": "Escola Imago - Taubaté, SP",
                "period": "Feb 2021 - Nov 2021",
                "bullets": [
                    "Teaching visual fundamentals and creative process, strengthening didactics, feedback and communication clarity.",
                    "Creative experience that still influences attention to interface hierarchy, visual clarity and details.",
                ],
            },
        ],
        "education_label": "Education",
        "education": [
            ("Systems Analysis and Development", "Universidade Positivo - Londrina, PR", "Foundation in logic, web development, databases and software projects."),
            ("High School", "Universidade de Taubaté - Taubaté, SP", ""),
        ],
        "contact_label": "Contact",
        "phone_label": "Phone",
        "footer_note": "Portfolio PDF - 2026",
        "meta_title": "Professional Portfolio - João Victor Fonseca",
        "meta_subject": "Professional portfolio of João Victor Fonseca",
    },
}


def color(name, alpha=1):
    value = PALETTE[name]
    base = colors.HexColor(value)

    if alpha < 1:
        base = colors.Color(base.red, base.green, base.blue, alpha=alpha)

    return base


def register_fonts():
    if FONT_PATH.exists():
        pdfmetrics.registerFont(TTFont("Inter", str(FONT_PATH)))

        return "Inter", "Helvetica-Bold"

    return "Helvetica", "Helvetica-Bold"


BODY_FONT, HEADING_FONT = register_fonts()


def text_width(text, font, size):
    return pdfmetrics.stringWidth(text, font, size)


def wrap_lines(text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""

    for word in words:
        next_line = f"{current} {word}".strip()

        if text_width(next_line, font, size) <= max_width:
            current = next_line
        else:
            if current:
                lines.append(current)

            current = word

    if current:
        lines.append(current)

    return lines


def add_link(c, url, x, y, width, height):
    c.linkURL(url, (x, y, x + width, y + height), relative=0, thickness=0)


def draw_wrapped(c, text, x, y, max_width, font=BODY_FONT, size=10, fill=None, leading=None):
    if fill is None:
        fill = color("text_secondary")

    if leading is None:
        leading = size * 1.5

    c.setFont(font, size)
    c.setFillColor(fill)

    for line in wrap_lines(text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading

    return y


def draw_link_text(c, label, url, x, y, font=BODY_FONT, size=9.5, fill=None):
    if fill is None:
        fill = color("text_secondary")

    c.setFont(font, size)
    c.setFillColor(fill)
    c.drawString(x, y, label)
    add_link(c, url, x, y - 2, text_width(label, font, size), size + 5)

    return y


def draw_strong_text(c, text, x, y, size, fill, font=HEADING_FONT, stroke_width=0.18):
    text_object = c.beginText(x, y)
    text_object.setFont(font, size)
    text_object.setFillColor(fill)
    text_object.setTextRenderMode(2)
    text_object.textLine(text)
    c.saveState()
    c.setStrokeColor(fill)
    c.setLineWidth(stroke_width)
    c.drawText(text_object)
    c.restoreState()


def draw_background(c, page_number):
    c.setFillColor(color("primary_bg"))
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(color("top_band"))
    c.rect(0, PAGE_H - 118, PAGE_W, 118, fill=1, stroke=0)
    c.setFillColor(color("footer_band"))
    c.rect(0, 0, PAGE_W, 72, fill=1, stroke=0)
    c.setFillColor(color("gold_dark", 0.72))
    c.rect(0, 0, 8, PAGE_H, fill=1, stroke=0)
    c.setFillColor(color("gold", 0.75))
    c.rect(8, PAGE_H - 10, PAGE_W - 8, 2, fill=1, stroke=0)
    c.saveState()
    c.setStrokeColor(color("grid", 0.38))
    c.setLineWidth(0.28)

    for x in range(34, int(PAGE_W) + 1, 42):
        c.line(x, 72, x, PAGE_H - 12)

    for y in range(92, int(PAGE_H) - 12, 42):
        c.line(8, y, PAGE_W, y)

    c.restoreState()
    c.setStrokeColor(color("gold", 0.36))
    c.setLineWidth(0.9)
    c.line(MARGIN, 34, PAGE_W - MARGIN, 34)
    c.setFont(BODY_FONT, 8)
    c.setFillColor(color("muted"))
    c.drawString(MARGIN, 18, "João Victor Fonseca")
    c.drawRightString(PAGE_W - MARGIN, 18, f"{page_number:02d}")


def draw_badge(c, text, x, y, width=None):
    font_size = 8.5
    c.setFont(HEADING_FONT, font_size)

    if width is None:
        width = text_width(text, HEADING_FONT, font_size) + 32

    c.saveState()
    c.setFillColor(color("secondary_bg"))
    c.setStrokeColor(color("gold"))

    rect_bottom = y - 20
    rect_h = 24

    c.roundRect(x, rect_bottom, width, rect_h, rect_h / 2.0, fill=1, stroke=1)

    text_y = rect_bottom + (rect_h / 2.0) - (font_size * 0.3)

    c.setFillColor(color("gold_light"))
    c.drawCentredString(x + (width / 2.0), text_y, text)
    c.restoreState()

    return width


def draw_card(c, x, y, w, h, fill_name="card_bg", stroke_name="border", alpha=1, radius=10):
    c.saveState()
    c.setFillColor(color(fill_name, alpha))
    c.setStrokeColor(color(stroke_name, 0.95))
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    c.restoreState()


def draw_title(c, title, x, y, size=31):
    draw_strong_text(c, title, x, y, size, color("gold"), stroke_width=0.22)


def draw_small_label(c, label, x, y):
    c.setFont(HEADING_FONT, 8.2)
    c.setFillColor(color("gold"))
    c.drawString(x, y, label.upper())


def draw_chip(c, text, x, y, width, has_icon, icon_path, fill_name="item_bg"):
    c.saveState()
    c.setFillColor(color(fill_name))
    c.setStrokeColor(color("gold", 0.58))
    c.setLineWidth(0.8)

    rect_bottom = y - 16
    rect_h = 22
    c.roundRect(x, rect_bottom, width, rect_h, 6, fill=1, stroke=1)

    current_x = x + 10

    center_y = rect_bottom + (rect_h / 2.0)

    if has_icon:
        try:
            c.drawImage(icon_path, current_x, center_y - 6, width=12, height=12, mask='auto')
            current_x += 18
        except Exception:
            c.setFillColor(color("gold"))
            c.circle(current_x + 3, center_y, 2.5, fill=1, stroke=0)
            current_x += 10
    else:
        c.setFillColor(color("gold"))
        c.circle(current_x + 3, center_y, 2.5, fill=1, stroke=0)
        current_x += 10

    c.setFont(BODY_FONT, 8.5)
    c.setFillColor(color("gold_light"))
    c.drawString(current_x, center_y - (8.5 * 0.3), text)
    c.restoreState()

    return width


def draw_chip_group(c, items, x, y, max_width, gap=8):
    current_x = x
    current_y = y
    row_gap = 30

    icons_dir = ROOT / "assets" / "icons"
    if not icons_dir.exists():
        try:
            icons_dir.mkdir(parents=True, exist_ok=True)
        except Exception:
            pass

    for item in items:
        icon_name = item.lower().replace(" ", "_").replace(".", "") + ".png"
        icon_path = icons_dir / icon_name
        has_icon = icon_path.exists()

        content_width = text_width(item, BODY_FONT, 8.5)
        width = content_width + 20

        if has_icon:
            width += 18
        else:
            width += 10

        if current_x + width > x + max_width:
            current_x = x
            current_y -= row_gap

        used = draw_chip(c, item, current_x, current_y, width, has_icon, str(icon_path))
        current_x += used + gap

    return current_y - 16


def draw_bullet(c, text, x, y, max_width, size=9.2):
    c.saveState()
    c.setFillColor(color("gold"))
    c.circle(x + 3, y + (size * 0.35), 2.2, fill=1, stroke=0)
    c.restoreState()

    return draw_wrapped(c, text, x + 14, y, max_width - 14, size=size, leading=size * 1.5)


def draw_stat(c, x, y, w, value, label):
    draw_card(c, x, y, w, 66, "card_bg", radius=8)

    c.saveState()
    c.setFillColor(color("gold", 0.6))
    c.roundRect(x + 12, y + 56, 16, 2, 1, fill=1, stroke=0)
    c.restoreState()

    c.setFont(HEADING_FONT, 14)
    c.setFillColor(color("text"))
    c.drawCentredString(x + w / 2, y + 36, value)
    c.setFont(BODY_FONT, 8.5)
    c.setFillColor(color("muted"))

    for index, line in enumerate(wrap_lines(label, BODY_FONT, 8.5, w - 24)):
        c.drawCentredString(x + w / 2, y + 20 - index * 11, line)


def draw_timeline_item(c, x, y, w, title, company, period, bullets, compact=False):
    base_height = 98 if compact else 130
    bullet_extra = max(0, len(bullets) - 1) * 23
    h = base_height + bullet_extra
    draw_card(c, x, y - h, w, h, "card_bg")

    c.saveState()
    c.setFillColor(color("gold"))
    c.circle(x + 17, y - 24, 4.0, fill=1, stroke=0)
    c.setStrokeColor(color("gold", 0.5))
    c.setLineWidth(1.0)
    c.setDash([2, 4], 0)
    c.line(x + 17, y - 29, x + 17, y - h + 18)
    c.restoreState()

    c.setFont(HEADING_FONT, 13)
    c.setFillColor(color("text"))
    c.drawString(x + 34, y - 27, title)
    c.setFont(HEADING_FONT, 9.5)
    c.setFillColor(color("gold"))
    c.drawString(x + 34, y - 43, company)
    c.setFont(BODY_FONT, 8.4)
    c.setFillColor(color("muted"))
    c.drawRightString(x + w - 16, y - 27, period)

    bullet_y = y - 66
    for bullet in bullets:
        bullet_y = draw_bullet(c, bullet, x + 34, bullet_y, w - 54, 8.6) - 4

    return y - h - 14


def draw_contact_line(c, label, value, link_key, x, y):
    c.setFont(HEADING_FONT, 8.5)
    c.setFillColor(color("gold"))
    c.drawString(x, y, label)
    draw_link_text(c, value, LINKS[link_key], x, y - 14, size=9.2)

    return y - 36


def cover_page(c, content):
    draw_background(c, 1)
    draw_badge(c, content["badge"], MARGIN, PAGE_H - 82)
    draw_strong_text(c, "João Victor", MARGIN, PAGE_H - 154, 48, color("text"), stroke_width=0.16)
    draw_strong_text(c, "Fonseca", MARGIN, PAGE_H - 207, 48, color("text"), stroke_width=0.16)
    draw_strong_text(c, content["role"], MARGIN, PAGE_H - 242, 20, color("gold"), stroke_width=0.1)
    c.setFont(BODY_FONT, 11)
    c.setFillColor(color("muted"))
    c.drawString(MARGIN, PAGE_H - 266, content["location"])
    draw_wrapped(c, content["cover_summary"], MARGIN, PAGE_H - 315, 420, size=11.5, leading=17.5)

    stat_w = 152
    for index, (value, label) in enumerate(content["stats"]):
        draw_stat(c, MARGIN + (stat_w + 16) * index, PAGE_H - 435, stat_w, value, label)

    draw_card(c, MARGIN, 132, PAGE_W - MARGIN * 2, 135, "secondary_bg")
    draw_small_label(c, content["contact_label"], MARGIN + 22, 234)
    c.setFont(HEADING_FONT, 14)
    draw_link_text(c, "jotaafon@gmail.com", LINKS["email"], MARGIN + 22, 210, font=HEADING_FONT, size=14, fill=color("text"))
    draw_link_text(c, "linkedin.com/in/jotafonseca", LINKS["linkedin"], MARGIN + 22, 188, size=10)
    draw_link_text(c, "github.com/JotaFon", LINKS["github"], MARGIN + 22, 170, size=10)
    draw_link_text(c, "jotafon.github.io", LINKS["site"], MARGIN + 22, 152, size=10)

    c.setFont(BODY_FONT, 10)
    c.setFillColor(color("text_secondary"))
    phone_width = text_width("+55 (12) 99261-3420", BODY_FONT, 10)
    phone_x = PAGE_W - MARGIN - 22 - phone_width
    draw_link_text(c, "+55 (12) 99261-3420", LINKS["phone"], phone_x, 188, size=10)
    c.drawRightString(PAGE_W - MARGIN - 22, 170, content["footer_note"])
    c.showPage()


def profile_page(c, content):
    draw_background(c, 2)
    draw_title(c, content["profile_title"], MARGIN, PAGE_H - 78)

    left_w = 290
    col_gap = 24
    right_x = MARGIN + left_w + col_gap
    right_w = PAGE_W - right_x - MARGIN

    top_y = PAGE_H - 116

    resumo_h = 230
    idiomas_h = 210

    resumo_y = top_y - resumo_h
    idiomas_y = resumo_y - 24 - idiomas_h

    comp_h = top_y - idiomas_y
    comp_y = idiomas_y

    dif_h = 140
    dif_y = idiomas_y - 24 - dif_h

    # 1. CARD DE RESUMO
    draw_card(c, MARGIN, resumo_y, left_w, resumo_h, "card_bg")
    draw_small_label(c, content["summary_label"], MARGIN + 18, top_y - 26)

    y = top_y - 50
    for paragraph in content["summary"]:
        y = draw_wrapped(c, paragraph, MARGIN + 18, y, left_w - 36, size=9.8, leading=15.0) - 9

    # 2. CARD DE IDIOMAS
    draw_card(c, MARGIN, idiomas_y, left_w, idiomas_h, "card_bg")
    idiomas_top = idiomas_y + idiomas_h
    draw_small_label(c, content["languages_label"], MARGIN + 18, idiomas_top - 26)

    lang_y = idiomas_top - 54
    for language, level in content["languages"]:
        card_bottom = lang_y - 36
        card_h = 36
        draw_card(c, MARGIN + 18, card_bottom, left_w - 36, card_h, "item_bg", radius=6)

        center_y = card_bottom + (card_h / 2.0)

        c.setFont(HEADING_FONT, 10.5)
        c.setFillColor(color("text"))
        c.drawString(MARGIN + 32, center_y - (10.5 * 0.35), language)

        c.setFont(BODY_FONT, 8.5)
        c.setFillColor(color("gold"))
        # Agora o recuo à direita é simétrico ao da esquerda (14px de margem interna)
        c.drawRightString(MARGIN + left_w - 32, center_y - (8.5 * 0.35), level)

        lang_y -= 46

    # 3. CARD DE COMPETÊNCIAS
    draw_card(c, right_x, comp_y, right_w, comp_h, "card_bg")
    draw_small_label(c, content["skills_label"], right_x + 18, top_y - 26)

    y = top_y - 54
    for title, items in content["skill_sections"]:
        c.setFont(HEADING_FONT, 10)
        c.setFillColor(color("text"))
        c.drawString(right_x + 18, y, title)

        bottom_y = draw_chip_group(c, items, right_x + 18, y - 24, right_w - 36, gap=8)
        y = bottom_y - 28

    # 4. CARD DE DIFERENCIAIS
    draw_card(c, MARGIN, dif_y, PAGE_W - MARGIN * 2, dif_h, "secondary_bg")
    draw_small_label(c, content["differentials_label"], MARGIN + 20, dif_y + dif_h - 26)

    y = dif_y + dif_h - 50
    for item in content["differentials"]:
        y = draw_bullet(c, item, MARGIN + 20, y, PAGE_W - MARGIN * 2 - 40, 9.2) - 2

    c.showPage()


def experience_page(c, content):
    draw_background(c, 3)
    draw_title(c, content["experience_title"], MARGIN, PAGE_H - 78)
    c.setFont(BODY_FONT, 10.5)
    c.setFillColor(color("muted"))
    c.drawString(MARGIN, PAGE_H - 100, content["experience_subtitle"])
    y = PAGE_H - 132

    for index, item in enumerate(content["experience"]):
        y = draw_timeline_item(
            c,
            MARGIN,
            y,
            PAGE_W - MARGIN * 2,
            item["title"],
            item["company"],
            item["period"],
            item["bullets"],
            compact=index == 2,
        )

    c.showPage()


def complementary_page(c, content):
    draw_background(c, 4)
    draw_title(c, content["complementary_title"], MARGIN, PAGE_H - 78)
    c.setFont(BODY_FONT, 10.5)
    c.setFillColor(color("muted"))
    c.drawString(MARGIN, PAGE_H - 100, content["complementary_subtitle"])
    y = PAGE_H - 132

    for item in content["complementary"]:
        y = draw_timeline_item(
            c,
            MARGIN,
            y,
            PAGE_W - MARGIN * 2,
            item["title"],
            item["company"],
            item["period"],
            item["bullets"],
            compact=True,
        )

    draw_card(c, MARGIN, 220, PAGE_W - MARGIN * 2, 170, "secondary_bg")
    draw_small_label(c, content["education_label"], MARGIN + 20, 354)
    y = 330

    for title, institution, note in content["education"]:
        c.setFont(HEADING_FONT, 12)
        c.setFillColor(color("text"))
        c.drawString(MARGIN + 20, y, title)
        c.setFont(BODY_FONT, 9.5)
        c.setFillColor(color("text_secondary"))
        c.drawString(MARGIN + 20, y - 18, institution)

        if note:
            c.setFillColor(color("muted"))
            c.drawString(MARGIN + 20, y - 36, note)
            y -= 68
        else:
            y -= 48

    draw_card(c, MARGIN, 58, PAGE_W - MARGIN * 2, 150, "card_bg")
    draw_small_label(c, content["contact_label"], MARGIN + 20, 182)

    y_start = 162
    y_left = draw_contact_line(c, "Email", "jotaafon@gmail.com", "email", MARGIN + 20, y_start)
    draw_contact_line(c, content["phone_label"], "+55 (12) 99261-3420", "phone", MARGIN + 20, y_left)

    y_right = y_start
    y_right = draw_contact_line(c, "LinkedIn", "linkedin.com/in/jotafonseca", "linkedin", MARGIN + 260, y_right)
    y_right = draw_contact_line(c, "GitHub", "github.com/JotaFon", "github", MARGIN + 260, y_right)
    draw_contact_line(c, "Site", "jotafon.github.io", "site", MARGIN + 260, y_right)

    c.showPage()


def build_pdf(locale, output_path):
    content = CONTENT[locale]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=A4)
    c.setTitle(content["meta_title"])
    c.setAuthor("João Victor Fonseca")
    c.setSubject(content["meta_subject"])

    cover_page(c, content)
    profile_page(c, content)
    experience_page(c, content)
    complementary_page(c, content)

    c.save()


def build_all():
    build_pdf("pt", OUTPUT_PT)
    build_pdf("en", OUTPUT_EN)
    copyfile(OUTPUT_PT, OUTPUT_LEGACY)
    print(f"Arquivos gerados em: {OUTPUT_DIR}")


if __name__ == "__main__":
    build_all()
