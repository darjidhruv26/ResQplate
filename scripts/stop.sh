#!/bin/bash

docker stop reqplate
docker rm reqplate
docker image rm dhruvdarji123/resqplate-app:latest 
