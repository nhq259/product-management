const User = require("../../models/user.model.js");
const RoomChat = require("../../models/rooms-chat.model.js");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false,
  });
  console.log(listRoomChat);
  


  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng chat",
    listRoomChat:listRoomChat
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  // console.log(res.locals.user);

  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false,
    }).select("fullName avatar");
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Tạo phòng chat",
    friendList: friendList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  for (const userId of usersId) {
    dataRoom.users.push({
      user_id: userId,
      role: "user",
    });
  }

  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });

  // console.log(title, usersId);
  console.log(dataRoom);
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};
