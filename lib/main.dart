import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'D-ID WebRTC Integration',
      home: WebRTCWebView(),
    ),
  );
}

class WebRTCWebView extends StatefulWidget {
  const WebRTCWebView({super.key});

  @override
  State<WebRTCWebView> createState() => _WebRTCWebViewState();
}

class _WebRTCWebViewState extends State<WebRTCWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController();
    _loadHtml();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }

  Future<void> _loadHtml() async {
    final htmlString = await rootBundle.loadString('assets/index.html');
    final cssString = await rootBundle.loadString('assets/style-agents.css');
    final jsString = await rootBundle.loadString('assets/agents-client-api.js');
    final jsonString = await rootBundle.loadString('assets/api.json');

    final modifiedHtml = htmlString
        .replaceFirst('<link rel="stylesheet" href="style-agents.css">',
            '<style>$cssString</style>')
        .replaceFirst(
            '<script type="module" src="./agents-client-api.js"></script>', '''
      <script type="module">
        window.APP_CONFIG = ${jsonString};
        ${jsString}
      </script>
      ''');

    _controller.loadHtmlString(modifiedHtml);
  }
}
