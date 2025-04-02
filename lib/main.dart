import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'D-ID Streaming Integration',
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

  void _onMessageReceived(JavaScriptMessage message) {
    debugPrint(message.message);
  }

  Future<void> _loadHtml() async {
    final html = await rootBundle.loadString('assets/index.html');
    final sdkJs = await rootBundle.loadString('assets/sdk.js');
    final mainJs = await rootBundle.loadString('assets/main.js');
    final css = await rootBundle.loadString('assets/style.css');
    final webSpeechJs = await rootBundle.loadString('assets/webSpeechAPI.js');

    final modifiedHtml = html
        .replaceFirst(
          '<link rel="stylesheet" href="style.css">',
          '<style>$css</style>',
        )
        .replaceFirst(
          '<script src="sdk.js"></script>',
          '<script>$sdkJs</script>',
        )
        .replaceFirst(
      '<script src="main.js"></script>',
      '''
    <script>
      (async () => {
        ${mainJs.replaceFirst('let agentManager = await sdk.createAgentManager', 'window.agentManager = await sdk.createAgentManager')}
      })();
    </script>
    ''',
    ).replaceFirst(
      '<script src="webSpeechAPI.js"></script>',
      '<script>$webSpeechJs</script>',
    );

    await _controller.loadHtmlString(modifiedHtml);
  }
}
