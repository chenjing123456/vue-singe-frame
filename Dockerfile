FROM harbor.yscredit.com/public/nginx
COPY ./dist /home/web
COPY ./nginx/  /etc/nginx/conf.d/
EXPOSE 8218
ENTRYPOINT nginx -g "daemon off;"
