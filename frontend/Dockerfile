FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY ./public /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html/dist
COPY ./locales /usr/share/nginx/html/locales

COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
