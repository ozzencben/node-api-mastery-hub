# 1. Aşama: Node.js imajını seçiyoruz
FROM node:20-slim

# 2. Aşama: Prisma bağımlılıklarını kuruyoruz
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Aşama: Paket listelerini kopyala
COPY package*.json ./

# 4. Aşama: KRİTİK DOKUNUŞ - Prisma klasörünü ŞİMDİ kopyala
# Bu sayede 'npm install' biter bitmez çalışan 'postinstall' şemayı bulabilecek.
COPY prisma ./prisma/

# 5. Aşama: Bağımlılıkları kur
RUN npm install

# 6. Aşama: Geri kalan her şeyi kopyala
COPY . .

# 7. Aşama: Derleme (Build scriptin zaten prisma generate içeriyor, sorun çıkmaz)
RUN npm run build

EXPOSE 5000

# Önce migrationları güvenli bir şekilde uygular, başarılı olursa uygulamayı başlatır.
CMD npx prisma migrate deploy && npm start