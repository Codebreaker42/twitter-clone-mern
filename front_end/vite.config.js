import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:8000, // this is front_end port number
    proxy:{
      "/api":{
        target: "http://localhost:5000", //back_end port number
        changeOrigin:true,
      }
    }
  }
})
