const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise'); // Use promise-based mysql2
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx'); // For processing XLS files
const moment = require('moment'); // For timestamp formatting

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use('/uploads', express.static('uploads')); 

// Database connection
let db;
const initializeDBConnection = async () => {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'stud_mngmnt_system',
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};
initializeDBConnection();

// File upload config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Route to handle XLS file upload and insert into a selected table
app.post('/upload-xls/:table', upload.single('file'), async (req, res) => {
    const { table } = req.params; // Get the table name from the route parameter
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Read the uploaded XLS file
        const workbook = xlsx.readFile(req.file.path);
        const sheet_name = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

        if (!sheet.length) {
            return res.status(400).json({ error: 'No data in uploaded file' });
        }

        // Dynamically generate SQL and insert data into the selected table
        const columns = Object.keys(sheet[0]); // Extract column names from the first row of data
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

        for (const row of sheet) {
            const values = columns.map((col) => row[col]);
            await db.query(sql, values);
        }

        // Send success response
        res.json({ message: `File uploaded and data inserted successfully into ${table}` });

    } catch (error) {
        console.error('Error processing XLS file:', error);
        res.status(500).json({ error: 'Error processing XLS file' });
    } finally {
        // Delete the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            }
        });
    }
});

// Routes
app.get('/api/settings', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM company_settings WHERE id = 1');
        res.send(result[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error fetching settings' });
    }
});

// Helper function to delete old logo
const deleteOldLogo = (logoUrl) => {
    if (!logoUrl) return;

    const logoPath = path.join(__dirname, logoUrl);
    fs.unlink(logoPath, (err) => {
        if (err) {
            console.error(`Error deleting old logo at ${logoPath}: ${err}`);
        } else {
            console.log(`Previous logo at ${logoPath} deleted successfully.`);
        }
    });
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user with the role of "Teacher"
        const query = `INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'Teacher')`;
        await db.query(query, [email, username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login code
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Query to fetch user based on the email
        const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                f_name: user.f_name,
                l_name: user.l_name,
            },
            process.env.SECRET || 'default_secret', // Ensure SECRET is set
            { expiresIn: '1h' }
        );

        res.json({
            token,
            email: user.email,
            username: user.username,
            role: user.role,
            f_name: user.f_name,
            l_name: user.l_name,
        });
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

// CRUD operations for student profiles
// Get all student profiles
app.get('/students', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM stud_profile');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching student profiles:', err);
        res.status(500).json({ error: 'Failed to fetch student profiles' });
    }
});

