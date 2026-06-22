const nodemailer = require('nodemailer');
const fs = require('fs'); // Built-in file system tool

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const subjects = ["Quick question regarding schedule", "Follow up from last week's notes"];
const bodies = ["Hey, just wanted to check if you had time to review those slides?", "Hi there, let me know your availability for a quick sync."];

// UPDATE THESE TO YOUR TEST RECEIVERS
const recipients = ['your_test_gmail@gmail.com', 'your_test_outlook@outlook.com'];

async function runWarmup() {
    const targetCount = Math.min(recipients.length, parseInt(process.env.DAILY_VOLUME || '2'));
    const shuffled = recipients.sort(() => 0.5 - Math.random());
    const selectedRecipients = shuffled.slice(0, targetCount);

    let webLogs = ""; // This will hold logs for your webpage

    for (const email of selectedRecipients) {
        const randomSubj = subjects[Math.floor(Math.random() * subjects.length)];
        const randomBody = bodies[Math.floor(Math.random() * bodies.length)];

        try {
            await transporter.sendMail({
                from: `"Warmup Bot" <${process.env.SMTP_USER}>`,
                to: email,
                subject: randomSubj,
                text: randomBody,
            });
            const successMsg = `✅ Sent email to: ${email}`;
            console.log(successMsg);
            webLogs += successMsg + "<br>";
            
            await new Promise(resolve => setTimeout(resolve, 5000)); // Short test delay
        } catch (error) {
            const errorMsg = `❌ Failed sending to ${email}`;
            console.error(errorMsg, error);
            webLogs += errorMsg + "<br>";
        }
    }

    // UPDATE THE HTML FILE WITH LOGS & TIMESTAMP
    try {
        let html = fs.readFileSync('index.html', 'utf8');
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        html = html.replace('', webLogs);
        html = html.replace('', timestamp);
        
        fs.writeFileSync('index.html', html);
        console.log("HTML Dashboard updated successfully.");
    } catch (err) {
        console.error("Failed to write to index.html", err);
    }
}

runWarmup();
