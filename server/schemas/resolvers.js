const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
    Query: {
        userProfile: async (_parent, { id, username }) => {
            return User.findOne({
                $or: [{ _id: id }, { username: username }],
            });
        },
        me: async (_parent, _agrs, context) => {
            if (context.user) return User.findOne({ _id: context.user._id });
            throw AuthenticationError;
        }
    },

    Mutation: {
        addUser: async (_parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (_parent, { username, email, password }) => {
            const user = await User.findOne({
                $or: [{ username: username }, { email: email }]
            });

            if (!user) throw AuthenticationError;

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) throw AuthenticationError;

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_parent, { book }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true });
            }
            throw AuthenticationError;
        },
        deleteBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { saveBooks: { bookId: bookId } } },
                    { new: true }
                )
            }
            throw AuthenticationError;
        }
    }
}

module.exports = resolvers;