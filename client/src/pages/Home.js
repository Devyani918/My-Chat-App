// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux'
// import { Outlet, useNavigate, useLocation } from 'react-router-dom'; 
// import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
// import Sidebar from '../components/Sidebar';
// import logo from '../assets/logo.png';
// import io from 'socket.io-client';

// const Home = () => {  
//   const user = useSelector(state => state.user)
//   const dispatch = useDispatch() 
//   const navigate = useNavigate() 
//   const location = useLocation()
       
//   console.log('user',user)
//   const fetchUserDetails = async()=> {
//     try {
//       const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
//       const response = await axios({ 
//       url : URL,
//       withCredentials : true 
//       })

//       dispatch(setUser(response.data.data))

//        if(response.data.data.logout){
//          dispatch(logout())
//          navigate("/email")
//        }
               
//       console.log("current user Details",response)
//     } catch (error) {  
//        console.log("error",error) 
//     }
//   }
 
//   useEffect(()=>{  
//     fetchUserDetails()    
//   },[])

//   /***socket connection */
//   useEffect(()=>{
//     const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
//       auth : {
//         token : localStorage.getItem('token')
//       }
//     })

//     socketConnection.on('onlineUser',(data)=>{
//       console.log(data)
//       dispatch(setOnlineUser(data)) 
//     })

//     dispatch(setSocketConnection(socketConnection))   

//     return ()=>{
//       socketConnection.disconnect() 
//     }
//   },[]) 

//   const basePath = location.pathname === '/'
//   return (
//     <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
//       <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
//         <Sidebar/>
//       </section>
                                                               
//       {/* message component */}  
//       <section className={`${basePath && "hidden"}`}>
//         <Outlet/> 
//       </section>

//       <div className={`justify-center items-center flex-col gap-3 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
//           <div>
//             <img
//               src={logo}
//               width={250}
//               alt='logo'
//             />
//           </div>
//           <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
//       </div>
//     </div>
//   )
// }
                       
// export default Home; 



// code 1 edited before socket cors
// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom'; 
// import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
// import Sidebar from '../components/Sidebar';
// import logo from '../assets/logo.png';
// import io from 'socket.io-client';

// const Home = () => {  
//   const user = useSelector(state => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); 
//   const location = useLocation();
  
//   console.log('user', user);

//   // Fetch user details from the backend
//   const fetchUserDetails = async () => {
//     try {
//       const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
//       const response = await axios({
//         url: URL,
//         withCredentials: true,
//       });

//       if (response.data && response.data.data) {
//         dispatch(setUser(response.data.data));

//         // Check if the user is logged out from the server
//         if (response.data.data.logout) {
//           dispatch(logout());
//           navigate("/email");
//         }

//         console.log("current user Details", response);
//       } else {
//         // Handle unexpected response structure or data
//         console.log("User data is missing or invalid.");
//         navigate("/login"); // Redirect to login if necessary
//       }
//     } catch (error) {
//       console.log("Error fetching user details:", error);
//       navigate("/login"); // Redirect to login if there is an error
//     }
//   };
  
//   useEffect(() => {
//     fetchUserDetails();
//   }, []);
  
//   // Socket connection setup
//   useEffect(() => {
//     const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
//       auth: {
//         token: localStorage.getItem('token'),
//       },
//     });

//     socketConnection.on('onlineUser', (data) => {
//       console.log(data);
//       dispatch(setOnlineUser(data)); 
//     });

//     dispatch(setSocketConnection(socketConnection));

//     return () => {
//       socketConnection.disconnect();
//     };
//   }, []);
  
//   const basePath = location.pathname === '/';
  
//   return (
//     <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
//       <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
//         <Sidebar />
//       </section>

//       {/* Message Component */}
//       <section className={`${basePath && "hidden"}`}>
//         <Outlet /> 
//       </section>

//       {/* Logo and text for the home page */}
//       <div className={`justify-center items-center flex-col gap-3 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
//         <div>
//           <img
//             src={logo}
//             width={250}
//             alt='logo'
//           />
//         </div>
//         <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
//       </div>
//     </div>
//   );
// };
                       
// export default Home;




//code 2 edited after socket cors
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; 
import { logout, setOnlineUser, setSocketConnection, setUser, setSocketConnecting, setSocketConnected } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client';

const Home = () => {  
  const { socketConnecting, socketConnected } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const location = useLocation();
  
  console.log('user', useSelector(state => state.user));

  // Fetch user details from backend
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        dispatch(setUser(response.data.data));

        if (response.data.data.logout) {
          dispatch(logout());
          navigate("/email");
        }

        console.log("current user Details", response);
      } else {
        console.log("User data is missing or invalid.");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
      navigate("/login");
    }
  };
  
  useEffect(() => {
    fetchUserDetails();
  }, []);
  
  // Socket connection setup
  useEffect(() => {
    dispatch(setSocketConnecting(true)); // Start connecting

    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['polling', 'websocket'], // 👈 Enable both
      withCredentials: true,
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected');
      dispatch(setSocketConnected(true));
      dispatch(setSocketConnecting(false));
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
      dispatch(setSocketConnected(false));
      dispatch(setSocketConnecting(true));
    });

    socketConnection.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
      dispatch(setSocketConnected(false));
      dispatch(setSocketConnecting(true));
    });

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data)); 
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);
  
  const basePath = location.pathname === '/';
  
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      
      {/* Show connecting spinner */}
      {socketConnecting && !socketConnected && (
        <div className="fixed inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
          <img src={logo} alt="logo" width={100} className="animate-spin" />
          <p className="mt-4 text-slate-700 font-semibold text-lg">Connecting...</p>
        </div>
      )}

      {/* Sidebar */}
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/* Message Component */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet /> 
      </section>

      {/* Logo and Text for Home */}
      <div className={`justify-center items-center flex-col gap-3 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img
            src={logo}
            width={250}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>

    </div>
  );
};
                       
export default Home;