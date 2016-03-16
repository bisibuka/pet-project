FROM node

RUN apt-get update && apt-get install -y \
nginx

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install

RUN cp nginx/angular.conf /etc/nginx/sites-available/pet-product.loc
RUN ln -s /etc/nginx/sites-available/pet-product.loc /etc/nginx/sites-enabled/pet-product.loc
RUN rm /etc/nginx/sites-enabled/default

EXPOSE 80 8000
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]