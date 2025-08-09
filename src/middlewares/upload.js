import multer from 'multer';

const storage = multer.memoryStorage(); // файли будуть зберігатися в пам’яті для прямої передачі в Cloudinary

const upload = multer({ storage });

export default upload;
