import os
from PIL import Image, UnidentifiedImageError, ExifTags
from datetime import datetime

# CONFIGURAÇÕES
PASTA_ORIGEM = "../fotos"
PASTA_DESTINO = "../fotos_convertidas"
EXTENSAO_SAIDA = "webp"
QUALIDADE = 100

os.makedirs(PASTA_DESTINO, exist_ok=True)

EXTENSOES_SUPORTADAS = [
    ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".gif",
    ".webp", ".avif"
]

def extrair_data(caminho):
    try:
        ext = os.path.splitext(caminho)[1].lower()

        if ext == ".heic":
            print(f"⚠️ Ignorado (HEIC não suportado): {os.path.basename(caminho_origem)}")
            return
        else:
            img = Image.open(caminho)
            exif = img._getexif()

        if exif:
            for tag, value in exif.items():
                nome_tag = ExifTags.TAGS.get(tag)
                if nome_tag == "DateTimeOriginal":
                    return datetime.strptime(value, "%Y:%m:%d %H:%M:%S").timestamp()
    except Exception:
        pass

    # fallback: data de modificação do arquivo
    return os.path.getmtime(caminho)

def processar_imagem(caminho_origem, caminho_saida):
    ext = os.path.splitext(caminho_origem)[1].lower()

    try:
        if ext == ".heic":
            heif_file = pyheif.read(caminho_origem)
            imagem = Image.frombytes(
                heif_file.mode, heif_file.size, heif_file.data, "raw", heif_file.mode
            )
        else:
            imagem = Image.open(caminho_origem)

        if imagem.mode not in ("RGB", "L"):
            imagem = imagem.convert("RGB")

        imagem.save(caminho_saida, EXTENSAO_SAIDA.upper(), quality=QUALIDADE, method=6)
        print(f"✅ Convertido: {os.path.basename(caminho_origem)} → {os.path.basename(caminho_saida)}")

    except UnidentifiedImageError:
        print(f"❌ Ignorado (não é imagem): {caminho_origem}")
    except Exception as e:
        print(f"❌ Erro ao processar '{caminho_origem}': {e}")

# 🔎 Obter lista de arquivos com data
arquivos_com_data = []

for nome in os.listdir(PASTA_ORIGEM):
    caminho = os.path.join(PASTA_ORIGEM, nome)
    ext = os.path.splitext(nome)[1].lower()

    if os.path.isfile(caminho) and ext in EXTENSOES_SUPORTADAS:
        data = extrair_data(caminho)
        arquivos_com_data.append((data, caminho))
    else:
        print(f"⚠️ Extensão não suportada ou não é arquivo: {nome}")

# 🕒 Ordenar por data
arquivos_ordenados = sorted(arquivos_com_data, key=lambda x: x[0])

# 🚀 Processar
for i, (_, caminho_origem) in enumerate(arquivos_ordenados, start=1):
    nome_convertido = f"{i}.{EXTENSAO_SAIDA}"
    caminho_saida = os.path.join(PASTA_DESTINO, nome_convertido)
    processar_imagem(caminho_origem, caminho_saida)
