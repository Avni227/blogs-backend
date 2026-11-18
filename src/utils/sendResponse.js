const sendResponse = (req, statusCode, message, data = null, pagination = null)=>{
  return req.status(statusCode).json({
    message,
    data,
  });
};   

export default sendResponse