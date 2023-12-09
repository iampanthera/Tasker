import multer from 'multer';

import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, 'files')); // Save files in the src/files directory
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, file.originalname); // Set the filename to the original name of the uploaded file
  },
});

const upload = multer({ storage: storage });

export default upload;
