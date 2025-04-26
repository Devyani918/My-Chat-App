// const express = require('express')
// const { Server } = require('socket.io')
// const http = require('http')
// const UserModel = require('../models/UserModel');
// const { ConversationModel, MessageModel } = require('../models/ConversationModel');
// const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
// const getConversation = require('../helpers/getConversation');

// const app = express()

// /**socket connection */
// const server = http.createServer(app)
// const io = new Server(server,{
//     cors : {
//         origin : process.env.FRONTEND_URL,
//         credentials : true
//     }
// })

// /***
//  * socket running at http//localhost:8080/
//  */

// //online user
// const onlineUser = new Set()

// io.on('connection',async(socket)=>{
//     console.log("connect User",socket.id)

//      const token = socket.handshake.auth.token

//      //current user details
//      const user = await getUserDetailsFromToken(token)

//      //create a room
//      socket.join(user?._id.toString())
//      onlineUser.add(user?._id?.toString()) 

//      io.emit('onlineUser',Array.from(onlineUser))

//      socket.on('message-page',async(userId)=>{
//         console.log('userId',userId) 
//         const userDetails = await UserModel.findById(userId).select("-password")

//         const payload = {
//             _id : userDetails?._id,
//             name : userDetails?.name,
//             email : userDetails?.email,
//             profile_pic : userDetails?.profile_pic,
//             online : onlineUser.has(userId)
//         }
//         socket.emit('message-user', payload)

//         //get previous message
//         const getConversationMessage = await ConversationModel.findOne({
//             "$or" : [
//                 { sender : user?._id, receiver : userId },
//                 { sender : userId, receiver :  user?._id}
//             ]
//         }).populate('messages').sort({ updatedAt : -1 })

//         socket.emit('message',getConversationMessage?.messages || []) 
//      }) 

//      //new message
//      socket.on('new message',async(data)=>{

//     //check conversation is available both user
     
//     let conversation = await ConversationModel.findOne({
//        "$or" : [
//         { sender : data?.sender, receiver : data?.receiver },
//         { sender : data?.receiver, receiver : data?.sender } 
//        ]
//     })
   
//     //if conversation is not available
//     if(!conversation){
//         const createConversation = await ConversationModel({
//             sender : data?.sender,
//             receiver : data?.receiver
//         })
//         conversation = await createConversation.save()
//     }

//     const message = await MessageModel({
//         text : data.text,
//         imageUrl : data.imageUrl,
//         videoUrl : data.videoUrl,
//         msgByUserId : data?.msgByUserId,
//     })
//     const saveMessage = await message.save()

//     const updateConversation = await ConversationModel.updateOne({_id : conversation?._id},{
//         "$push" : { messages : saveMessage?._id } 
//     })
       
//     const getConversationMessage = await ConversationModel.findOne({
//         "$or" : [
//             { sender : data?.sender, receiver : data?.receiver },
//             { sender : data?.receiver, receiver : data?.sender }
//         ]
//     }).populate('messages').sort({ updateAt : -1 })  

//     io.to(data?.sender).emit('message',getConversationMessage?.messages || [])
//     io.to(data?.receiver).emit('message',getConversationMessage?.messages || []) 

//     //send conversation
//     const conversationSender = await getConversation(data?.sender)
//     const conversationReceiver = await getConversation(data?.sender) 
    
//     io.to(data?.sender).emit('conversation',conversationSender)
//     io.to(data?.receiver).emit('conversation',conversationReceiver)
// })


// //sidebar
// socket.on('sidebar',async(currentUserId)=>{
//     console.log("current user",currentUserId)

//     const conversation = await getConversation(currentUserId)

//     socket.emit('conversation',conversation)

// }) 

// socket.on('seen',async(msgByUserId)=>{

//     let conversation = await ConversationModel.findOne({
//         "$or" : [
//             { sender : user?._id, receiver : msgByUserId },
//             { sender : msgByUserId, receiver : user?._id }
//         ]
//     })

//     const conversationMessageId = conversation?.messages || []

//     const updateMessages = await MessageModel.updateMany(
//         { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
//         { "$set" : { seen : true }}
//     )

//     //send conversation
//     const conversationSender = await getConversation(user?._id?.toString())
//     const conversationReceiver = await getConversation(msgByUserId) 
    
//     io.to(user?._id?.toString()).emit('conversation',conversationSender)
//     io.to(msgByUserId).emit('conversation',conversationReceiver)

// })

//     //disconnect
//     socket.on('disconnect',()=>{
//         onlineUser.delete(user?._id?.toString()) 
//         console.log('disconnect user ',socket.id) 
//     })
// })

// module.exports = {
//     app,
//     server
// }



const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const getConversation = require('../helpers/getConversation');

const app = express();
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'], // Allow both polling and websocket
});

// Online users
const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('🔵 New user connected:', socket.id);

  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user) {
      console.log('Invalid token. Disconnecting...');
      socket.disconnect();
      return;
    }

    const userIdStr = user._id.toString();
    socket.join(userIdStr);
    onlineUser.add(userIdStr);

    io.emit('onlineUser', Array.from(onlineUser));

    // Load user data when message page opens
    socket.on('message-page', async (userId) => {
      console.log('Message page opened for:', userId);

      const userDetails = await UserModel.findById(userId).select('-password');
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit('message-user', payload);

      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: userIdStr, receiver: userId },
          { sender: userId, receiver: userIdStr },
        ],
      }).populate('messages').sort({ updatedAt: -1 });

      socket.emit('message', conversation?.messages || []);
    });

    // Handle sending new message
    socket.on('new message', async (data) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      if (!conversation) {
        conversation = await new ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        }).save();
      }

      const message = await new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      }).save();

      await ConversationModel.updateOne(
        { _id: conversation._id },
        { $push: { messages: message._id } }
      );

      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      }).populate('messages').sort({ updatedAt: -1 });

      // Send updated messages to sender and receiver
      io.to(data?.sender).emit('message', updatedConversation?.messages || []);
      io.to(data?.receiver).emit('message', updatedConversation?.messages || []);

      // Update sidebar
      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit('conversation', conversationSender);
      io.to(data?.receiver).emit('conversation', conversationReceiver);
    });

    // Sidebar conversations
    socket.on('sidebar', async (currentUserId) => {
      console.log('Sidebar requested by:', currentUserId);

      const conversation = await getConversation(currentUserId);
      socket.emit('conversation', conversation);
    });

    // Seen messages
    socket.on('seen', async (msgByUserId) => {
      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: userIdStr, receiver: msgByUserId },
          { sender: msgByUserId, receiver: userIdStr },
        ],
      });

      const conversationMessageIds = conversation?.messages || [];

      await MessageModel.updateMany(
        { _id: { $in: conversationMessageIds }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      const conversationSender = await getConversation(userIdStr);
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(userIdStr).emit('conversation', conversationSender);
      io.to(msgByUserId).emit('conversation', conversationReceiver);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      onlineUser.delete(userIdStr);
      io.emit('onlineUser', Array.from(onlineUser));
    });

  } catch (error) {
    console.error('Socket error:', error);
    socket.disconnect();
  }
});

module.exports = { app, server };