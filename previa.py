#!/usr/bin/env python3
"""Prévia local do site. Uso: python3 previa.py [porta]  ->  http://localhost:8765

Serve só esta pasta, só para este computador (127.0.0.1), com suporte a Range
para o vídeo poder avançar e voltar. Não é servidor de publicação.
"""
import http.server
import os
import re
import sys

PASTA = os.path.dirname(os.path.abspath(__file__))
PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class Manipulador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PASTA, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def send_head(self):
        intervalo = self.headers.get("Range")
        caminho = self.translate_path(self.path)
        if not intervalo or not os.path.isfile(caminho):
            return super().send_head()
        m = re.match(r"bytes=(\d*)-(\d*)$", intervalo)
        tamanho = os.path.getsize(caminho)
        if not m:
            self.send_error(416)
            return None
        ini = int(m.group(1)) if m.group(1) else max(0, tamanho - int(m.group(2)))
        fim = int(m.group(2)) if m.group(1) and m.group(2) else tamanho - 1
        fim = min(fim, tamanho - 1)
        if ini > fim:
            self.send_error(416)
            return None
        arq = open(caminho, "rb")
        arq.seek(ini)
        self._restante = fim - ini + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(caminho))
        self.send_header("Content-Range", f"bytes {ini}-{fim}/{tamanho}")
        self.send_header("Content-Length", str(self._restante))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return arq

    def copyfile(self, origem, destino):
        restante = getattr(self, "_restante", None)
        if restante is None:
            return super().copyfile(origem, destino)
        try:
            while restante > 0:
                bloco = origem.read(min(65536, restante))
                if not bloco:
                    break
                destino.write(bloco)
                restante -= len(bloco)
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            self._restante = None


if __name__ == "__main__":
    print(f"Prévia em http://localhost:{PORTA}  (Ctrl+C para parar)")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORTA), Manipulador).serve_forever()
