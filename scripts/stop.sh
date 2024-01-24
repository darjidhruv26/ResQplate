#!/bin/bash

docker stop resqplate-app
docker rm resqplate-app
docker image rm dhruvdarji123/reqplate-app:latest 