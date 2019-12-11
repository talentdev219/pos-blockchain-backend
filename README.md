# Code for my theses
[![Status:](https://img.shields.io/badge/Status-Ongoing--dev-blue.svg)](#Development)

Repo kodingan untuk tesis saya, pakai bahasa pemrograman javascript [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) dan library-library terkait

_Codebase_ yang dipakai berasal dari [sf-chain](https://github.com/15Dkatz/sf-chain) oleh [David Katz](https://davidtkatz.com/#/)

## Semangat!!! :fire: :fire:

---

Jalankan ```npm install``` terlebih dahulu


Gunakan ```git bash``` atau ```cmder``` atau ``` linux terminal``` buat ngejalanin perintah di bawah ini. Masing-masing pada terminal terpisah 


## Penambahan Node: 

##### Node pertama: 

```HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev```

##### Node Kedua (Node pertama harus jalan dlu) 

```HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev```

##### Node Ketiga (Node pertama & kedua harus jalan dlu) 

```HTTP_PORT=3004 P2P_PORT=5004 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003 npm run dev```

##### Dan seterusnya 

```HTTP_PORT=3005 P2P_PORT=5005 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003,ws://localhost:5004 npm run dev```
