# ResQplate (Food Waste Management System)

Food waste is a major problem in the world, with at least one-third of global food supplies being wasted or lost around the globe every year.

## PPT

[Project PPT](https://docs.google.com/presentation/d/11d5q84kI6K0PLBKdnCNFAVB9cXVPq0TqkiSCyG-IBe8/edit?usp=sharing)


# Project Architecture

![Resqplate-System Architect](https://github.com/darjidhruv26/ResQplate/assets/90086813/3a0eefb4-75fc-410f-89ee-7023d624715c)

ec2
![Ec2](https://github.com/darjidhruv26/ResQplate/assets/90086813/83ce01f6-9a8d-48bd-a948-c14b4edde581)

- NGINX server Config
```
  sudo yum update -y
```

```
sudo yum install nginx
```

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
# Check NGINX config
`sudo nginx -t`

# Restart NGINX
`sudo nginx -s reload`

Target Group

![targetgrp](https://github.com/darjidhruv26/ResQplate/assets/90086813/b7dbebdc-e2ad-4b9a-8469-e60ba522210c)

Load balancer

![lb 1](https://github.com/darjidhruv26/ResQplate/assets/90086813/9516023d-db22-4209-a713-eb2248aa32a5)

![lb 2](https://github.com/darjidhruv26/ResQplate/assets/90086813/db96b28f-fbde-426f-8ee6-36e6fc8231f0)



BUilding CI/CD pipeline reference

AWS Parameter Store
![perameter](https://github.com/darjidhruv26/ResQplate/assets/90086813/2c700253-ab5c-4a6f-9b40-120444ff3273)

- code pipeline
![p0](https://github.com/darjidhruv26/ResQplate/assets/90086813/36edc15c-73a1-4537-b592-b3498f54db73)

code pipeline 1
![p1](https://github.com/darjidhruv26/ResQplate/assets/90086813/c7e71f7b-f792-4c5a-980d-f372f990878a)

code pipeline 2
![p2](https://github.com/darjidhruv26/ResQplate/assets/90086813/7068f8e2-6bd9-4719-bf0c-16bb234b0169)

code pipeline 3
![p3](https://github.com/darjidhruv26/ResQplate/assets/90086813/d1e92748-1ba4-4757-994f-8bf9b9b06307)

build list
![1](https://github.com/darjidhruv26/ResQplate/assets/90086813/33487ece-c9af-41fb-9dce-d1ae3c0e38b5)

code pipeline history
![ps1](https://github.com/darjidhruv26/ResQplate/assets/90086813/d0e3af3a-2594-43ef-8bd9-99f9138433f1)

code pipeline uat
![uat1](https://github.com/darjidhruv26/ResQplate/assets/90086813/d1fb9e1b-d4d1-499b-bee1-6cda5793cd0b)

code pipeline prod
![prod1](https://github.com/darjidhruv26/ResQplate/assets/90086813/e6f984f3-afe9-4bf3-8376-281166ec7099)


Route53:
![route53 1](https://github.com/darjidhruv26/ResQplate/assets/90086813/649f0a7f-25fb-459f-9a3d-7eac86bbbc02)

Certificate Manager
![cert1](https://github.com/darjidhruv26/ResQplate/assets/90086813/97dd2e67-2dde-460d-a406-f2770b85f201)

![ditelce](https://github.com/darjidhruv26/ResQplate/assets/90086813/f0610fc1-e143-4f4b-8418-cd6b931380ec)

![route53 2](https://github.com/darjidhruv26/ResQplate/assets/90086813/c367963f-d948-4f09-a9eb-4b7ccd9e51b4)

Application running

![apprunning 1](https://github.com/darjidhruv26/ResQplate/assets/90086813/f0890567-f7fe-4988-8dc1-9e20c7ef7e11)

SSL
![https application](https://github.com/darjidhruv26/ResQplate/assets/90086813/667be417-296d-4224-9996-cfae47bf795c)

location needy
![location access](https://github.com/darjidhruv26/ResQplate/assets/90086813/4eaeff9c-90a0-49c2-9d19-41742ae268c3)

needy 1
![apprunning 1needy location](https://github.com/darjidhruv26/ResQplate/assets/90086813/47195db4-1731-4e99-a888-114ea75c2b06)

donator part
![apprunning 2 dashboard](https://github.com/darjidhruv26/ResQplate/assets/90086813/c887f544-a25e-49fb-b01c-00af6a1b0d0c)

donation form
![apprunning 2 foodform](https://github.com/darjidhruv26/ResQplate/assets/90086813/c568a69a-b90b-45ad-937c-19cf552be121)

donation 2
![apprunning 2 donation](https://github.com/darjidhruv26/ResQplate/assets/90086813/c6262c3f-3901-469f-9fa7-8eaa5657bed2)
