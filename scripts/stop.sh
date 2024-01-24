#!/bin/bash

docker stop reqplate
docker rm reqplate
docker image rm dhruvdarji123/reqplate-app:latest 