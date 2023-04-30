FROM debian:bookworm

LABEL maintainer="Sergey Denisov <DenisovS21@gmail.com>"

ENV TERM="linux"
ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /usr/src/app

RUN apt -y update && \
    apt -y upgrade && \
    apt install -y gcc g++ nodejs npm git bash sudo make && \
	git clone https://github.com/orangepi-xunlong/wiringOP.git && \
	cd wiringOP && \
	echo "BOARD=orangepi-r1" > /etc/armbian-release && \
	bash build

ENV TZ=Asia/Novosibirsk

CMD [ "./start.sh" ]