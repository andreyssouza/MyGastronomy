<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/57d4262d-77ac-4c14-a519-58fa9175907f" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/932e81b2-a65b-4293-8e59-0f0d9d56897e" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/eeb43718-f661-4d82-9223-b186aa7bc2df" />




# 🍽️ MyGastronomy

Aplicativo full-stack para gerenciamento de restaurante com autenticação JWT, validação de inputs e 24 testes automatizados.

**🌐 Deploy:backend** https://mygastronomybackend-gpdefehac6ayb0b0.italynorth-01.azurewebsites.net/

**🌐 Deploy:frontend** https://mygastronomyfrontend-btb5enhubsaxgqfb.italynorth-01.azurewebsites.net/

---

## ✨ Destaques

- ✅ 24 Testes Automatizados (15 backend + 9 frontend)
- ✅ Validação com Joi em todos os endpoints
- ✅ Autenticação JWT + Hash PBKDF2
- ✅ Full-Stack pronto para produção
- ✅ Deploy no Azure funcionando
- ✅ CORS configurado

---

## 🚀 Stack

**Backend:** Node.js • Express • MongoDB • JWT • Joi • Jest  
**Frontend:** React 19 • Vite • React Router • Material-UI • Vitest  
**DevOps:** GitHub Actions • Azure • Docker

---

## 🛠️ Como Rodar

### Backend
```bash
cd backend
npm install
# Crie .env com: PORT=3000, MONGO_CS, JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Crie .env com: VITE_API_URL=http://localhost:3000
npm run dev
```

---

## 🧪 Testes

### Backend (15 testes)
```bash
cd backend
npm test
```

**Testa:** Autenticação (5) • Pratos (5) • Rota raiz (1) + 4 validação

### Frontend (9 testes)
```bash
cd frontend
npm test
```

**Testa:** PlateCard (3) • Home (6)

---

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/signup` | Registrar usuário |
| POST | `/auth/login` | Fazer login |
| GET | `/plates` | Listar pratos |
| POST | `/plates` | Criar prato |
| GET | `/plates/availables/` | Pratos disponíveis |
| PUT | `/plates/:id` | Atualizar prato |
| DELETE | `/plates/:id` | Deletar prato |

---

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senha PBKDF2 (310k iterações)
- ✅ Validação com Joi
- ✅ CORS configurado
- ✅ Variáveis de ambiente
- ✅ Tratamento de erros estruturado

---

## 📊 Estrutura

```
MyGastronomy/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── dataAccess/
│   │   ├── helpers/validators.js
│   │   └── database/
│   └── tests/
│       ├── auth.test.js (5)
│       ├── plates.test.js (5)
│       └── root.test.js (1)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── __tests__/ (3)
    │   ├── pages/
    │   │   └── __tests__/ (6)
    │   ├── services/
    │   └── contexts/
    └── vite.config.js
```

---

## 📡 Exemplos de Requisição

### Signup
```bash
POST /auth/signup
{
  "fullname": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

### Criar Prato
```bash
POST /plates
{
  "name": "Pasta Carbonara",
  "description": "Italian classic",
  "price": 25.50,
  "available": true
}
```

---

## ✅ Funcionalidades

- Registrar e fazer login
- Catálogo de pratos (CRUD)
- Filtrar pratos disponíveis
- Carrinho de compras (Context API)
- Pedidos
- Validação de inputs
- Testes automatizados

---

## 🚢 Deploy

### Azure (Backend)
```bash
git push origin main
# Deploy automático
```

### Frontend
- Vercel: `vercel deploy`
- Azure Static Web Apps
- GitHub Pages

---

## 🎯 Métricas

| Item | Valor |
|------|-------|
| Testes | 24 ✅ |
| Endpoints | 12+ |
| Validações | 8+ regras |
| Stack | Full-Stack |
| Deploy | Produção ✅ |

---

## 📝 Como Contribuir

```bash
git checkout -b feature/minha-feature
git commit -m "feat: descrição"
git push origin feature/minha-feature
```

**Padrão:** `feat:` • `fix:` • `test:` • `docs:` • `style:` • `refactor:`

---

## 👨‍💻 Autor

**Andrey Souza** — Desenvolvedor Full-Stack

- GitHub: [@andreyssouza](https://github.com/andreyssouza)
- Repositório: [MyGastronomy](https://github.com/andreyssouza/MyGastronomy)

---

## 📄 Licença

ISC License

---

**Feito em Node.js + React** 
