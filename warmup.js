const nodemailer = require('nodemailer');
const fs = require('fs'); // Built-in file system tool

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const subjects = ["Quick question regarding schedule", "Follow up from last week's notes", "Checking in on project status"];
const bodies = ["Hey, just wanted to check if you had time to review those slides?", "Hi there, let me know your availability for a quick sync.", "Checking in to see if we are still on track for Friday. Thanks!"];

// FIXED: Added missing quotes around the third email address
const recipients = [
    'dickehebert@gmail.com', 
    'rengarajan03@live.com', 
    'rengarajan03@icloud.com'
];

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
            
            // Wait 30 seconds between emails to act human
            await new Promise(resolve => setTimeout(resolve, 30000)); 
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
        
        // FIXED: Re-added the proper template replacement keywords
        html = html.replace('', webLogs);
        html = html.replace('', timestamp);
        
        fs.writeFileSync('index.html', html);
        console.log("HTML Dashboard updated successfully.");
    } catch (err) {
        console.error("Failed to write to index.html", err);
    }
}

runWarmup();
