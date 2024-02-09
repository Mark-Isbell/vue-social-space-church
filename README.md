# vue-social-space-church

This is the front-end for vue-social-space-church, written in Vue-JS

vue-social-space-church is an enclosed, conversation-oriented, social media app for a Christian church, or any other religious organization

Demonstration Implementation:  [https://vue-social-space-church](https://vue-social-space-church.org/) 

Back end api server: https://github.com/Mark-Isbell/vue-social-space-church-api

# Official purpose 

For any JS coder to easily customize and deploy an enclosed, conversation-oriented, social media app for a Christian church, or any other religious organization

# Unofficial purpose 

Contains dozens of Vue integrations that can be parceled out to help in other projects

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build-only
```

### Customize the services/BackEndCalls.js file to point to your back end server

Customize the following line in that file to point wherever your back end is located:
 
 baseURL: `http://localhost:5000/api/v1`
 
 or another production-like example: 
 
 baseURL: `https://api.vue-social-space-church.org/api/v1`


### Customize the file called 'LandingPage.vue' in the views folder 
Edit the landing page (views/LandingPage.vue) to reflect your church or organization name

The default file reflects the demonstration website name
    
