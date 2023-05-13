const Conversation = require('../models/Conversation');
const { User } = require('../models/User');
const { json, response } = require('express');
const { getPagination } = require('../../utils/Pagination');
const Message = require('../models/Message');
const mongoose = require("mongoose");
const { populate } = require('../models/Conversation');
const createError = require('http-errors');
const Joi = require('joi');
const { populateConversation } = require('../../utils/Populate/Conversation');
const console = require('console');
const File = require('../models/File');
const { getListData } = require('../../utils/Response/listData');
const getLocationByIPAddress  = require('../../configs/location');
const IP = require('ip');
const geoip = require('geoip-lite');
class ConversationController {

    // TODO: Leave conversation
    async leaveConversation(req, res, next) {
        try {
            const conversation = await Conversation.findById(req.params.id);
            let index = -1;
            index = conversation.members.findIndex(item => item.user.toString() === req.user._id.toString());
            if (index !== -1) {
                conversation.members.splice(index, 1);
                const adminOfConversation = conversation.members.find(member => member.role === 'admin');
                if (adminOfConversation.length === 1 && adminOfConversation.user.toString() === req.user._id.toString()) {
                    //set all members to admin
                    conversation.members.forEach(member => {
                        member.role = 'admin';
                    });
                }
                await conversation.save();
                res.status(200).send("Bạn đã rời khỏi cuộc trò chuyện này");
            } else {
                return res.status(404).send("Bạn không có cuộc hội thoại này");
            }

        } catch (err) {
            console.error(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }

    //Delete all messages of conversation with user
    async userDeletedAllMessages(req, res, next) {
        try {
            const conversation = await Conversation.findById(req.params.id);
            if (conversation.members.some(member => member.user.toString() === req.user._id.toString())) {
                var index = -1;
                index = conversation.user_deleted.findIndex(item => item.userId.toString() === req.user._id.toString());
                if (index !== -1) {
                    conversation.user_deleted[index].deletedAt = Date.now();
                } else {
                    conversation.user_deleted.push({ userId: req.user._id });
                }
                await conversation.save();
                res.status(200).send("Đã xóa cuộc hội thoại cho User");
            } else {
                res.status(404).send("Bạn không có có cuộc hội thoại này");
            }
        } catch (err) {
            console.error(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }

    // [Post] add a new conversation
    async add(req, res, next) {
        //validate request
        const schema = Joi.object({
            members: Joi.array().items(Joi.object({
                user: Joi.string().required(),
                nickname: Joi.string().min(3).max(100),
            })).required(),
            name: Joi.string(),
            avatar: Joi.string(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return next(createError.BadRequest(error.details[0].message));
        }

        //set addedBy to current user
        req.body.members.forEach(member => {
            member.addedBy = req.user._id;
        });

        const newConversation = new Conversation(req.body);
        newConversation.members.push({
            user: req.user._id,
            role: 'admin',
            addedBy: req.user._id,
        });
        newConversation.creator = req.user._id;

        try {
            if (newConversation.members.length < 2) {
                return res.status(400).send("Cuộc hội thoại phải có ít nhất 2 thành viên");
            } else if (newConversation.members.length === 2) {
                const allConversations = await Conversation.find();
                // Check conversation with 2 members. It's only 1
                var checked = false;
                //Get ID of conversation with 2 members is req.user._id and newConversation.members[0] if it's exist
                const convID = allConversations.map(conversation => {
                    if (conversation.members.length === 2 && conversation.members.some(member => member.user.toString() === req.user._id.toString()) && conversation.members.some(member => member.user.toString() === newConversation.members[0].user.toString())) {
                        checked = true;
                        return conversation._id;
                    }
                });
                console.log(convID);
                if (!checked) {
                    newConversation.history.push({
                        editor: req.user._id,
                        content: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
                    });
                    // save the conversation
                    const savedConversation = await newConversation.save();

                    //create message system
                    const messageSystem = new Message({
                        conversation: savedConversation._id,
                        text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
                        isSystem: true,
                    });
                    await messageSystem.save();

                    res.status(200).json(await populateConversation(savedConversation._id));
                } else {
                    const conversation = await populateConversation(convID);
                    res.status(200).json(conversation);
                }
            } else {
                newConversation.history.push({
                    editor: req.user._id,
                    content: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
                });
                // save the conversation
                const savedConversation = await newConversation.save();

                //create message system
                const messageSystem = new Message({
                    conversation: savedConversation._id,
                    text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
                    isSystem: true,
                });
                await messageSystem.save();

                res.status(200).json(await populateConversation(savedConversation._id));
            }
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));

        }
    }

    // [Get] get conv of a user
    async getConversationOfUser(req, res, next) {
        const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
        try {
            Conversation.paginate({
                members: {
                    $elemMatch: {
                        user: req.user._id
                    }
                }
            }, {
                offset, limit, sort: { updatedAt: -1 }, populate: [{
                    path: 'lastest_message',
                    populate: {
                        path: 'sender'
                    }
                }, {
                    path: 'members.user',
                    select: '_id fullname profilePicture isOnline',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                },
                {
                    path: 'avatar',
                },
                {
                    path: 'members.addedBy',
                    select: '_id fullname profilePicture',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                },
                {
                    path: 'members.changedNicknameBy',
                    select: '_id fullname profilePicture',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                }
                ]
            })
                .then((data) => {
                    getListData(res, data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving tutorials.",
                    });
                });
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }

    //[Get] get all conversations
    async getAll(req, res, next) {
        const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);

        Conversation.paginate({}, { offset, limit, sort: { updatedAt: -1 } })
            .then((data) => {
                getListData(res, data);
            })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                });
            });
    }

    //get conversation by id
    async getConversationById(req, res, next) {
        try {
            const conversation = await populateConversation(req.params.id);
            if (conversation.members.some(member => member.user._id.toString() === req.user._id.toString())) {
                res.status(200).json(conversation);
            } else {
                res.status(401).send('Bạn không có trong conversation này');
            }
        } catch (err) {
            console.error(err);
            res.status(404).json({ message: 'Không tìm thấy Conversation' });
        }
    }

    //get conversation include 2 members by user id
    async getConversationByUserIds(req, res, next) {
        try {
            //check user with params id is exist
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).send('Không tìm thấy User');
            }
            const query = {
                members: {
                    $elemMatch: {
                        user: req.user._id
                    },
                    $elemMatch: {
                        user: req.params.userId
                    }
                },
                members: { $size: 2 }
            };
            const conversation = await Conversation.findOne(query)
                .populate({
                    path: 'lastest_message',
                    populate: {
                        path: 'sender'
                    }
                })
                .populate({
                    path: 'members.user',
                    select: '_id fullname profilePicture isOnline',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                })
                .populate({
                    path: 'avatar',
                    select: '_id link'
                })
                .populate({
                    path: 'members.addedBy',
                    select: '_id fullname profilePicture',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                })
                .populate({
                    path: 'members.changedNicknameBy',
                    select: '_id fullname profilePicture',
                    populate: {
                        path: 'profilePicture',
                        select: '_id link'
                    }
                });
            if (conversation) {
                res.status(200).json(conversation);
            } else {
                //create new conversation with 2 members is req.user._id and req.params.userId
                const newConversation = new Conversation({
                    members: [
                        {
                            user: req.user._id,
                            role: "admin",
                            addedBy: req.user._id,
                            nickname: req.user.fullname,
                        },
                        {
                            user: req.params.userId,
                            role: "member",
                            addedBy: req.user._id,
                            nickname: user.fullname,
                        }
                    ],
                    creator: req.user._id,
                });
                //name of conversation is name of 2 members
                const user1 = await User.findById(req.user._id);
                const user2 = await User.findById(req.params.userId);
                newConversation.name = `${user1.fullname}, ${user2.fullname}`;
                //save the conversation
                const savedConversation = await newConversation.save();
                //create message system
                const messageSystem = new Message({
                    conversation: savedConversation._id,
                    text: `<b>${user1.fullname}</b> đã tạo cuộc hội thoại`,
                    isSystem: true,
                });
                await messageSystem.save();

                //populate conversation
                const conversation = await populateConversation(savedConversation._id);

                res.status(200).json(conversation);
            }
        } catch (err) {
            console.error(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }
    //[PUT] update conversation
    async update(req, res, next) {
        try {
            // validate request
            const schema = Joi.object({
                name: Joi.string().min(3).max(255),
                avatar: Joi.string().min(3).max(255),
                user_deleted: Joi.string(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const conversation = await Conversation.findById(req.params.id);
            if (conversation.members.some(member => member.user.toString() === req.user._id.toString())) {
                for (var key in req.body) {
                    var contentMessage = "";
                    if (key === 'avatar') {
                        contentMessage = "đổi avatar cho cuộc hội thoại này";
                    } else if (key === 'name') {
                        contentMessage = `đổi tên cuộc hội thoại này thành <b>${req.body[key]}</b>`;
                    }
                    conversation[key] = req.body[key];
                    // Check update
                    if (contentMessage != "") {
                        conversation.history.push({
                            editor: req.user._id,
                            content: `<b>${req.user.fullname}</b> ${contentMessage}`,
                        });

                        //create message system
                        const messageSystem = new Message({
                            conversation: req.params.id,
                            text: `<b>${req.user.fullname}</b> ${contentMessage}`,
                            isSystem: true,
                        });
                        await messageSystem.save();

                        //update lastest message
                        conversation.lastest_message = messageSystem._id;
                    }

                }
                await conversation.save();
                //populate
                const savedConversation = await populateConversation(conversation._id);
                res.status(200).json(savedConversation);
            } else {
                res.status(403).send('Bạn không nằm trong cuộc hội thoại này');
            }

        } catch (err) {
            console.error(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));

        }
    }

    //update members in conversation
    async updateMembers(req, res, next) {
        try {
            const conversation = await Conversation.findById(req.params.id);
            if (conversation.members.some(member => member.user.toString() === req.user._id.toString())) {
                const adminOfConversation = conversation.members.filter(member => member.role === "admin")
                    .map(member => member.user.toString());
                let contentMessage = "";
                //add members
                if (req.params.type === "add") {
                    //validate request
                    const schema = Joi.object({
                        newMembers: Joi.array().items(Joi.object({
                            user: Joi.string().required(),
                            nickname: Joi.string(),
                        })).required(),
                    });
                    const { error } = schema.validate(req.body);
                    if (error) {
                        return res.status(400).send(error.details[0].message);
                    }
                    //check member is exist in conversation
                    const membersOfConversation = conversation.members.map(member => member.user.toString());
                    const membersFromRequest = req.body.newMembers.map(member => member.user.toString());
                    const sameMembers = membersOfConversation.filter(member => membersFromRequest.includes(member));
                    if (sameMembers.length > 0) {
                        return res.status(403).send("Thành viên đã tồn tại trong cuộc hội thoại");
                    }
                    //set addedBy for new members
                    req.body.newMembers.forEach(member => {
                        member.addedBy = req.user._id;
                    });
                    //check members.length =2 => create new conversation
                    if (conversation.members.length == 2) {
                        const newConversation = new Conversation({
                            members: conversation.members.concat(req.body.newMembers),
                            name: req.body.name,
                            creator: req.user._id,
                        });

                        //create message system
                        const messageSystem = new Message({
                            conversation: newConversation._id,
                            text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại này`,
                            isSystem: true,
                        });

                        await messageSystem.save();

                        newConversation.lastest_message = messageSystem._id;
                        await newConversation.save();
                        //populate
                        const savedConversation = await populateConversation(newConversation._id);
                        return res.status(200).json(savedConversation);
                    }

                    conversation.members = conversation.members.concat(req.body.newMembers);
                    //get fullname of new member
                    const user = await User.findById(req.body.newMembers[0].user);
                    if (req.body.newMembers.length == 1) {
                        contentMessage = `đã thêm <b>${user.fullname}</b> vào cuộc hội thoại này`;
                    } else {
                        contentMessage = `đã thêm <b>${user.fullname}</b> và <b>${req.body.newMembers.length - 1}</b> thành viên khác vào cuộc hội thoại này`;
                    }
                } else if (req.params.type === "remove") {
                    //validate request
                    const schema = Joi.object({
                        userID: Joi.string().required(),
                    });
                    const { error } = schema.validate(req.body);
                    if (error) {
                        return res.status(400).send(error.details[0].message);
                    }
                    if (adminOfConversation.includes(req.user._id.toString())) {
                        //check if length of members is 2 => remove conversation
                        if (conversation.members.length == 2) {
                            await Conversation.findByIdAndDelete(req.params.id);
                            return res.status(200).json("Xóa cuộc hội thoại thành công");
                        }
                        //get nickname of user will be removed
                        const nickname = conversation.members.filter(member => member.user.toString() === req.body.userID.toString())
                            .map(member => member.nickname);
                        if (!nickname) {
                            //get fullname of user will be removed
                            const user = await User.findById(req.body.userID).select('fullname');
                            nickname = user.fullname;
                        }
                        contentMessage = `đã xóa ${nickname} khỏi cuộc hội thoại này`;
                        conversation.members = conversation.members.filter(member => member.user.toString() !== req.body.userID.toString());
                    } else {
                        return res.status(403).send("Bạn không có quyền xóa thành viên");
                    }
                } else if (req.params.type === "changeRole") {
                    //validate request
                    const schema = Joi.object({
                        userID: Joi.string().required(),
                        role: Joi.string().valid("admin", "member").required(),
                    });
                    const { error } = schema.validate(req.body);
                    if (error) {
                        return res.status(400).send(error.details[0].message);
                    }
                    if (adminOfConversation.includes(req.user._id.toString())) {
                        //get nickname of user will be removed
                        // const member = conversation.members.filter(member => member.user.toString() === req.body.userID.toString());
                        const index = conversation.members.findIndex(member => member.user.toString() === req.body.userID.toString());
                        let nickname = conversation.members[index].nickname;
                        if (!nickname) {
                            //get fullname of user will be removed
                            const user = await User.findById(req.body.userID).select('fullname');
                            nickname = user.fullname;
                        }
                        if (index > -1 && conversation.members[index].role !== req.body.role) {
                            conversation.members[index].role = req.body.role;
                            contentMessage = `đã thay đổi vai trò của <b>${nickname}</b> thành <b>${req.body.role}</b>`;
                        }
                    } else {
                        return res.status(403).send("Bạn không có quyền thay đổi vai trò thành viên");
                    }
                } else if (req.params.type === "changeNickname") {
                    //validate request
                    const schema = Joi.object({
                        userID: Joi.string().required(),
                        nickname: Joi.string().min(0).max(50),
                    });
                    const { error } = schema.validate(req.body);
                    if (error) {
                        return res.status(400).send(error.details[0].message);
                    }
                    //get nickname of user will be removed
                    const index = conversation.members.findIndex(member => member.user.toString() === req.body.userID.toString());
                    let nickname = conversation.members[index].nickname;
                    if (!nickname) {
                        //get fullname of user will be removed
                        const user = await User.findById(req.body.userID).select('fullname');
                        conversation.members[index].nickname = req.body.nickname;
                        conversation.members[index].changedNicknameBy = req.user._id;
                        contentMessage = `đã đổi tên hiển thị của <b>${user.fullname}</b> thành <b>${req.body.nickname}</b>`;

                    } else {
                        contentMessage = `đã thay đổi biệt danh của <b>${nickname}</b> thành <b>${req.body.nickname}</b>`;
                        conversation.members[index].nickname = req.body.nickname;
                        conversation.members[index].changedNicknameBy = req.user._id;
                    }
                } else {
                    return res.status(404).send("Không tìm thấy phương thức");
                }

                if (contentMessage != "") {
                    conversation.history.push({
                        editor: req.user._id,
                        content: `<b>${req.user.fullname}</b> ${contentMessage}`,
                    });

                    //create message system
                    const messageSystem = new Message({
                        conversation: req.params.id,
                        text: `<b>${req.user.fullname}</b> ${contentMessage}`,
                        isSystem: true,
                    });
                    await messageSystem.save();
                    //update last message
                    conversation.lastest_message = messageSystem._id;
                }

                await conversation.save();
                //populate
                const savedConversation = await populateConversation(conversation._id);
                res.status(200).json(savedConversation);

            } else {
                return res.status(403).send("Bạn không năm trong cuộc hội thoại này");
            }
        } catch (err) {
            console.error(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
        }
    }

    //[Delete] delete conversation
    async delete(req, res, next) {
        try {
            const conversation = await Conversation.findById(req.params.id);
            if (!conversation) {
                return res.status(404).json("Không tìm thấy cuộc hội thoại");
            }
            const adminOfConversation = conversation.members.filter(member => member.role === "admin")
                .map(member => member.user.toString());
            if (adminOfConversation.includes(req.user._id.toString())) {
                await conversation.delete();
                //delete all message in conversation
                await Message.deleteMany({ conversation: req.params.id });
                res.status(200).json(
                    conversation
                );
            } else {
                res.status(403).send("Bạn không có quyền xóa cuộc hội thoại này");
            }
        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));

        }
    }

    async getAllMedia(req, res, next) {
        try {
            const conversations = await Conversation.findById(req.params.id);
            if (!conversations) {
                return res.status(404).json("Không tìm thấy cuộc hội thoại");
            }
            const { limit, offset } = getPagination(req.query.page, req.query.size, req.query.offset);
            const memberOfConversation = conversations.members.filter(member => member.user.toString() === req.user._id.toString());
            if (memberOfConversation.length > 0) {
                const query = [{ conversation: req.params.id }];
                const mimeTypeOfMedia = ["image/png", "image/jpeg", "video/mp4", "video/x-matroska"];
                if (req.params.type === "media") {
                    query.push({ type: { $in: mimeTypeOfMedia } });
                } else if (req.params.type === "other") {
                    query.push({ type: { $nin: mimeTypeOfMedia } });
                } else {
                    return res.status(404).json("Không tìm thấy");
                }

                File.paginate({ $and: query }, {
                    limit, offset, sort: { createdAt: -1 },
                    populate: {
                        path: "creator",
                        select: "_id fullname profilePicture",
                        populate: {
                            path: "profilePicture",
                            select: "_id link",
                        },
                    },
                })
                    .then(data => {
                        getListData(res, data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving files."
                        });
                    });

            } else {
                res.status(403).send("Bạn không nằmm trong cuộc hội thoại này");
            }

        } catch (err) {
            console.log(err);
            return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));

        }

    }

    //[Post] Create random conversation fit profile, hometown or place of residence and user isOnline
    async createRandomConversation(req, res, next) {
        try {
            //check user online and 
            // const query = [
            //     { _id: { $ne: req.user._id } },
            //     {
            //         $or: [
            //         { "city": { $regex: req.query.key, $options: 'i' } },
            //         { "from": { $regex: req.query.key, $options: 'i' } },
            //         ]
            //     },
            //     { isOnline: true },
            // ];
            // User.aggregate(query).exec((err, data)=>{
            //     if (err) {
            //         console.log(err);
            //         return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
            //     }

            //     User.populate(data, [
            //         { path: 'profilePicture', select: '_id link' },
            //         { path: 'coverPicture', select: '_id link' },
            //     ], (err, data) => {
            //         if (err) {
            //             console.log(err);
            //             return next(createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`));
            //         }

            //         const newConversation = new Conversation({
            //             members: [
            //                 {
            //                     user: req.user._id,
            //                     role: "admin",
            //                     addedBy: req.user._id,
            //                     nickname: req.user.fullname,
            //                 },
            //             ],
            //             creator: req.user._id,
            //         });
            //         //name of conversation is name of 2 members
            //         const user1 = req.user;
            //         const user2 = data[0];

            //         newConversation.name = `${user1.fullname}, ${user2.fullname}`;
            //         //save the conversation
            //         const savedConversation = newConversation.save();

            //         //create message system
            //         const messageSystem = new Message({
            //             conversation: savedConversation._id,
            //             text: `<b>${req.user.fullname}</b> đã tạo cuộc hội thoại`,
            //             isSystem: true,
            //             });
            //         messageSystem.save();
                    
            //     });
                


            // });
            const ipAddress = IP.address();
            const data = await getLocationByIPAddress("192.168.2.250");
            return res.json(data);
        } catch (error) {
            console.log(error);
            return next(createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl}`));
        } 
    }

}

module.exports = new ConversationController();