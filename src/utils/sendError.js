const sendError = (res, error)=>{
    return res.status(500).json({
       message:error.message || "internal server error"
    })
}
  export default sendError