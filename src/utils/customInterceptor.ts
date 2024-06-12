import axios from 'axios';
const axiosCall = async (data) => {
  try {
    const config = {
      method: 'post',
      url: process.env.SERVICE_REQ_RES + ':' + process.env.SERVICE_REQ_RES_PORT,
      data: data,
    };

  
  } catch (err) {
    // console.log(err);
  }
};

const logData = async (req, data) => {
  console.log(data);
  let params;
  if (Object.keys(req.params).length !== 0) {
    params = req.params;
  } else if (Object.keys(req.query).length !== 0) {
    params = req.query;
  } else if (Object.keys(req.body).length !== 0) {
    params = req.body;
  }
 
  // await axiosCall(dataForAxios);
};

export const CustomInterceptor = (req, res, next) => {
  const oldSend = res.send;
 
  // if (next)
  next();
};
