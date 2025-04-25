import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  runApp(
    MaterialApp(
      title: 'D-ID avatars integration',
      home: AvatarStreamingWebView(
        apiKey: '',
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
        _loadHtml();
      },
      onLoadStop: (controller, url) async {
        _onLoadStop();
      }
    );
  }

  @override
  void dispose() {
    super.dispose();
    _webViewController.dispose();
  }

  void _loadHtml() async {
    await _webViewController.loadFile(assetFilePath: 'assets/index.html');
  }

  void _onLoadStop() async {
    final config = jsonEncode({
      "url": widget.url,
      "key": widget.apiKey,
      "agentId": widget.agentId,
      "chatId": widget.chatId ?? ''
    });
    await _webViewController.evaluateJavascript(source: 'initChat($config)');
  }
}
