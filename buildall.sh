#!/bin/bash
set -x
testlocally(){
    cd todoapi
    FORCE_COLOR=true CI=true npm test -- --coverage
    cd ../todoui
    FORCE_COLOR=true CI=true npm test -- --coverage
    cd ..

}

stoplocal(){
    kill -9 `lsof -t -i:3000`
    kill -9 `lsof -t -i:3001`

    docker stop redis-stack jaeger

}

runlocally(){

    stoplocal

    #run redis stack
    docker run --rm --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest &

    cd todoapi
    NODE_ENV=development npm run dev &
    cd ../todoui
    NODE_ENV=development PORT=3001 FORCE_COLOR=true npm run dev | cat &
    cd ..
}

buildimages() {
cd todoapi
docker build . -t todoapi
cd ../todoui
docker build . -t todoui
cd ..
}

stopcontainers()
{
docker stop todoapi todoui redis-stack jaeger
docker rm todoapi todoui redis-stack jaeger
docker network rm todo-fe todo-be
docker volume rm todo-data

}

runcontainers() {

stopcontainers

docker network create --driver bridge todo-fe
docker network create --driver bridge todo-be
docker volume create todo-data

docker run --network todo-be -d --rm \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  --name jaeger jaegertracing/all-in-one:latest

docker run --network todo-be -d --rm \
    -p 6379:6379 \
    -p 8001:8001 \
    -v `pwd`/local-redis-stack.conf:/redis-stack.conf \
    -v todo-data:/data \
    --name redis-stack redis/redis-stack:latest

cd todoapi
docker run --network todo-be -d --rm \
    -p 4000:3000 \
    -e JAEGER_URL=http://jaeger:4318/v1/traces \
    -e REDIS_URL=redis://redis-stack:6379 \
    -e NODE_ENV=production \
    --name todoapi todoapi

cd ../todoui
docker run --network todo-fe --rm -d \
    -p 4001:80 \
    -e API_URL=http://localhost:4000/todos \
    -e API_KEY=key \
    --name todoui todoui
cd ..
}

deploykongingress() {
    kubectl apply -f https://bit.ly/k4k8s
}

undeployk8s()
{
    cd k8s
    kubectl delete -f todouideploy.yaml -f todoui_config.yaml
    kubectl delete -f todoapideploy.yaml -f todoapi_config.yaml
    kubectl delete -f redisstack.yaml
    kubectl delete -f todoingress.yaml
    kubectl delete -f kongplugins.yaml -f kongconsumer.yaml
    kubectl delete secret todoapi-apikey todoui-basic-auth-cred
    cd ..
}

deployk8s() {

    undeployk8s

    cd k8s

#create api key as k8s secret its used by kongconsumer
    kubectl create secret generic todoapi-apikey  \
  --from-literal=kongCredType=key-auth  \
  --from-literal=key=my-sooper-secret-key

    kubectl create secret generic todoui-basic-auth-cred  \
  --from-literal=kongCredType=basic-auth  \
  --from-literal=username=todoui \
  --from-literal=password=todoui

    kubectl apply -f kongplugins.yaml -f kongconsumer.yaml
    kubectl apply -f redisstack.yaml
    kubectl apply -f todoapi_config.yaml -f todoapideploy.yaml
    kubectl apply -f todoui_config.yaml -f todouideploy.yaml

    kubectl rollout status deploy/todoapi deploy/todoui --timeout=30s

    kubectl apply -f todoingress.yaml
    cd ..
}

local_run()
{
testlocally
runlocally
}

docker_run()
{
buildimages
runcontainers
}


k8s_run()
{
buildimages
# deploykongingress
deployk8s
}

stop_all()
{
    stoplocal
    stopcontainers
    undeployk8s
}

create_zip(){
    rm -rf tdd-workshop.zip
    git archive --format=zip --output tdd-workshop.zip HEAD
}


usage() { echo "Usage: $0 [-l local_run ][-d docker_run ][-k k8s_run] [-s stop_all] [-z create_zip]" 1>&2; exit 1; }

while getopts ":ldksz" o; do
    case "${o}" in
        l) #local
            l="yes"
            u="yes"
            ;;
        d) #docker
            d="yes"
            u="yes"
            ;;
        k) #k8s
            k="yes"
            u="yes"
            ;;
        s) #stop all
            s="yes"
            u="yes"
            ;;
        z) #zip
            z="yes"
            u="yes"
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))

 echo l=$l d=$d k=$k s=$s z=$z u=$u

if [ -z "${u}" ]; then
    usage
fi

if [ ! -z "${s}" ]; then
    stop_all
fi

if [ ! -z "${l}"  ]; then
    local_run
fi

if [ ! -z "${d}"  ]; then
    docker_run
fi

if [ ! -z "${k}" ]; then
    k8s_run
fi

if [ ! -z "${z}" ]; then
    create_zip
fi
