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
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted);
    _loadHtml();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }

  void _onMessageReceived(JavaScriptMessage message) {
    debugPrint(message.message);
  }

  Future<void> _loadHtml() async {
    final htmlString = await rootBundle.loadString('assets/index.html');
    final jsString = await rootBundle.loadString('assets/streaming-client-api.js');
    final jsonString = await rootBundle.loadString('assets/api.json');

    final modifiedHtml = htmlString
        .replaceFirst(
        '<script type="module" src="./streaming-client-api.js"></script>',
        '''
      <script type="module">
        window.APP_CONFIG = ${jsonString};
        ${jsString}
      </script>
      '''
    );

    _controller.loadHtmlString(modifiedHtml);
  }
}
