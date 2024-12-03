const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 80;

app.use("/public",express.static(path.join(__dirname,"public")));
// Configuração do Multer para armazenamento temporário
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Diretório onde o arquivo será armazenado temporariamente
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nome único para o arquivo
    }
});
const upload = multer({ storage: storage });

// Rota para receber o arquivo M4A e convertê-lo para MP3
app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const inputPath = req.file.path;
    const outputPath = 'uploads/' + Date.now() + '.mp3';  // Caminho do arquivo de saída

    // Usando o FFmpeg para converter M4A para MP3
    ffmpeg(inputPath)
        .output(outputPath)
        .audioCodec('libmp3lame')  // Codec de áudio para MP3
        .on('end', () => {
            // Após a conversão, envia o arquivo convertido para o cliente
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Erro ao enviar o arquivo:', err);
                }
                // Exclui os arquivos temporários após o envio
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Erro na conversão:', err);
            res.status(500).send('Erro ao converter o arquivo.');
        })
        .run();
});

// Rota para verificar o status do servidor
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/public/index.html");
    // res.send('Servidor Express está rodando.');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
