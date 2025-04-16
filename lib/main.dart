import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'D-ID avatars integration',
      home: AvatarStreamingWebView(
        apiKey: '',
        agentId: 'agt_ImSdNdOc',
        chatId: 'cht_HLEN2jQf9Ww7YgmZcNcJm',
      ),
    ),
  );
}

class AvatarStreamingWebView extends StatefulWidget {
  final String apiKey;
  final String agentId;
  final String? chatId;

  const AvatarStreamingWebView({
    super.key,
    required this.apiKey,
    required this.agentId,
    this.chatId
  });

  @override
  State<AvatarStreamingWebView> createState() => _AvatarStreamingWebViewState();
}

class _AvatarStreamingWebViewState extends State<AvatarStreamingWebView> {
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

    final config = jsonEncode({
      "url": "https://api.d-id.com",
      "key": widget.apiKey,
      "agentId": widget.agentId,
      "chatId": widget.chatId ?? ''
    });

    final modifiedHtml = htmlString
        .replaceFirst('<link rel="stylesheet" href="style-agents.css">',
        '<style>$cssString</style>')
        .replaceFirst(
        '<script type="module" src="./agents-client-api.js"></script>', '''
      <script type="module">
        window.APP_CONFIG = $config;
        $jsString
      </script>
      ''');

    _controller.loadHtmlString(modifiedHtml);
  }
}
