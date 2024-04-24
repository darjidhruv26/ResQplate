# ResQplate (Food Waste Management System)

Food waste is a major problem in the world, with at least one third of global food supplies being wasted or lost around the globe every year.

## PPT

[Project PPT](https://docs.google.com/presentation/d/11d5q84kI6K0PLBKdnCNFAVB9cXVPq0TqkiSCyG-IBe8/edit?usp=sharing)


# Project Architecture

![Resqplate-System Architect](https://github.com/darjidhruv26/ResQplate/assets/90086813/3a0eefb4-75fc-410f-89ee-7023d624715c)


- NGINX server Config

```
sudo systemctl start nginx
```

```
cd /etc/nginx/conf.d/
```

```
sudo vi example.conf
```

```
server {
    listen       80;
    server_name  13.127.94.52;

     location / {
        proxy_pass http://localhost:3000; #whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```

```
# Check NGINX config
sudo nginx -t

# Restart NGINX
sudo nginx -s reload
```
