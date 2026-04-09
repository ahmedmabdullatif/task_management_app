# المرحلة الأولى: البناء (Build Stage)
FROM node:22 as build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
# بناء نسخة الإنتاج بواسطة Vite
RUN npm run build 

# المرحلة الثانية: التشغيل (Production Stage)
FROM nginx:alpine
# نسخ الملفات المبنية من المرحلة الأولى إلى مسار Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# فتح منفذ الويب الافتراضي
EXPOSE 80
# تشغيل خادم Nginx
CMD ["nginx", "-g", "daemon off;"]