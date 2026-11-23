#!/usr/bin/env python3
"""
AI Smart Study Assistant - Local HTTP Server
Lightweight Python server to host and test the web application locally.
Usage:
    python3 server.py [port]
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class StudyAssistantHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), StudyAssistantHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 65)
        print("  🎓 AI Smart Study Assistant - Web Application")
        print("=" * 65)
        print(f"  • Serving files from: {DIRECTORY}")
        print(f"  • Local Server URL:   {url}")
        print("  • Press Ctrl+C to stop the server.")
        print("=" * 65)
        
        # Open in default browser automatically
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == '__main__':
    main()
