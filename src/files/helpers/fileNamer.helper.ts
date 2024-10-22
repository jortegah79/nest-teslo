import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension=file.mimetype.split('/')[1];
    
    const fileName=`${ uuid()}.${fileExtension}`;
    
    //const fecha=new Date();
    
    //const fileName=`${fecha.getUTCFullYear()}${fecha.getMonth()+1}${fecha.getDate()}${fecha.getHours()}${fecha.getUTCMinutes()}${fecha.getUTCSeconds()}.${fileExtension}`;
      
    
    callback(null, fileName);
}