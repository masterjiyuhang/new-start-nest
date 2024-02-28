FROM node:20-alpine as build-stage

# # 设置时区为Asia/Shanghai
# RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" >/etc/timezone

# 创建工作目录
RUN mkdir -p /app

# 指定工作目录
WORKDIR /app

# 复制当前代码到/app工作目录
COPY . ./

# 设置--max-old-space-size
ENV NODE_OPTIONS=--max-old-space-size=16384
ENV DATABASE_PROT=3308
ENV DATABASE_USER=root
ENV DATABASE_PASSWORD=password
ENV NODE_ENVIRONMENT=production

# 设置 node 镜像
RUN npm config set registry https://registry.npmmirror.com/

# 使用 pnmp 安装依赖
RUN npm install -g pnpm

COPY package.json /app/package.json
RUN rm -rf /app/package-lock.json

RUN cd /app && rm -rf /app/node_modules && pnpm install
# 打包
RUN cd /app && rm -rf /app/dist && pnpm run build

# node部分结束
RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉!"

CMD [ "pnpm", "run", "start:prod" ]

EXPOSE 3234
