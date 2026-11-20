const sendResponse = (res, statusCode, message, data = null, pagination = null)=>{
  return res.status(statusCode).json({
    message,
    data,
    ...(pagination && { pagination })
  });
};   

export default sendResponse