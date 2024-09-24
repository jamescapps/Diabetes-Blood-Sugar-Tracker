const User = require('../models/user.model');


const getUsers = (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: err.message }));
};

const addReading = (req, res) => {
    const { id, level, date } = req.body;
    const parsedDate = Date.parse(date);

    // Regex to ensure level is a 2 or 3 digit number
    const validLevel = /^\d{2,3}$/;

    // Check if user exists and then add the new reading
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            return res.status(500).send("Error contacting database");
        }

        if (!user) {
            return res.status(404).send("User ID not found");
        }

        if (!validLevel.test(level)) {
            return res.status(400).json('Please enter a 2 or 3 digit number.');
        }

        // Add new reading
        const newReading = { level, date: parsedDate };
        user.bloodSugar.push(newReading);

        user.save()
            .then(() => res.json('Reading added!'))
            .catch(err => res.status(400).json({ error: err.message }));
    });
};

const deleteReading = (req, res) => {
    const { userId, readingId } = req.params;

    User.updateOne({ _id: userId }, { $pull: { bloodSugar: { _id: readingId } } })
        .then(() => res.json('Reading deleted!'))
        .catch(err => res.status(400).json({ error: err.message }));
};

module.exports = {
    getUsers,
    addReading,
    deleteReading
};
