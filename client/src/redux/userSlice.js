import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id : "",
    name : "",
    email : "",
    profile_pic : "",
    token : "",
    onlineUser : [],
    socketConnection : null 
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser : (state,action)=>{
            state._id = action.payload._id
            state.name = action.payload.name
            state.email = action.payload.email 
            state.profile_pic = action.payload.profile_pic
        },
        setToken : (state,action)=>{
            state.token = action.payload 
        },
        logout : (state,action)=>{
            state._id = ""
            state.name = ""
            state.email = ""
            state.profile_pic = ""
            state.token = ""
            state.socketConnection = null 
        },
        setOnlineUser : (state,action)=>{
            state.onlineUser = action.payload
        },
        setSocketConnection : (state,action)=>{
            state.socketConnection = action.payload  
        }
    }, 
})

//action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions

export default userSlice.reducer; 




//updated code

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   _id: "",
//   name: "",
//   email: "",
//   profile_pic: "",
//   token: "",
//   onlineUser: [],
//   socketConnection: null,
//   socketConnecting: false,  // New state for tracking socket connection status
// };

// export const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state._id = action.payload._id;
//       state.name = action.payload.name;
//       state.email = action.payload.email;
//       state.profile_pic = action.payload.profile_pic;
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//     },
//     logout: (state) => {
//       state._id = "";
//       state.name = "";
//       state.email = "";
//       state.profile_pic = "";
//       state.token = "";
//       state.socketConnection = null;
//     },
//     setOnlineUser: (state, action) => {
//       state.onlineUser = action.payload;
//     },
//     setSocketConnection: (state, action) => {
//       state.socketConnection = action.payload;
//     },
//     setSocketConnecting: (state, action) => {
//       state.socketConnecting = action.payload;  // To manage the socket connection status
//     },
//     setSocketConnected: (state, action) => {
//       state.socketConnected = action.payload;  // To manage the socket connection status
//     },
//   },
// });

// export const { setUser, setToken, logout, setOnlineUser, setSocketConnection, setSocketConnecting, setSocketConnected } = userSlice.actions;

// export default userSlice.reducer;
