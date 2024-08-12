FROM nginx:alpine

COPY ./public /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html/dist
COPY ./locales /usr/share/nginx/html/locales

COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
