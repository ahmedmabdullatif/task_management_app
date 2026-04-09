# استخدام نسخة خفيفة من Node.js
FROM node:18-alpine

# تحديد مسار العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات الحزم وتثبيتها أولاً (للاستفادة من الـ Caching)
COPY package*.json ./
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# فتح المنفذ الذي سيعمل عليه الـ Backend
EXPOSE 5001

# أمر تشغيل السيرفر
CMD ["npm", "start"]