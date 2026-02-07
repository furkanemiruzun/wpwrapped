import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:archive/archive.dart';
import 'package:chatwrapp_mobile/models/chat_data.dart';
import 'package:chatwrapp_mobile/services/chat_parser.dart';

class ChatProvider extends ChangeNotifier {
  ChatStats? _stats;
  String? _fileName;
  bool _isLoading = false;
  String? _error;

  ChatStats? get stats => _stats;
  String? get fileName => _fileName;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> pickAndParseFile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['txt', 'zip'],
        withData: true, // Necessary for Web
      );

      if (result != null) {
        _fileName = result.files.single.name;
        final bytes = result.files.single.bytes;

        if (bytes == null) {
          throw Exception('Dosya içeriği okunamadı.');
        }

        String content = '';

        if (_fileName!.endsWith('.zip')) {
          final archive = ZipDecoder().decodeBytes(bytes);

          final txtFile = archive.files.firstWhere(
            (file) =>
                file.name.endsWith('.txt') && !file.name.contains('__MACOSX'),
            orElse: () =>
                throw Exception('Zip içinde .txt dosyası bulunamadı.'),
          );
          content = utf8.decode(
            txtFile.content as List<int>,
            allowMalformed: true,
          );
        } else {
          content = utf8.decode(bytes, allowMalformed: true);
        }

        _stats = ChatParser.parse(content);
        if (_stats == null) throw Exception('Analiz başarısız oldu.');
      }
    } catch (e) {
      debugPrint('Parsing Error: $e'); // Konsola log basıyoruz
      _error = 'Hata: ${e.toString().replaceAll('Exception: ', '')}';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void reset() {
    _stats = null;
    _fileName = null;
    _error = null;
    notifyListeners();
  }
}
