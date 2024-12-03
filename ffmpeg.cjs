const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

// Endpoint que o servidor local irá acessar
app.post('/process', (req, res) => {
    const { data } = req.body;
    console.log('Dados recebidos no Worker:', data);
    
    // Processar os dados no background (pode ser uma tarefa assíncrona)
    // Aqui, você pode adicionar lógica de processamento, como armazenar em banco, etc.

    res.status(200).json({ message: 'Dados processados com sucesso!' });
});
app.listen(PORT, () => {
    console.log(`Worker rodando na porta ${PORT}`);
});
