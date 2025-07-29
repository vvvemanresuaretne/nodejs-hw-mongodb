import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../schemas/authSchemas.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
