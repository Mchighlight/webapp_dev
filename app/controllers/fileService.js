const config = require('../config');
const AWS = require('aws-sdk');
const fs = require('fs');
const uploadFile = require("../middlewares/upload");
const dbQuery = require('../db/dbQuery');
const baseUrl = "http://localhost:3001/files/";
const del = require('del');
const { v4: uuidv4 } = require('uuid');

const uploadFileS3 = async (filename, s3_object_name)=> {
  const s3 = new AWS.S3({
      accessKeyId: config.S3_ID,
      secretAccessKey: config.S3_SECRET
  });

  // Read content from the file
  const fileContent = fs.readFileSync(filename);

  // Setting up S3 upload parameters
  const params = {
      Bucket: config.BUCKET_NAME,
      Key: s3_object_name, // File name you want to save as in S3
      Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
}

const deleteFile = async (s3_object_name)=> {
  const s3 = new AWS.S3({
      accessKeyId: config.S3_ID,
      secretAccessKey: config.S3_SECRET
  });

    // Setting up S3 upload parameters
  const params = {
      Bucket: config.BUCKET_NAME,
      Key: s3_object_name, // File name you want to save as in S3
  };

  // Uploading files to the bucket
  s3.deleteObject(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`Delete File successfully. ${data.Location}`);
  });
}

const getUserId = async (user)=> {
    const getUserIdQuery = 'SELECT id FROM users WHERE email = $1';
    try {
        const username = user['username'] ;
        const { rows } = await dbQuery.query(getUserIdQuery, [username]);
        const dbResponse = rows[0];
        return dbResponse.id ;
      } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
      }
}

const isMultipleUpload = async (files, book_id, user_id)=> {
  const getFilesNameByIdQuery = `select  file_name
  from files where book_id = $1 and user_id = $2`;
  const dbFileNames = [] ;
  try {
    const { rows } = await dbQuery.query(getFilesNameByIdQuery, [book_id, user_id]);
    rows.forEach(file_name=>dbFileNames.push(file_name['file_name']));
    let isFounded = files.some( ai => dbFileNames.includes(ai) );
    return isFounded
    } catch (error) {
      console.log(error);
    }
}

const upload_photo = async (req, res)=> {
  try {
    await uploadFile(req, res);
    if (req.files[0] === undefined) {
      return { status: 400, message: "Please upload a file!" };
    }

    const files = [] ;
    req.files.forEach(e =>files.push(e.originalname));
  
    let hasDuplicate = files.some((val, i) => files.indexOf(val) !== i);
    if( hasDuplicate === true ){
      await remove_local_photo();
      return { status: 400, message: "Please do not upload multiple duplicate file" };
    }

    return { status: 200,
       message: "Uploaded the file successfully: ", files :files };
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return { status: 500, message: "File size cannot be larger than 2MB!" };
    }

    return { status: 400, 
      message: `Could not upload the file: ${req.file.originalname}. ${err}` };
  }
}

const remove_local_photo = async ()=> {
  const dir = __basedir + "/public/uploads/"
  try {
      await del(dir);

      console.log(`${dir} is deleted!`);
      await fs.promises.mkdir(dir, { recursive: true })
  } catch (err) {
      console.error(err);
  }
}

const createFiles = async (files, book_id, user_id)=> {
  const response = [] ;
  const createFileQuery = `INSERT INTO
      files(file_id, s3_object_name, file_name, created_date, user_id, book_id)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;

  try {
      if(await isMultipleUpload( files ,book_id, user_id)){
        await remove_local_photo();
        return response;
      }

      let s3_timer = new Date() ;
      for( let i=0 ; i < files.length ; i++ ){
        const file_created = new Date().toISOString();
        const s3_object_name = `${uuidv4()}___${files[i]}` ;
        const values = [
          uuidv4(), // file_id
          s3_object_name,
          files[i],
          file_created,
          user_id,
          book_id
        ];
        
        const { rows } = await dbQuery.query(createFileQuery, values);
        const dbResponse = rows[0];
        response.push(dbResponse);
        await uploadFileS3(  __basedir + `/public/uploads/${files[i]}` ,s3_object_name);
        
      }

      // Logging
      setTimeout(function () {
        sdc.timing('createBookImageS3.timer', s3_timer);
      }, 100 * Math.random());
      //* Logging
      await remove_local_photo();
      return response;
    } catch (error) {
      console.log(error);
    }
}

module.exports = {
    getUserId,
    deleteFile,
    upload_photo,
    createFiles
};