// Add a new student profile
app.post('/students', async (req, res) => {
    const {
        student_number, email, first_name, middle_name, last_name, course, section, 
        birthday, civil_status, citizenship, religion, home_address, zip_code, mobile_number
    } = req.body;

    // Validate required fields
    if (!student_number || !email || !first_name || !last_name || !course || !section || !birthday || !civil_status || !citizenship || !religion || !home_address || !zip_code || !mobile_number) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `INSERT INTO stud_profile (
            student_number, email, first_name, middle_name, last_name, course, section, 
            birthday, civil_status, citizenship, religion, home_address, zip_code, mobile_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
            student_number, email, first_name, middle_name, last_name, course, section,
            birthday, civil_status, citizenship, religion, home_address, zip_code, mobile_number
        ]);

        res.status(201).json({ message: 'Student profile added successfully' });
    } catch (err) {
        console.error('Error adding student profile:', err);
        res.status(500).json({ error: 'Failed to add student profile' });
    }
});

// Update a student profile
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const {
        student_number, email, first_name, middle_name, last_name, course, section, 
        birthday, civil_status, citizenship, religion, home_address, zip_code, mobile_number
    } = req.body;

    // Validate required fields
    if (!student_number || !email || !first_name || !last_name || !course || !section || !birthday || !civil_status || !citizenship || !religion || !home_address || !zip_code || !mobile_number) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `UPDATE stud_profile SET 
            student_number = ?, email = ?, first_name = ?, middle_name = ?, 
            last_name = ?, course = ?, section = ?, birthday = ?, civil_status = ?, 
            citizenship = ?, religion = ?, home_address = ?, zip_code = ?, mobile_number = ?
            WHERE id = ?`;

        const [result] = await db.query(query, [
            student_number, email, first_name, middle_name, last_name, course, section,
            birthday, civil_status, citizenship, religion, home_address, zip_code, mobile_number, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        res.status(200).json({ message: 'Student profile updated successfully' });
    } catch (err) {
        console.error('Error updating student profile:', err);
        res.status(500).json({ error: 'Failed to update student profile' });
    }
});

// Delete a student profile
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM stud_profile WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        res.status(200).json({ message: 'Student profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting student profile:', err);
        res.status(500).json({ error: 'Failed to delete student profile' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, f_name, l_name, email, role, status, mobile_number, birthday FROM users;');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update a user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email, username, f_name, l_name, role, mobile_number, birthday, status } = req.body;

    if (!email || !username || !f_name || !l_name || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            UPDATE users SET 
                email = ?, 
                username = ?, 
                f_name = ?, 
                l_name = ?, 
                role = ?, 
                mobile_number = ?, 
                birthday = ?, 
                status = ? 
            WHERE id = ?`;

        const [result] = await db.query(query, [email, username, f_name, l_name, role, mobile_number, birthday, status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM users WHERE id = ?';
        await db.query(query, [id]);
        res.status(204).send(); // No content
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// Update company settings
app.post('/api/settings', upload.single('logo'), async (req, res) => {
    const companyName = req.body.company_name || '';
    const headerColor = req.body.header_color || '#ffffff';
    const footerText = req.body.footer_text || '';
    const footerColor = req.body.footer_color || '#ffffff';
    const activeNavIndexColor = req.body.active_nav_index_color || '#000000'; // New color setting
    const companyNameColor = req.body.company_name_color || '#000000'; // New: Company Name Color
    const footerTextColor = req.body.footer_text_color || '#000000'; // New: Footer Text Color
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Fixed missing backtick

    try {
        const [result] = await db.query('SELECT * FROM company_settings WHERE id = 1');

        if (result.length > 0) {
            const oldLogoUrl = result[0].logo_url;

            const query = `
                UPDATE company_settings 
                SET 
                    company_name = ?, 
                    header_color = ?, 
                    footer_text = ?, 
                    footer_color = ?, 
                    active_nav_index_color = ?, 
                    company_name_color = ?, 
                    footer_text_color = ? 
                    ${logoUrl ? ', logo_url = ?' : ''}
                WHERE id = 1
            `;
            const params = [
                companyName,
                headerColor,
                footerText,
                footerColor,
                activeNavIndexColor,
                companyNameColor,
                footerTextColor,
            ];

            if (logoUrl) params.push(logoUrl);

            await db.query(query, params);

            if (logoUrl && oldLogoUrl) {
                deleteOldLogo(oldLogoUrl); // Delete old logo file if a new one is uploaded
            }

            res.send({ success: true });
        } else {
            const query = `
                INSERT INTO company_settings 
                (company_name, header_color, footer_text, footer_color, active_nav_index_color, company_name_color, footer_text_color, logo_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, [
                companyName,
                headerColor,
                footerText,
                footerColor,
                activeNavIndexColor,
                companyNameColor,
                footerTextColor,
                logoUrl,
            ]);
            res.send({ success: true });
        }
    } catch (err) {
        console.error('Error updating company settings:', err);
        return res.status(500).send({ error: 'Failed to update company settings' });
    }
});

// Get total number of registered students
app.get('/api/students/count', async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) AS total FROM stud_profile');
        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error fetching student count:', err);
        res.status(500).json({ error: 'Failed to fetch student count' });
    }
});

// Get distribution of students by section
app.get('/api/students/distribution/section', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT section, COUNT(*) AS count 
            FROM stud_profile 
            GROUP BY section
        `);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching section distribution:', err);
        res.status(500).json({ error: 'Failed to fetch section distribution' });
    }
});

// Get distribution of students by course
app.get('/api/students/distribution/course', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT course, COUNT(*) AS count 
            FROM stud_profile 
            GROUP BY course
        `);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching course distribution:', err);
        res.status(500).json({ error: 'Failed to fetch course distribution' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
