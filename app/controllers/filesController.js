const { v4: uuidv4 } = require('uuid');
const dbQuery = require('../db/dbQuery');

const {isEmpty} =  require('../helpers/validations');
const {getUserId,
  deleteFile,
  createFiles,
  upload_photo} = require('./fileService');
const {
  errorMessage, successMessage, status,
} = require('../helpers/status');

const createfileByBookId = async (req, res) => {
  const book_id = req.params.book_id;
  const username = req.user.username;
  const user_id = await getUserId({username});

  try {
    const multerResponse = await upload_photo(req, res);
    if(multerResponse.status != 200){
      return res.status(multerResponse.status).send({error: multerResponse.message});
    }
    const dbResponse = await createFiles(multerResponse.files, book_id, user_id);
    if(dbResponse.length === 0){
      return res.status(status.conflict).send({error:"File existed"});
    }
    else{
      return res.status(status.created).send(dbResponse);
    }   
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    console.log(error);
    return res.status(status.error).send(errorMessage);
  }
};


const deleteFileById = async (req, res) => {
  const deleteFileByIdQuery = 'DELETE FROM files WHERE file_id = $1 and book_id=$2';
  const getFileByIdQuery = 'SELECT * FROM files WHERE file_id = $1 and book_id=$2';
  const bookId = req.params.book_id;
  const fileId = req.params.image_id;
  // GET USER id
  const username = req.user.username;
  const user_id = await getUserId({username});
  try {
    const { rows } = await dbQuery.query(getFileByIdQuery, [fileId, bookId]);
    if(rows[0]===undefined){
      return res.status(status.bad).send({"error" :"File is not existed"});
    }   
    const s3_object_name = rows[0]["s3_object_name"]
    await dbQuery.query(deleteFileByIdQuery, [fileId, bookId]);
    deleteFile(s3_object_name);
    return res.status(status.nocontent).send("File Deleted");
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    console.log(error);
    return res.status(status.error).send(errorMessage);
  }

};
  

module.exports =  {
  createfileByBookId,
  deleteFileById
};