import dataUriParser from 'datauri/parser'
import path from 'path'

export const getDataUri =(file:Express.Multer.File)=>{
    const parsar= new dataUriParser();
    const extName= path.extname(file.originalname).toString();
    return parsar.format(extName, file.buffer).content || ''
}