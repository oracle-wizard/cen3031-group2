import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
    withCredentials: true,
    timeout:5000,
    headers:{
        'Content-Type':'application/json'
    }, 
});

api.interceptors.request.use(
  config=>{
    const token = localStorage.getItem('accessToken');
    if(token) {//ataches the token header only if the token exists, wont interfere with non protected routes such as auth itself
      console.log("New request has been made. ")
        console.log(token)
        config.headers.Authorization =`Bearer ${token}`;}
    else{
      console.log("No token in request.")
    }

    return config;
    },
    error=>{
        console.log(`Error in api request. ${error}`);
        return Promise.reject(error);
    }

)
api.interceptors.response.use((response) => {
    console.log("Returning response successfully.")
    return response
  }, 
  async function (error) {
    console.log(` error.reponse.status = ${error.response.status}`)
    console.log(document.cookie)
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try{const response = await api.post('/refresh-token', {
        withCredentials: true
      });   

      axios.defaults.headers.common['Authorization'] =  response.data.token
      localStorage.removeItem('accessToken');
      localStorage.setItem('accessToken',  response.data.token);
      return api(originalRequest);
      }
      catch(err){
        window.location.href = "http://localhost:5173/login"
        return Promise.reject(error);}
    }});

export default api;

