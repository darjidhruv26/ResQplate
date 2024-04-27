# ResQplate (Food Waste Management System)

Food waste is a major problem in the world, with at least one-third of global food supplies being wasted or lost around the globe every year.

# Project PPT

[**Project PPT**](https://docs.google.com/presentation/d/11d5q84kI6K0PLBKdnCNFAVB9cXVPq0TqkiSCyG-IBe8/edit?usp=sharing)

--------------------------------------------------------------------------------------------------------------
# Project Architecture

![Resqplate-System Architect drawio](https://github.com/darjidhruv26/ResQplate/assets/90086813/e3ff2f79-6538-46d0-9508-c6db5435f441)

# Phase 1: Working on EC2 and Setup NGINX server

### Create an EC2 Instance using this [reference](https://github.com/darjidhruv26/AWS-CICD-Pipeline?tab=readme-ov-file#create-ec2-instance).

- EC2 Instance type is `Amazon Linux` `t2-micro` 
![Ec2](https://github.com/darjidhruv26/ResQplate/assets/90086813/83ce01f6-9a8d-48bd-a948-c14b4edde581)

### NGINX server Configuration
----
- Configure the NGINX server in all servers.
- Following this command to install and configure NGINX.

- Update the system using this command
```
  sudo yum update -y
```

- Install NGINX using this command
```
sudo yum install nginx
```

- Start NGINX using this command
```
sudo systemctl start nginx
```

- Navigate to this directory for configuration
```
cd /etc/nginx/conf.d/
```
- create a new file called `example.conf`
```
sudo vi example.conf
```
- To set up a proxy and port mapping, you will need to copy the following code.
- Replace 'your server name' with the name or IP address of your server and also port. 
```
server {
    listen       80;
    server_name  13.127.94.52;<you_Server_name>

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
- Check NGINX config

```sudo nginx -t```

- Restart NGINX
  
```sudo nginx -s reload```

# Phase 2: Set up Target group and Load Balancer

## Set up Target Group

In `Amazon Web Services (AWS), a target group` is a logical collection of EC2 instances that a load balancer distributes workload to. A target group can contain instances with any kind of characteristics, and you can create different target groups for different types of requests.

- Create Target Group
- Target type is `Instance`
- give Target Group name and live as default
- `Next` Select EC2 instances for a target group and Click on `Include as pending below`
- Wait for `Health status pass` and click on Create

![targetgrp](https://github.com/darjidhruv26/ResQplate/assets/90086813/b7dbebdc-e2ad-4b9a-8469-e60ba522210c)

## Set up a Load balancer

`Application Load Balancer` operates at the request level (layer 7), routing traffic to targets (EC2 instances, containers, IP addresses, and Lambda functions) based on the content of the request. Ideal for advanced load balancing of HTTP and HTTPS traffic, Application Load Balancer provides advanced request routing targeted at delivery of modern application architectures, including microservices and container-based applications. Application Load Balancer simplifies and improves the security of your application, by ensuring that the latest SSL/TLS ciphers and protocols are used at all times.

- Create Load Balancer
- Select `Application Load Balancer` and put all the details.
- Now for the temporary `Listeners and routing` section put Protocol `HTTP`, Prot `80`, and Target Group. 

![lb 1](https://github.com/darjidhruv26/ResQplate/assets/90086813/9516023d-db22-4209-a713-eb2248aa32a5)

![lb 2](https://github.com/darjidhruv26/ResQplate/assets/90086813/db96b28f-fbde-426f-8ee6-36e6fc8231f0)

# Phase 3: Set up a CI/CD Pipeline using AWS Developer tools

## [CI/CD pipeline set-up reference](https://github.com/darjidhruv26/AWS-CICD-Pipeline?tab=readme-ov-file#create-ec2-instance)

### AWS Systems Manager Parameter Store
Parameter Store, a capability of AWS Systems Manager, provides secure, hierarchical storage for configuration data management and secrets management. 
![perameter](https://github.com/darjidhruv26/ResQplate/assets/90086813/2c700253-ab5c-4a6f-9b40-120444ff3273)

### CodeBuild
`AWS CodeBuild` is a fully managed build service in the cloud. CodeBuild compiles your source code, runs unit tests, and produces artefacts that are ready to deploy. 

### CodeDeploy
`AWS CodeDeploy` is a service that automates code deployments to any instance, including Amazon EC2 instances and instances running on-premises. AWS CodeDeploy makes it easier for you to rapidly release new features, helps you avoid downtime during deployment, and handles the complexity of updating your applications.

### CodePipeline
`AWS CodePipeline `is a continuous delivery service you can use to model, visualize, and automate the steps required to release your software. You can quickly model and configure the different stages of a software release process. CodePipeline automates the steps required to release your software changes continuously.

![p0](https://github.com/darjidhruv26/ResQplate/assets/90086813/36edc15c-73a1-4537-b592-b3498f54db73)

![p1](https://github.com/darjidhruv26/ResQplate/assets/90086813/c7e71f7b-f792-4c5a-980d-f372f990878a)

![p2](https://github.com/darjidhruv26/ResQplate/assets/90086813/7068f8e2-6bd9-4719-bf0c-16bb234b0169)

![p3](https://github.com/darjidhruv26/ResQplate/assets/90086813/d1e92748-1ba4-4757-994f-8bf9b9b06307)

- CodeBuild build List
![1](https://github.com/darjidhruv26/ResQplate/assets/90086813/33487ece-c9af-41fb-9dce-d1ae3c0e38b5)

- CodePipeline history
![ps1](https://github.com/darjidhruv26/ResQplate/assets/90086813/d0e3af3a-2594-43ef-8bd9-99f9138433f1)

### CodeDeploy UAT
- Deploy application on User Acceptance Testing (UAT) environment.
![uat1](https://github.com/darjidhruv26/ResQplate/assets/90086813/d1fb9e1b-d4d1-499b-bee1-6cda5793cd0b)

### CodeDeploy Production
- Deploy application on Production (Prod) environment.
![prod1](https://github.com/darjidhruv26/ResQplate/assets/90086813/e6f984f3-afe9-4bf3-8376-281166ec7099)

# Phase 4: Set up Route53 Hosted Zone

`Amazon Route 53` is a highly available and scalable Domain Name System (DNS) web service. Route 53 connects user requests to internet applications running on AWS or on-premises. In essence a DNS turns domain names into IP addresses, which allow browsers to get to websites and other internet resources.

**Global Routing**: Route end users to your site reliably with globally dispersed Domain Name System (DNS) servers and automatic scaling.
**Routing Policies**: Customise your DNS routing policies to reduce latency, improve application availability, and maintain compliance.
**Readiness Checks**: Ensure that your resources across Availability Zones or Regions are continually audited for recovery readiness.
**IP-Based Routing**: Fine-tune your DNS routing approach based on the Classless Inter-Domain Routing (CIDR) block that the query-originating IP address belongs to.

## Connecting Namecheap Domain to Route 53
I would assume you have already purchased a domain from Namecheap or any other provider.
### Created a Hosted Zone in Route53 and Redirect NameCheap Domain to AWS Route53.

[Reference form Namecheap to Route53](https://www.namecheap.com/support/knowledgebase/article.aspx/10371/2208/how-do-i-link-my-domain-to-amazon-web-services/)

[Refernce blog](https://dev.to/1zyik/how-to-connect-your-namecheap-domain-to-route-53-2i8)

![route53 1](https://github.com/darjidhruv26/ResQplate/assets/90086813/649f0a7f-25fb-459f-9a3d-7eac86bbbc02)

Certificate Manager
![cert1](https://github.com/darjidhruv26/ResQplate/assets/90086813/97dd2e67-2dde-460d-a406-f2770b85f201)

![ditelce](https://github.com/darjidhruv26/ResQplate/assets/90086813/f0610fc1-e143-4f4b-8418-cd6b931380ec)

![route53 2](https://github.com/darjidhruv26/ResQplate/assets/90086813/c367963f-d948-4f09-a9eb-4b7ccd9e51b4)

# phase 5:
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
