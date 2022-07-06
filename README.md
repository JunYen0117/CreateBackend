# CreateBackend
MFEE25大專-創意迴廊-後端

## 開啟專案
1. `git clone https://github.com/JunYen0117/CreateBackend.git`
2. 根據 .env.example 建立 .env #檔案 並填寫設定
3. 將資料庫名稱改為 create
4. 在專案資料夾的同一層建一個`sessions`資料夾
5. 安裝 node_modules：`npm install`
6. 啟動伺服器：`npm run dev`
7. 開啟 http://127.0.0.1:3003 or http://localhost:3003

## 俊彥補充：
1. session會建立在專案之外，也就是CreateBackend資料夾外面
2. 在.env檔案裡，設定 SESSION_SECRET = 12345