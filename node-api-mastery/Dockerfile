# 1. Aşama: Node.js imajını seçiyoruz (Hafif ve güvenli)
FROM node:20-slim

# 2. Aşama: Prisma'nın Linux üzerinde çalışması için gereken sistem bağımlılıklarını kuruyoruz
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# 3. Aşama: Çalışma dizini oluşturuyoruz
WORKDIR /app

# 4. Aşama: Bağımlılıkları kopyalıyoruz (Önce sadece packageları kopyalamak Docker cache avantajı sağlar)
COPY package*.json ./
RUN npm install

# 5. Aşama: Tüm kaynak kodunu ve Prisma klasörünü kopyalıyoruz
COPY . .

# 6. Aşama: Prisma Client üretimi ve TypeScript derleme
# Senin 'build' scriptin zaten 'prisma generate && tsc' yaptığı için tek komut yeterli
RUN npm run build

# 7. Aşama: Portu dışarı açıyoruz (Senin server.ts'deki portunla uyumlu olmalı)
EXPOSE 5000

# 8. Aşama: Uygulamayı başlatıyoruz
CMD ["npm", "start"]