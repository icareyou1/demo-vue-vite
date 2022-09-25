import { defineConfig } from 'vite'
import {resolve} from "path"
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://192.168.0.100:8080",
        rewrite:path => path.replace("/api",""),
      }
    }
  },
  css:{
    preprocessorOptions:{
      less:{
        modifyVars: {
          hack: `true; @import (reference) "${resolve("src/assets/css/base.less")}";`,
        },
        javascriptEnabled: true,
      }
    }
  },
  plugins: [
    vue(),
    //EL-plus按需导入
    AutoImport({
      resolvers: [
          ElementPlusResolver(),
      ],

    }),
    //EL-plus按需导入
    Components({
      resolvers: [
          ElementPlusResolver(),
      ],
    }),
  ],
  //配置路径@
  resolve:{
    alias:{
      "@":resolve(__dirname,"./src")
    }
  }
})
