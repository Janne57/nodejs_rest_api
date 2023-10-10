const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");
const { AppError } = require("../utils/index");
const fse = require("fs-extra");
// const sharp = require("sharp");
const Jimp = require("jimp");


// 1 variant
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, "public/avatars");
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split("/")[1];
//     cbk(null, `${req.user.id}.${extension}`)
//   },
// });

// const multerFilter = (req, file, cbk) => {
//   if (file.mimetype.startsWith('image/')) {
//     cbk(null, true)
//   } else {
//     cbk(new AppError(400, 'Download only images!'), false);
//   }
// }

// exports.upLoadUserAvatars = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
// }).single("avatar");

// 2variant
class ImageService {
  static initUpLoaderMdwr(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith("image/")) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, "Download only images!"), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, options, ...pathSegments) {
    if (
      file.size >
      (options?.maxsize ? options.maxsize * 1024 * 1024 : 1 * 1024 * 1024)
    ) {
      throw new AppError(400, "File is too large..");
    }

    const fileName =`${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), ...pathSegments);

    await fse.ensureDir(fullFilePath);
    // await sharp(file.buffer)
    // .resize({ height: options?.height || 250, width: options?.width || 250 })
    // .toFormat('jpeg')
    // .jpeg({ quality: 100 })
    // .toFile(path.join(fullFilePath, fileName));


Jimp.read(file.buffer)
  .then((avatar) => {

    return avatar
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(path.join(fullFilePath, fileName)); // save
  })
  .catch((err) => {
    console.error(err);
  });
    
    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
