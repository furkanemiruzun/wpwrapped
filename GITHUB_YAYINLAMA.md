# GitHub'da Yayınlama Kılavuzu

Bu projeyi GitHub Pages üzerinde yayınlamak için aşağıdaki adımları takip edin.

## 1. Hazırlık (Otomatik Yapıldı)
Sizin için gerekli paketleri kurdum ve ayarları yaptım:
- `gh-pages` paketi kuruldu.
- `package.json` dosyasına `deploy` komutu eklendi.
- `vite.config.js` dosyasına temel ayar eklendi.

## 2. GitHub Reposu Oluşturun
1. GitHub hesabınıza gidin ve **New Repository** diyerek yeni bir repo oluşturun.
2. Repo adını not edin (örneğin: `chat-analiz`).

## 3. Ayarları Güncelleyin
1. `app/vite.config.js` dosyasını açın.
2. `base: '/chatwrapp-analysis/'` satırını bulun.
3. `/chatwrapp-analysis/` kısmını kendi repo adınızla değiştirin.
   - Örn: Repo adınız `chat-analiz` ise burası `/chat-analiz/` olmalı.

## 4. Yayınlama Komutları
Terminalde `app` klasörünün içindeyken sırasıyla şunları yapın:

```bash
# Git'i başlatın (eğer daha önce yapmadıysanız)
git init
git add .
git commit -m "İlk yayınlama"

# Reponuzu bağlayın (LINK kısmına kendi repo linkinizi yapıştırın)
# Örn: git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git

# Yayınlayın
npm run deploy
```

## 5. Sonuç
Komut başarıyla tamamlandığında, siteniz şu adreste yayında olacak:
`https://KULLANICI_ADI.github.io/REPO_ADI/`
