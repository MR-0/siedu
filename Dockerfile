# build enviroment
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# server enviroment
FROM nginx:stable
COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /app/build /usr/share/nginx/html
ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"