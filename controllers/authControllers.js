const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

//signup
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password) {
            res.status(400).json({ error: 'password is required!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        console.log(password);
        // const newUser = new User({ email, password: hashedPassword });

        const savedUser = await User.create({
            email: email,
            password: hashedPassword,
        })

        console.log(savedUser);

        // const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
        res.status(400).json({ error: `User already exists -> ${err}` });
    }
}

//login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    sendEmail(user.email);

    res.status(201).json({ token });
}

//function to send email
const sendEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Login Notification',
        text: 'You have been successfully logged in',
    }

    await transporter.sendMail(mailOptions);
}