FROM php:7.4-cli

WORKDIR /usr/src/app
COPY home.html home.html
COPY index.php index.php
COPY script.js script.js
COPY style.css style.css
COPY words.txt words.txt

CMD ["php", "-S", "0.0.0.0:80"]
