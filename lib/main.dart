import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'D-ID avatars integration',
      home: AvatarStreamingWebView(
        apiKey: 'bXNhZGtvZmZAbWFpbC5ydQ:-QWK5Nk4IrJz6UzZu-Qzi',
        url: 'https://api.d-id.com',
        agentId: 'agt_ImSdNdOc',
        chatId: 'cht_HLEN2jQf9Ww7YgmZcNcJm',
      ),
    ),
  );
}

class AvatarStreamingWebView extends StatefulWidget {
  final String apiKey;
  final String url;
  final String agentId;
  final String? chatId;

  const AvatarStreamingWebView({
    super.key,
    required this.url,
    required this.apiKey,
    required this.agentId,
    this.chatId,
  });

  @override
  State<AvatarStreamingWebView> createState() => _AvatarStreamingWebViewState();
}

class _AvatarStreamingWebViewState extends State<AvatarStreamingWebView> {
  late final InAppWebViewController _webViewController;

  @override
  Widget build(BuildContext context) {
    return InAppWebView(
      initialSettings: InAppWebViewSettings(
        javaScriptEnabled: true,
      ),
      onWebViewCreated: (controller) async {
        _webViewController = controller;
        await _loadHtml();
      },
    );
  }

  @override
  void dispose() {
    super.dispose();
    _webViewController.dispose();
  }

  Future<void> _loadHtml() async {
    final htmlString = await rootBundle.loadString('assets/index.html');
    final jsString = await rootBundle.loadString('assets/agents-client-api.js');

    final config = jsonEncode({
      "url": widget.url,
      "key": widget.apiKey,
      "agentId": widget.agentId,
      "chatId": widget.chatId ?? ''
    });
  final modifiedHtml = htmlString.replaceFirst(
    '<script type="module" src="agents-client-api.js"></script>',
    '''
    <script type="module">
      window.APP_CONFIG = $config;
      $jsString
    </script>
    ''',
  );

  await _webViewController.loadData(
    data: modifiedHtml,
    mimeType: 'text/html',
    encoding: 'utf-8',
  );
}
}
