# 怎么配置跨域资源共享
[跨域资源共享](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)，也就是 CORS，全称是 Cross-Origin Resource Sharing 。

## 仓库介绍
backend 路径下有两个文件，一个是没考虑 cookie 的跨域相关设置，一个是有考虑 cookie 的跨域相关设置。

通过 `npm run start-no-cookie` 或者 `npm run start-need-cookie` 来启动不同的前后端服务。

需要注意现在启动的前后端服务都在 localhost 这个域名下，只是端口号不一样，所以暂时 cookie 相关没有涉及到 [samesite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax) 这个问题（samesite 默认值是 lax ，而 cross-site 请求需要设为 none 后 cookie 才能使用），但是实际环境中是需要处理 samesite 问题的，因为前后端一般会在不同域名下。

这里也是涉及到一个点，[origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) 和 [site](https://developer.mozilla.org/en-US/docs/Glossary/Site) 的区别，两个地址如果协议或者端口号不同，会认为是不同的 origin ，但是对于 site 来说并不关心协议和端口号。

也就是跨 origin 不一样是跨 site 。

## 一些前置知识
### 什么是跨域

前端从地址 a 去请求地址 b 的资源，如果两个地址的协议、域名和端口号都一样，就认为是同域，否则就是跨域。

### 为什么要请求跨域资源

一些公共的服务端资源，比如 https://unpkg.com/axios@0.21.1/dist/axios.min.js 这种，任意一个前端源都有可能会去请求这个资源。

再比如一些第三方服务，比如高德地图 api ，你去请求的时候肯定是跨域了。

### 什么是简单请求

参见 [Simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) 。

一些非简单请求的举例：
* PUT 和 DELETE 请求；
* content-type 为 `application/json` 的请求；
* 有自定义 header 的请求；
* 等等。

当跨域时，浏览器会自行判断一个请求是不是简单请求。

非简单请求浏览器会先发一个 OPTIONS 请求，并在请求头中携带一些实际请求的信息。然后服务端在响应头中返回允许跨域访问的一些条件。浏览器判断前端实际请求满足跨域条件时才会接着发送实际请求。

### 前端发请求时设置 withCredentials 是用来干啥的

当请求另外一个域的资源时，浏览器发送的请求默认是不会携带那个域的 cookie 的，服务端执行 set-cookie 操作不会报错但是实际是无效的。

只有当前端发送请求时设置了 withCredentials 为 true 并且后端响应头中设置了 Access-Control-Allow-Credentials 为 true ，跨域请求才会携带服务端域的 cookie ，服务端 set-cookie 才能成功设置上。

## 相关 HTTP header 解释
### 所有请求，包括 OPTIONS 请求都需要设置的响应头

* [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)：告诉浏览器允许什么源跨域访问，* 或者某个具体源，withCredentials 为 true 时不允许设为 * ；
* [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)：当前端发的请求 withCredentials 为 true 时，后端也需要设置这个为 true 。

### 只用 OPTIONS 请求需要设置的响应头

* [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)：告诉浏览器访问资源时允许携带哪些请求头；
* [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)：告诉浏览器资源允许哪些方法访问
* [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age)：对 OPTIONS 请求设置一个缓存时间，在缓存时间内不会再发送

### OPTIONS 请求头浏览器自动加上的

* [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers)：告诉服务端实际请求会携带哪些请求头
* [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method)：告诉服务端实际请求会用什么方法请求

### 当服务端希望暴露某个自定义 header 给前端时

* [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)：后端允许额外暴露给前端的 header ，比如某个接口后端设置了一个自定义 header ，如果没设置 Access-Control-Expose-Headers 的话前端是获取不到这个 header 的。

