import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/messages.model.js";

export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) return res.status(400).json({ message: 'Search Term required' })
        const sanitizedSerachterm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(sanitizedSerachterm, "i");
        const contacts = await User.find({
            $and: [{ _id: { $ne: req.userId } }, { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }],
        });
        if (contacts) {
            const allUser = contacts.map((contact) => {
                const { password: _, ...safeUser } = contact.toObject();
                return safeUser;
            })

            res.status(200).json(allUser)
        } else {
            return res.status(400).json({ message: 'User not found.' })

        }

    } catch {
        res.status(500).json({ message: e.message })
    }
}
export const getContactsforDMList = async (req, res, next) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            },
            {
                $sort: { timeStamp: -1 } // sort before grouping to get latest messages
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', userId] },
                            '$recipient',
                            '$sender'
                        ]
                    },
                    lastMessageTime: { $first: '$timeStamp' },
                    lastMessageText: { $first: '$text' }, // optional: include message text
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            { $unwind: '$contactInfo' },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: '$contactInfo.email',
                    firstName: '$contactInfo.firstName',
                    lastName: '$contactInfo.lastName',
                    image: '$contactInfo.image',
                    color: '$contactInfo.color'
                }
            },
            { $sort: { lastMessageTime: -1 } }
        ]);

        res.status(200).json({ contacts });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "firstName lastName _id email");
        const contacts = users.map((user) => (
            {
                label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
                value: user._id

            }
        ))
        res.status(200).json({ contacts });

    } catch (error) {
        res.status(500).json({ message: e.message });
    }

}