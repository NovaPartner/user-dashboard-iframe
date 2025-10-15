from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.error

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Відправляємо запит до Google Apps Script
            api_url = 'https://script.google.com/macros/s/AKfycbyAoJDUyFRpRR-J1jbod2CVw4Z7xSf7ydq1OtXTwv5zXuj7Hms8vKTm39bl5wYWJUG3Sw/exec'
            
            req = urllib.request.Request(
                api_url,
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    result = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(result)
            except urllib.error.HTTPError as e:
                error_msg = json.dumps({'error': str(e)}).encode()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_msg)
        else:
            super().do_POST()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), ProxyHandler)
    print('Proxy server running on http://localhost:8000')
    server.serve_forever()

