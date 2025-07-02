const mongoose = require('mongoose');

// Use a variável de ambiente MONGODB_URI, ou um valor padrão para desenvolvimento
const uri = process.env.MONGODB_URI || 'mongodb+srv://paulohds:LUSmJ6axynbvxgmQ@bigdatas.d4ehaca.mongodb.net/castros?retryWrites=true&w=majority&appName=Bigdatas';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB Atlas!');
});

module.exports = mongoose; 
